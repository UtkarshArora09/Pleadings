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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const slug = (formData.get('slug') as string) || 'case';
    const type = (formData.get('type') as string) || 'poster';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided in upload request.' },
        { status: 400 }
      );
    }

    // Validate file type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Please upload JPG, PNG, or WebP images.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine target file path
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const safeType = type.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const fileName = `${safeSlug}-${safeType}-${Date.now()}.${ext}`;

    let publicUrl = `/images/cases/${fileName}`;
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'cases');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
    } catch (fsErr) {
      console.warn('Filesystem write failed (Vercel serverless environment), returning Data URI:', fsErr);
      const mime = file.type || (ext === 'png' ? 'image/png' : 'image/jpeg');
      publicUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (error) {
    console.error('Error handling admin image upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal upload error',
      },
      { status: 500 }
    );
  }
}
