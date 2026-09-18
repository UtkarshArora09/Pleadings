import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0E1016',
          borderRadius: '36px',
          border: '4px solid rgba(212, 175, 55, 0.6)',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical thick pillar / stem with rounded bottom */}
          <path
            d="M22 18 C22 13 26 9 31 9 H38 V92 C38 97 34 101 29 101 C25 101 22 97 22 92 V18 Z"
            fill="#F3EFE6"
          />
          {/* Bottom dot below stem */}
          <circle cx="30" cy="112" r="5.5" fill="#D4AF37" />
          {/* Folded paper document bowl */}
          <path
            d="M38 9 H72 L86 23 V76 C86 82 81 87 75 87 H38 V9 Z"
            fill="#F3EFE6"
          />
          {/* Folded dog-ear corner triangle cutout */}
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
      </div>
    ),
    {
      ...size,
    }
  );
}
