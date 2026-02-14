// src/app/api/session/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Session from '@/models/Session'
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
      isPublic = false 
    } = body

    const sessionId = generateUniqueId()

    const session = await Session.create({
      sessionId,
      type,
      questions: questions || [],
      expression,
      appreciationMessage,
      isPublic,
      responses: {},
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}