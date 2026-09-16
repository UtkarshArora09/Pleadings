import { ImageResponse } from 'next/og';
import { getCaseBySlug } from '@/lib/cases';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);

  const title = caseItem ? caseItem.title : 'Landmark Indian Precedent';
  const court = caseItem ? `${caseItem.court} · ${caseItem.year}` : 'Supreme Court of India';
  const hook = caseItem ? caseItem.hook : 'Verified judgment breakdown with paragraph-by-paragraph sources.';
  const citation = caseItem ? caseItem.citations.primary : 'AIR Precedent';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0E1016',
          color: '#F3EFE6',
          padding: '60px 70px',
          fontFamily: 'serif',
          backgroundImage: 'radial-gradient(circle at 80% 20%, #1A2035 0%, #0E1016 70%)'
        }}
      >
        {/* Top Branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'monospace',
              letterSpacing: '0.25em',
              color: '#D4AF37',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            PLEADINGS · CERTIFIED JUDGMENT STORY
          </div>
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'monospace',
              color: '#34D399',
              backgroundColor: 'rgba(6, 78, 59, 0.6)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '6px 16px',
              borderRadius: '6px'
            }}
          >
            {court}
          </div>
        </div>

        {/* Center Case Title & Hook */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: '54px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              lineHeight: 1.15,
              textTransform: 'uppercase'
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#E0DCD3',
              lineHeight: 1.4,
              fontStyle: 'italic'
            }}
          >
            "{hook}"
          </div>
        </div>

        {/* Bottom Citation & Verified Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '20px'
          }}
        >
          <div style={{ fontSize: '18px', fontFamily: 'monospace', color: '#a9a49a' }}>
            Citation: <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{citation}</span>
          </div>
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'monospace',
              color: '#D4AF37',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}
          >
            pleadings.in
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
