'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart } from 'lucide-react'

interface AnalyticsData {
  totalVisits: number
  maleCount: number
  femaleCount: number
}

export default function AnalyticsDisplay() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    maleCount: 0,
    femaleCount: 0,
  })

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary animate-pulse-soft" />
          <div className="text-sm">
            <p className="text-muted-foreground text-xs">Total Visits</p>
            <p className="font-semibold text-lg">{analytics.totalVisits.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Male</p>
            <p className="font-semibold text-blue-500">{analytics.maleCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Female</p>
            <p className="font-semibold text-pink-500">{analytics.femaleCount}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}