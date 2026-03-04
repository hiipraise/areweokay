import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Session from '@/models/Session'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const username = String(request.nextUrl.searchParams.get('username') || '').trim().toLowerCase()

    const ownSessions = username
      ? await Session.find({ creatorUsername: username })
          .sort({ createdAt: -1 })
          .limit(100)
      : []

    const publicSessions = await Session.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(100)

    const serialize = (items: any[]) =>
      items.map((session) => ({
        sessionId: session.sessionId,
        type: session.type,
        creatorUsername: session.creatorUsername,
        isPublic: session.isPublic,
        createdAt: session.createdAt,
        responseCount:
          (session.responses?.partnerAnswers?.length ? 1 : 0) +
          (session.responses?.strangerAnswers?.length || 0),
      }))

    return NextResponse.json({
      success: true,
      ownSessions: serialize(ownSessions),
      publicSessions: serialize(publicSessions),
    })
  } catch (error) {
    console.error('Session history error:', error)
    return NextResponse.json({ error: 'Failed to load session history' }, { status: 500 })
  }
}
