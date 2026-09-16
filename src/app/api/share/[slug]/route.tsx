import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getCaseBySlug } from '@/lib/cases';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = req.nextUrl.searchParams;
  const agree = searchParams.get('agree') === 'true';

  const caseItem = getCaseBySlug(slug);
  const title = caseItem ? caseItem.title : 'PLEADINGS LANDMARK CASE';
  const court = caseItem ? `${caseItem.court} · ${caseItem.year}` : 'Supreme Court of India';
  const statusCode = caseItem?.status?.code || 'GOOD_LAW';

  const statusDisplay = {
    GOOD_LAW: '✅ STILL GOOD LAW',
    PARTLY_SUPERSEDED: '⚠️ PARTLY SUPERSEDED',
    OVERRULED: '✕ OVERRULED',
    STATUTE_REPLACED: '⚖ STATUTE REPLACED'
  }[statusCode] || '✅ GOOD LAW';

  const headline = agree
    ? `I ruled for the petitioner.\n${caseItem?.court || 'The Court'} did too.`
    : `I voted against the ruling.\n${caseItem?.court || 'The Court'} disagreed.`;

  const subline = agree
    ? 'You agreed with the majority of readers and with the judicial ratio.'
    : 'You weighed the evidence differently from the bench.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1350px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0E1016',
          color: '#F3EFE6',
          padding: '100px 80px',
          fontFamily: 'serif',
          backgroundImage: 'radial-gradient(circle at 50% 30%, #1A1F2E 0%, #0E1016 70%)'
        }}
      >
        {/* Top Masthead */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'monospace',
              letterSpacing: '0.3em',
              color: '#D4AF37',
              textTransform: 'uppercase'
            }}
          >
            PLEADINGS · VERDICT CHALLENGE
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 1.25,
              color: '#FFFFFF',
              whiteSpace: 'pre-line'
            }}
          >
            {headline}
          </div>
        </div>

        {/* Central Case Box */}
        <div
          style={{
            width: '100%',
            maxWidth: '860px',
            backgroundColor: '#141824',
            border: '3px solid #D4AF37',
            borderRadius: '16px',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'monospace',
              color: '#D4AF37',
              letterSpacing: '0.2em',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}
          >
            {court}
          </div>
          <div
            style={{
              fontSize: '60px',
              fontWeight: '900',
              textAlign: 'center',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '28px',
              textTransform: 'uppercase'
            }}
          >
            {title}
          </div>
          <div
            style={{
              backgroundColor: '#0E1016',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '8px',
              padding: '12px 28px',
              fontSize: '22px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: '#34D399',
              letterSpacing: '0.15em'
            }}
          >
            {statusDisplay}
          </div>
        </div>

        {/* Bottom Social Proof & Footer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div
            style={{
              fontSize: '28px',
              color: '#E0DCD3',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.4
            }}
          >
            {subline}
          </div>
          <div
            style={{
              fontSize: '26px',
              fontFamily: 'monospace',
              color: '#D4AF37',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            pleadings.in
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350
    }
  );
}
