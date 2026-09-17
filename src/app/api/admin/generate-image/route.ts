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
    const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN;

    let imageBuffer: Buffer | null = null;
    let usedProvider = '';

    // 1. ATTEMPT GEMINI IMAGEN 3 (if key provided)
    if (geminiKey && geminiKey.trim() !== '') {
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
        } else {
          const errText = await response.text();
          console.warn('Gemini Imagen 3 returned non-200, activating FLUX fallback:', response.status, errText);
        }
      } catch (geminiErr) {
        console.warn('Gemini Imagen error, activating FLUX fallback:', geminiErr);
      }
    }

    // 2. ATTEMPT HUGGING FACE INFERENCE (if token provided)
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

    // 3. ATTEMPT HIGH-SPEED FLUX.1 SCHNELL CLOUD GENERATOR (Guaranteed Fallback)
    if (!imageBuffer) {
      try {
        console.log('⚡ Generating high-res 16:9 visual via FLUX.1 Cloud Engine...');
        const cleanPrompt = encodeURIComponent(prompt.slice(0, 400));
        const fluxUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=576&model=flux&nologo=true&seed=${Date.now()}`;
        
        const fluxRes = await fetch(fluxUrl, {
          method: 'GET',
          headers: { 'User-Agent': 'Pleadings-Legal-Media/1.0' },
        });

        if (fluxRes.ok) {
          const arrayBuf = await fluxRes.arrayBuffer();
          if (arrayBuf.byteLength > 2000) {
            imageBuffer = Buffer.from(arrayBuf);
            usedProvider = 'FLUX.1 Schnell (High-Res Cloud Engine)';
          }
        }
      } catch (fluxErr) {
        console.warn('FLUX cloud engine error:', fluxErr);
      }
    }

    if (!imageBuffer) {
      return NextResponse.json(
        {
          success: false,
          error:
            'All automated AI generators were busy. Please copy the prompt above and upload your image directly using the Upload button.',
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
