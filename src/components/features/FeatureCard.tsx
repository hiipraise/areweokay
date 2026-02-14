'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  delay?: number
}

export default function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  href,
  delay = 0 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={href}>
        <Card className="p-6 h-full cursor-pointer hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm grain-texture">
          <div className="flex flex-col items-start gap-4 relative z-10">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}