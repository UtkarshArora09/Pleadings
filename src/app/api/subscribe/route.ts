import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contact, channel, caseSlug, frequency } = body;

    if (!contact || typeof contact !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Contact details (email or WhatsApp) are required.' },
        { status: 400 }
      );
    }

    console.log(`📬 New Daily 3-Min Case Subscriber: ${contact} via ${channel} (Case: ${caseSlug || 'General'})`);

    // In-memory or database recording
    return NextResponse.json({
      success: true,
      message: 'Subscription confirmed. Tomorrow\'s case will be dispatched at 8:00 AM.',
      contact,
      channel,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
