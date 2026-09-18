import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pleadings — Landmark Indian Court Judgments',
    short_name: 'Pleadings',
    description: 'Transforming certified Indian court judgments into transparent, episodic legal stories and briefs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E1016',
    theme_color: '#0E1016',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48 32x32 16x16',
        type: 'image/x-icon',
      },
    ],
  };
}
