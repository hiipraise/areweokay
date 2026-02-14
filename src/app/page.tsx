'use client'

import { motion } from 'framer-motion'
import { Heart, Users, MessageCircle, Gift, Split, Shield } from 'lucide-react'
import FeatureCard from '@/components/features/FeatureCard'

const features = [
  {
    title: 'Does My Babe Really Know Me?',
    description: 'Create personalized questions and discover how well your partner truly knows you.',
    icon: Heart,
    href: '/know-me',
    enabled: false,
  },
  {
    title: 'Does a Stranger Know Me More?',
    description: 'Compare how your partner\'s answers stack up against strangers. The truth might surprise you.',
    icon: Users,
    href: '/stranger-comparison',
    enabled: false,
  },
  {
    title: 'What Does It Take to Love You?',
    description: 'Express your deepest feelings and share your heart with someone special.',
    icon: MessageCircle,
    href: '/expression',
    enabled: false,
  },
  {
    title: 'Your Love Is Appreciated',
    description: 'Send heartfelt appreciation messages to show someone they matter.',
    icon: Gift,
    href: '/appreciation',
    enabled: false,
  },
  {
    title: 'Break Up, or Forever?',
    description: 'Reflect on your relationship with thought-provoking questions about your future together.',
    icon: Split,
    href: '/breakup',
    enabled: true,
  },
  {
    title: 'Is My Love Really Safe With Them?',
    description: 'Ask the hard questions to understand if your relationship is built on solid ground.',
    icon: Shield,
    href: '/safe-love',
    enabled: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 grain-texture">
      <div className="container mx-auto px-4 py-12 sm:py-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 space-y-4"
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            AreWeOkay
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-serif italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Not every love is forever. Find your truth.
          </motion.p>

          <motion.div
            className="pt-6 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-xs text-muted-foreground">
              anonymous
            </p>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={feature.title} className="relative">
              
              {/* Card */}
              <div className={!feature.enabled ? "pointer-events-none opacity-70" : ""}>
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  href={feature.enabled ? feature.href : undefined}
                  delay={0.8 + index * 0.1}
                />
              </div>

              {/* Coming Soon Label */}
              {!feature.enabled && (
                <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border">
                  Coming soon
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground italic">
            I rest, I’m working on it.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
