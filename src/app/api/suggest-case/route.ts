import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caseName,
      courtOrCity,
      year,
      storySynopsis,
      contributorName,
      contributorContact,
    } = body;

    if (!caseName?.trim() || !storySynopsis?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide the case name/topic and what happened.' },
        { status: 400 }
      );
    }

    console.log(`💡 [Reader Case Suggestion Received]`, {
      caseName,
      courtOrCity: courtOrCity || 'Not specified',
      year: year || 'Unknown',
      contributor: contributorName || 'Anonymous',
      contact: contributorContact || 'None',
      synopsisPreview: storySynopsis.slice(0, 100),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your case suggestion has been received by our editorial team.',
    });
  } catch (err: any) {
    console.error('Suggest case error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit case suggestion' },
      { status: 500 }
    );
  }
}
