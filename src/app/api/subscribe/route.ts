import { NextRequest, NextResponse } from 'next/server';
import { saveJsonToSupabaseStorage } from '@/lib/supabase';
import { sendAdminAlertEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contact, channel, caseSlug, frequency } = body;

    if (!contact || typeof contact !== 'string' || !contact.trim()) {
      return NextResponse.json(
        { success: false, error: 'Contact details (email or WhatsApp) are required.' },
        { status: 400 }
      );
    }

    const cleanContact = contact.trim();
    const cleanChannel = channel === 'email' ? 'email' : 'whatsapp';
    const record = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      contact: cleanContact,
      channel: cleanChannel,
      caseSlug: caseSlug || 'general',
      frequency: frequency || 'daily-3min',
      subscribedAt: new Date().toISOString(),
    };

    const safeKey = cleanContact.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const savedToSupabase = await saveJsonToSupabaseStorage(
      `subscribers/${Date.now()}-${safeKey}.json`,
      record
    );

    await sendAdminAlertEmail({
      subject: `[Daily 3-Min Case] New ${cleanChannel.toUpperCase()} Subscriber: ${cleanContact}`,
      heading: 'NEW DAILY 3-MIN CASE SUBSCRIBER',
      fields: [
        { label: 'Channel', value: cleanChannel.toUpperCase() },
        { label: 'Contact', value: cleanContact },
        { label: 'Source Case', value: record.caseSlug },
        { label: 'Frequency', value: record.frequency },
        { label: 'Saved to Storage', value: savedToSupabase ? 'Yes' : 'Fallback / Email only' },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed. Tomorrow's case will be dispatched at 8:00 AM.",
      contact: cleanContact,
      channel: cleanChannel,
      persisted: savedToSupabase,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
