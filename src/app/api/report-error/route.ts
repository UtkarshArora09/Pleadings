import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, episode, description, reporterEmail } = body;

    if (!slug || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (slug and description).' },
        { status: 400 }
      );
    }

    console.log(`[Editorial Correction Logged] Case: ${slug}, Episode: ${episode || 'General'}, Desc: ${description}, Contact: ${reporterEmail || 'Anonymous'}`);

    return NextResponse.json({
      success: true,
      message: 'Correction report submitted to editorial board successfully.'
    });
  } catch (error) {
    console.error('Error submitting correction report:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
