import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Public analytics disabled' }, { status: 403 })
}
