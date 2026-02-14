import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AreWeOkay - Find Your Truth',
    short_name: 'AreWeOkay',
    description: 'Anonymous relationship reality platform. Not every love is forever.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e63462',
    icons: [
      {
        src: '/og-image.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/og-image.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}