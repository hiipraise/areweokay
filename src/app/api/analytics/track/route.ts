// src/app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Analytics from '@/models/Analytics'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { gender } = await request.json()
    
    let analytics = await Analytics.findOne()
    
    if (!analytics) {
      analytics = await Analytics.create({
        totalVisits: 1,
        maleCount: gender === 'male' ? 1 : 0,
        femaleCount: gender === 'female' ? 1 : 0,
      })
    } else {
      analytics.totalVisits += 1
      if (gender === 'male') analytics.maleCount += 1
      if (gender === 'female') analytics.femaleCount += 1
      analytics.lastUpdated = new Date()
      await analytics.save()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}