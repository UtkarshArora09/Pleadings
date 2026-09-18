import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isRequestAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin credentials required.' },
      { status: 401 }
    );
  }

  try {
    const { prompt, slug = 'case', type = 'poster', aspectRatio = '16:9' } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Image prompt is required for AI generation.' },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const togetherKey = process.env.TOGETHER_API_KEY || process.env.TOGETHERAI_API_KEY;
    const deepinfraKey = process.env.DEEPINFRA_TOKEN || process.env.DEEPINFRA_API_KEY;
    const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN;

    let imageBuffer: Buffer | null = null;
    let usedProvider = '';

    // 1. ATTEMPT TOGETHER AI FLUX.1 SCHNELL (High-Speed & Ultra-Reliable)
    if (!imageBuffer && togetherKey && togetherKey.trim() !== '') {
      try {
        const togRes = await fetch('https://api.together.xyz/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${togetherKey.trim()}`,
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
          } else if (togData.data?.[0]?.url) {
            const imgFetch = await fetch(togData.data[0].url);
            if (imgFetch.ok) {
              imageBuffer = Buffer.from(await imgFetch.arrayBuffer());
              usedProvider = 'Together AI (FLUX.1 Schnell)';
            }
          }
        } else {
          const errBody = await togRes.text();
          console.warn('Together AI error response:', togRes.status, errBody);
        }
      } catch (togErr) {
        console.warn('Together AI generation failed:', togErr);
      }
    }

    // 2. ATTEMPT OPENAI DALL-E 3 / 2 (if key provided)
    if (!imageBuffer && openaiKey && openaiKey.trim() !== '') {
      try {
        const oaiRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey.trim()}`,
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
      } catch (oaiErr) {
        console.warn('OpenAI image generation failed:', oaiErr);
      }
    }

    // 3. ATTEMPT DEEPINFRA FLUX (if key provided)
    if (!imageBuffer && deepinfraKey && deepinfraKey.trim() !== '') {
      try {
        const diRes = await fetch('https://api.deepinfra.com/v1/inference/black-forest-labs/FLUX-1-schnell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${deepinfraKey.trim()}`,
          },
          body: JSON.stringify({
            prompt,
            width: 1024,
            height: 576,
          }),
        });

        if (diRes.ok) {
          const diData = await diRes.json();
          if (diData.images?.[0]) {
            const b64 = diData.images[0].replace(/^data:image\/\w+;base64,/, '');
            imageBuffer = Buffer.from(b64, 'base64');
            usedProvider = 'DeepInfra (FLUX.1)';
          }
        }
      } catch (diErr) {
        console.warn('DeepInfra image generation failed:', diErr);
      }
    }

    // 4. ATTEMPT GEMINI IMAGEN 3 (if key provided)
    if (!imageBuffer && geminiKey && geminiKey.trim() !== '') {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey.trim()}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: aspectRatio === '21:9' ? '16:9' : aspectRatio,
              outputMimeType: 'image/jpeg',
              personGeneration: 'ALLOW_ADULT',
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.predictions?.[0]?.bytesBase64Encoded) {
            imageBuffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
            usedProvider = 'Google Gemini Imagen 3';
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini Imagen error:', geminiErr);
      }
    }

    // 5. ATTEMPT HUGGING FACE INFERENCE (if token provided)
    if (!imageBuffer && hfToken && hfToken.trim() !== '') {
      try {
        const hfModels = [
          'black-forest-labs/FLUX.1-schnell',
          'stabilityai/stable-diffusion-3.5-large-turbo',
          'stabilityai/stable-diffusion-xl-base-1.0',
        ];

        for (const model of hfModels) {
          try {
            const hfRes = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${hfToken.trim()}`,
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
          } catch (modelErr) {
            console.warn(`HF Model ${model} failed:`, modelErr);
          }
        }
      } catch (hfErr) {
        console.warn('Hugging Face inference error:', hfErr);
      }
    }

    // 4. ATTEMPT HIGH-SPEED POLLINATIONS CLOUD GENERATOR (Multi-model cascade)
    if (!imageBuffer) {
      // Clean and sanitize prompt for URL query
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
        `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=576&nologo=true&seed=${Math.floor(Math.random() * 999999)}`,
      ];

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

          const fluxRes = await fetch(endpoint, {
            method: 'GET',
            headers: {
              Accept: 'image/jpeg,image/png,image/*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Pleadings/1.0',
            },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (fluxRes.ok) {
            const arrayBuf = await fluxRes.arrayBuffer();
            if (arrayBuf.byteLength > 2000) {
              imageBuffer = Buffer.from(arrayBuf);
              usedProvider = endpoint.includes('model=flux')
                ? 'FLUX.1 Schnell'
                : 'Pollinations Cloud AI';
              break;
            }
          }
        } catch (fluxErr) {
          console.warn('Pollinations attempt failed, trying fallback model...', fluxErr);
        }
      }
    }

    if (!imageBuffer) {
      return NextResponse.json(
        {
          success: false,
          error:
            'All automated AI generators are currently busy or rate-limited. Please copy the prompt and upload your image directly using the Upload button.',
        },
        { status: 502 }
      );
    }

    // Save image to Supabase Storage or public/images/cases/
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const safeType = type.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const fileName = `${safeSlug}-${safeType}-${Date.now()}.jpg`;

    let publicUrl = `/images/cases/${fileName}`;

    // 1. Attempt Supabase Storage upload (permanent cloud storage accessible across production & localhost)
    const { uploadImageToSupabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (isSupabaseConfigured()) {
      const supabaseUrl = await uploadImageToSupabase(imageBuffer, fileName, 'image/jpeg');
      if (supabaseUrl) {
        publicUrl = supabaseUrl;
      }
    }

    // 2. Fallback: Local filesystem or Data URI
    if (!publicUrl.startsWith('http')) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'cases');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, imageBuffer);
      } catch (fsErr) {
        console.warn('Filesystem write failed (Vercel serverless environment), returning Data URI:', fsErr);
        publicUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      provider: usedProvider,
    });
  } catch (error) {
    console.error('Error generating image via AI pipeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image via AI pipeline',
      },
      { status: 500 }
    );
  }
}
