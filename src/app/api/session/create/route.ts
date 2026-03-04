import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Session from '@/models/Session'
import User from '@/models/User'
import { generateUniqueId } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const {
      type,
      questions,
      expression,
      appreciationMessage,
      username,
      isPublic = false,
    } = body

    const normalizedUsername = String(username || '').trim().toLowerCase()
    if (!normalizedUsername) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const user = await User.findOne({ username: normalizedUsername })
    if (!user) {
      return NextResponse.json({ error: 'Username not found. Claim a username first.' }, { status: 404 })
    }

    const sessionId = generateUniqueId()

    const session = await Session.create({
      sessionId,
      type,
      creatorUsername: normalizedUsername,
      questions: questions || [],
      expression,
      appreciationMessage,
      isPublic,
      responses: {},
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, sessionId: session.sessionId })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
