// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Analytics from '@/models/Analytics'

export async function GET() {
  try {
    await dbConnect()
    
    let analytics = await Analytics.findOne()
    
    if (!analytics) {
      analytics = await Analytics.create({
        totalVisits: 0,
        maleCount: 0,
        femaleCount: 0,
      })
    }

    return NextResponse.json({
      totalVisits: analytics.totalVisits,
      maleCount: analytics.maleCount,
      femaleCount: analytics.femaleCount,
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}