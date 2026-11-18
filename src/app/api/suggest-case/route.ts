import { NextRequest, NextResponse } from 'next/server';
import { saveJsonToSupabaseStorage } from '@/lib/supabase';
import { sendAdminAlertEmail } from '@/lib/email';

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

    const record = {
      id: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      caseName: caseName.trim(),
      courtOrCity: courtOrCity?.trim() || 'Not specified',
      year: year?.trim() || 'Unknown',
      storySynopsis: storySynopsis.trim(),
      contributorName: contributorName?.trim() || 'Anonymous',
      contributorContact: contributorContact?.trim() || 'None',
      submittedAt: new Date().toISOString(),
    };

    const safeTitle = record.caseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const savedToSupabase = await saveJsonToSupabaseStorage(
      `suggestions/${Date.now()}-${safeTitle}.json`,
      record
    );

    await sendAdminAlertEmail({
      subject: `[Case Suggestion] ${record.caseName}`,
      heading: 'NEW READER CASE SUGGESTION',
      fields: [
        { label: 'Case / Topic', value: record.caseName },
        { label: 'Court / City', value: record.courtOrCity },
        { label: 'Year', value: record.year },
        { label: 'Story Synopsis', value: record.storySynopsis },
        { label: 'Suggested By', value: record.contributorName },
        { label: 'Contact', value: record.contributorContact },
        { label: 'Saved to Storage', value: savedToSupabase ? 'Yes' : 'Fallback / Email only' },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your case suggestion has been received by our editorial team.',
      persisted: savedToSupabase,
    });
  } catch (err: any) {
    console.error('Suggest case error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit case suggestion' },
      { status: 500 }
    );
  }
}
