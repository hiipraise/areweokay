import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { isAdminAuthenticated, getOrCreateAdminConfig } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const config = await getOrCreateAdminConfig();
    config.username = String(username).trim().toLowerCase();
    config.password = String(password).trim();
    config.updatedAt = new Date();
    await config.save();

    const response = NextResponse.json({ success: true });
    response.cookies.set('awo_admin_auth', Buffer.from(`${config.username}:${config.password}`).toString('base64url'), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Admin credential update error:', error);
    return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}
