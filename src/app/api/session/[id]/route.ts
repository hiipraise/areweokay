// src/app/api/session/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Session from '@/models/Session'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    
    const { id } = await params

    const session = await Session.findOne({ sessionId: id })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        type: session.type,
        questions: session.questions,
        expression: session.expression,
        appreciationMessage: session.appreciationMessage,
        isPublic: session.isPublic,
        responses: session.responses,
      }
    })
  } catch (error) {
    console.error('Session retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}