import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider, ThemeToggle } from '@/components/ThemeProvider'
import AnalyticsDisplay from '@/components/AnalyticsDisplay'
import GenderSelectionModal from '@/components/GenderSelectionModal'
import BackgroundAudio from '@/components/BackgroundAudio'

export const metadata: Metadata = {
  title: 'AreWeOkay - Not every love is forever. Find your truth.',
  description: 'Anonymous relationship reality platform. Discover the truth about your connection through honest questions and genuine responses.',
  openGraph: {
    title: 'AreWeOkay - Find Your Truth',
    description: 'Not every love is forever. Find your truth through honest, anonymous questions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ThemeToggle />
          <AnalyticsDisplay />
          <GenderSelectionModal />
          <BackgroundAudio />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}