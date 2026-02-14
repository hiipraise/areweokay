import { Metadata } from 'next'

interface GenerateMetadataProps {
  title: string
  description: string
  type?: string
  sessionId?: string
}

export function generateSessionMetadata({
  title,
  description,
  type = 'website',
  sessionId
}: GenerateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = sessionId ? `${baseUrl}/${type}/${sessionId}` : baseUrl

  return {
    title: `${title} - AreWeOkay`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'AreWeOkay',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'AreWeOkay - Find Your Truth',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
  }
}

export const defaultMetadata: Metadata = {
  title: 'AreWeOkay - Not every love is forever. Find your truth.',
  description: 'Anonymous relationship reality platform. Discover the truth about your connection through honest questions and genuine responses.',
  keywords: ['relationship', 'love', 'questions', 'anonymous', 'truth', 'nigeria', 'dating'],
  authors: [{ name: 'AreWeOkay' }],
  openGraph: {
    title: 'AreWeOkay - Find Your Truth',
    description: 'Not every love is forever. Find your truth through honest, anonymous questions.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'AreWeOkay',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AreWeOkay - Find Your Truth',
    description: 'Not every love is forever. Find your truth.',
  },
  robots: {
    index: true,
    follow: true,
  },
}