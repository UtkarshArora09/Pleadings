import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
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
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(212, 175, 55, 0.15) 0%, transparent 60%), radial-gradient(circle at 15% 85%, rgba(20, 24, 38, 0.8) 0%, #0E1016 70%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        }}
      >
        {/* Top Masthead */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg
              width="44"
              height="52"
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 18 C22 13 26 9 31 9 H38 V92 C38 97 34 101 29 101 C25 101 22 97 22 92 V18 Z"
                fill="#F3EFE6"
              />
              <circle cx="30" cy="112" r="5.5" fill="#D4AF37" />
              <path
                d="M38 9 H72 L86 23 V76 C86 82 81 87 75 87 H38 V9 Z"
                fill="#F3EFE6"
              />
              <path
                d="M72 9 L86 23 H72 V9 Z"
                fill="#0E1016"
              />
              <path
                d="M72 9 L86 23"
                stroke="#D4AF37"
                strokeWidth="3.5"
              />
            </svg>
            <div
              style={{
                fontSize: '34px',
                fontFamily: 'sans-serif',
                fontWeight: 900,
                letterSpacing: '0.18em',
                color: '#F3EFE6',
              }}
            >
              PLEADINGS
            </div>
          </div>

          <div
            style={{
              fontSize: '16px',
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              color: '#D4AF37',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '8px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
            }}
          >
            WWW.PLEADINGS.IN
          </div>
        </div>

        {/* Central Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: '15px',
              fontFamily: 'monospace',
              letterSpacing: '0.25em',
              color: '#D4AF37',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            CERTIFIED INDIAN COURT JUDGMENTS AS VERIFIED STORIES
          </div>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            The Legal Media Platform for Landmark Precedents.
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#C7C2B6',
              lineHeight: 1.4,
              fontFamily: 'sans-serif',
            }}
          >
            Nanavati · Kesavananda Bharati · Maneka Gandhi · Puttaswamy Privacy · M.C. Mehta · IPC to BNS
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px', fontSize: '15px', fontFamily: 'monospace', color: '#A9A49A' }}>
            <span>Verified Official Judgments</span>
            <span>·</span>
            <span>IPC to BNS 2023 Statutory Concordance</span>
            <span>·</span>
            <span>Bilingual EN / Hindi</span>
          </div>

          <div
            style={{
              fontSize: '15px',
              fontFamily: 'monospace',
              color: '#D4AF37',
              fontWeight: 'bold',
            }}
          >
            pleadings.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
