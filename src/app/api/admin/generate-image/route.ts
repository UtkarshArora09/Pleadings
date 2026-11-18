import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { isRequestAuthenticated } from '@/lib/auth';
import { GenerateImageSchema } from '@/lib/security/schemas';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 25000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin credentials required.' },
      { status: 401 }
    );
  }

  const clientIp = getClientIp(request);
  const rl = await checkRateLimit(clientIp, {
    prefix: 'admin-gen-image',
    limit: 15,
    windowSec: 5 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Image generation rate limit exceeded. Please wait a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = GenerateImageSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Valid image prompt is required.' },
        { status: 400 }
      );
    }

    const { prompt, slug, type, aspectRatio } = parsed.data;

    const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '').trim();
    const openaiKey = (process.env.OPENAI_API_KEY || '').trim();
    const togetherKey = (process.env.TOGETHER_API_KEY || process.env.TOGETHERAI_API_KEY || '').trim();
    const deepinfraKey = (process.env.DEEPINFRA_TOKEN || process.env.DEEPINFRA_API_KEY || '').trim();
    const hfToken = (process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN || '').trim();

    let imageBuffer: Buffer | null = null;
    let usedProvider = '';

    // 1. Together AI FLUX.1 Schnell
    if (!imageBuffer && togetherKey) {
      try {
        const togRes = await fetchWithTimeout('https://api.together.xyz/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${togetherKey}`,
          },
          body: JSON.stringify({
            model: 'black-forest-labs/FLUX.1-schnell',
            prompt,
            width: 1024,
            height: 576,
            steps: 4,
            response_format: 'b64_json',
          }),
        });

        if (togRes.ok) {
          const togData = await togRes.json();
          const b64 = togData.data?.[0]?.b64_json;
          if (b64) {
            imageBuffer = Buffer.from(b64, 'base64');
            usedProvider = 'Together AI (FLUX.1 Schnell)';
          } else if (typeof togData.data?.[0]?.url === 'string' && togData.data[0].url.startsWith('https://')) {
            const imgFetch = await fetchWithTimeout(togData.data[0].url, { method: 'GET' }, 15000);
            if (imgFetch.ok) {
              imageBuffer = Buffer.from(await imgFetch.arrayBuffer());
              usedProvider = 'Together AI (FLUX.1 Schnell)';
            }
          }
        }
      } catch {
        // try next provider
      }
    }

    // 2. OpenAI DALL-E
    if (!imageBuffer && openaiKey) {
      try {
        const oaiRes = await fetchWithTimeout('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            prompt: prompt.slice(0, 1000),
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
          }),
        });

        if (oaiRes.ok) {
          const oaiData = await oaiRes.json();
          const b64 = oaiData.data?.[0]?.b64_json;
          if (b64) {
            imageBuffer = Buffer.from(b64, 'base64');
            usedProvider = 'OpenAI DALL-E';
          }
        }
      } catch {
        // try next provider
      }
    }

    // 3. DeepInfra FLUX
    if (!imageBuffer && deepinfraKey) {
      try {
        const diRes = await fetchWithTimeout(
          'https://api.deepinfra.com/v1/inference/black-forest-labs/FLUX-1-schnell',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${deepinfraKey}`,
            },
            body: JSON.stringify({
              prompt,
              width: 1024,
              height: 576,
            }),
          }
        );

        if (diRes.ok) {
          const diData = await diRes.json();
          if (diData.images?.[0]) {
            const b64 = String(diData.images[0]).replace(/^data:image\/\w+;base64,/, '');
            imageBuffer = Buffer.from(b64, 'base64');
            usedProvider = 'DeepInfra (FLUX.1)';
          }
        }
      } catch {
        // try next provider
      }
    }

    // 4. Google Gemini Imagen 3 — API key passed via x-goog-api-key header (never query string!)
    if (!imageBuffer && geminiKey) {
      try {
        const response = await fetchWithTimeout(
          'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': geminiKey,
            },
            body: JSON.stringify({
              instances: [{ prompt }],
              parameters: {
                sampleCount: 1,
                aspectRatio: aspectRatio === '21:9' ? '16:9' : aspectRatio,
                outputMimeType: 'image/jpeg',
                personGeneration: 'ALLOW_ADULT',
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.predictions?.[0]?.bytesBase64Encoded) {
            imageBuffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
            usedProvider = 'Google Gemini Imagen 3';
          }
        }
      } catch {
        // try next provider
      }
    }

    // 5. Hugging Face Inference
    if (!imageBuffer && hfToken) {
      const hfModels = [
        'black-forest-labs/FLUX.1-schnell',
        'stabilityai/stable-diffusion-3.5-large-turbo',
        'stabilityai/stable-diffusion-xl-base-1.0',
      ];

      for (const model of hfModels) {
        try {
          const hfRes = await fetchWithTimeout(`https://router.huggingface.co/hf-inference/models/${model}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${hfToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: prompt }),
          });

          if (hfRes.ok) {
            const arrayBuf = await hfRes.arrayBuffer();
            if (arrayBuf.byteLength > 1000) {
              imageBuffer = Buffer.from(arrayBuf);
              usedProvider = `Hugging Face (${model.split('/').pop()})`;
              break;
            }
          }
        } catch {
          // continue
        }
      }
    }

    // 6. Pollinations fallback
    if (!imageBuffer) {
      const cleanPrompt = encodeURIComponent(
        prompt
          .replace(/[^\w\s,.-]/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 300)
      );

      const endpoints = [
        `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=576&model=flux&nologo=true&seed=${Math.floor(Math.random() * 999999)}`,
        `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=576&model=turbo&nologo=true&seed=${Math.floor(Math.random() * 999999)}`,
      ];

      for (const endpoint of endpoints) {
        try {
          const fluxRes = await fetchWithTimeout(
            endpoint,
            {
              method: 'GET',
              headers: {
                Accept: 'image/jpeg,image/png,image/*',
                'User-Agent': 'Pleadings/1.0',
              },
            },
            20000
          );

          if (fluxRes.ok) {
            const arrayBuf = await fluxRes.arrayBuffer();
            if (arrayBuf.byteLength > 2000) {
              imageBuffer = Buffer.from(arrayBuf);
              usedProvider = endpoint.includes('model=flux') ? 'FLUX.1 Schnell' : 'Pollinations Cloud AI';
              break;
            }
          }
        } catch {
          // continue
        }
      }
    }

    if (!imageBuffer) {
      return NextResponse.json(
        {
          success: false,
          error:
            'All automated AI generators are currently busy or rate-limited. Please upload your image directly using the Upload button.',
        },
        { status: 502 }
      );
    }

    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 60) || 'case';
    const safeType = type.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 30) || 'poster';
    const fileName = `${safeSlug}-${safeType}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.jpg`;

    let publicUrl = `/images/cases/${fileName}`;

    const { uploadImageToSupabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (isSupabaseConfigured()) {
      const supabaseUrl = await uploadImageToSupabase(imageBuffer, fileName, 'image/jpeg');
      if (supabaseUrl) {
        publicUrl = supabaseUrl;
      }
    }

    if (!publicUrl.startsWith('http')) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'cases');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, fileName), imageBuffer);
      } catch {
        publicUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      }
    }

    logSecurityEvent('admin_image_generated', 'info', { ip: clientIp, provider: usedProvider, fileName });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      provider: usedProvider,
    });
  } catch {
    logSecurityEvent('admin_image_gen_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Failed to generate image via AI pipeline.' },
      { status: 500 }
    );
  }
}
