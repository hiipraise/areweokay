import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ADMIN_COOKIE, buildAdminToken, getOrCreateAdminConfig } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    const config = await getOrCreateAdminConfig();
    if (username !== config.username || password !== config.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, buildAdminToken(config.username, config.password), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
