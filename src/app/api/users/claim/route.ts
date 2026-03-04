import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, currentUsername } = await request.json();
    const normalized = String(username || '').trim().toLowerCase();

    if (!normalized || normalized.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters.' }, { status: 400 });
    }

    const exists = await User.findOne({ username: normalized });
    if (exists && exists.username !== currentUsername) {
      return NextResponse.json({ error: 'Username already in use.' }, { status: 409 });
    }

    if (currentUsername) {
      const current = await User.findOne({ username: currentUsername });
      if (current) {
        current.username = normalized;
        await current.save();
        return NextResponse.json({ success: true, username: normalized });
      }
    }

    await User.create({ username: normalized });
    return NextResponse.json({ success: true, username: normalized });
  } catch (error) {
    console.error('Username claim error:', error);
    return NextResponse.json({ error: 'Failed to claim username' }, { status: 500 });
  }
}
