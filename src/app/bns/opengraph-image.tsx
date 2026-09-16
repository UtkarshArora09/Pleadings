import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image() {
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
          padding: '70px 80px',
          fontFamily: 'serif',
          backgroundImage: 'radial-gradient(circle at 50% 30%, #172033 0%, #0E1016 75%)'
        }}
      >
        <div
          style={{
            fontSize: '22px',
            fontFamily: 'monospace',
            letterSpacing: '0.25em',
            color: '#D4AF37',
            textTransform: 'uppercase'
          }}
        >
          PLEADINGS LEGAL TOOLS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '58px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              lineHeight: 1.15
            }}
          >
            IPC → BNS Statutory Concordance & Case Mapper
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#34D399',
              fontFamily: 'monospace'
            }}
          >
            IPC §302 ➔ BNS §103 · CrPC §154 ➔ BNSS §173 · IEA §27 ➔ BSA §23
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '20px'
          }}
        >
          <div style={{ fontSize: '18px', color: '#a9a49a', fontFamily: 'sans-serif' }}>
            Instant bi-directional legal mapping cross-referenced with certified judgments
          </div>
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'monospace',
              color: '#D4AF37',
              letterSpacing: '0.2em'
            }}
          >
            pleadings.in/bns
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
