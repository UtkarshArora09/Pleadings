import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '7px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 90 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Red Bar */}
          <rect x="6" y="8" width="36" height="5" rx="1.5" fill="#E50914" />
          {/* Capital */}
          <rect x="9" y="13" width="30" height="3.5" rx="0.5" fill="#FFFFFF" />
          {/* Shaft */}
          <rect x="13" y="16.5" width="22" height="63.5" fill="#FFFFFF" />
          {/* Flutes */}
          <line x1="17.5" y1="20" x2="17.5" y2="76" stroke="#0E1016" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="20" x2="24" y2="76" stroke="#0E1016" strokeWidth="2" strokeLinecap="round" />
          <line x1="30.5" y1="20" x2="30.5" y2="76" stroke="#0E1016" strokeWidth="2" strokeLinecap="round" />
          {/* Base */}
          <rect x="9" y="80" width="30" height="3.5" rx="0.5" fill="#FFFFFF" />
          <rect x="6" y="83.5" width="36" height="5.5" rx="1.5" fill="#FFFFFF" />
          {/* Bowl */}
          <path
            d="M35 13 C 58 13, 80 23, 80 45 C 80 66, 58 72, 35 72 V 60.5 C 51 60.5, 64 55, 64 45 C 64 33, 51 24.5, 35 24.5 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
