import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';
import User from '@/models/User';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    await dbConnect();

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [userCount, sessionCount, sessions] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments(),
      Session.find().sort({ createdAt: -1 }).limit(50).lean(),
    ]);

    const featureBreakdown = sessions.reduce<Record<string, number>>((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {});

    const totalResponses = sessions.reduce((acc, s: any) => {
      const partner = s.responses?.partnerAnswers?.length ? 1 : 0;
      const strangers = s.responses?.strangerAnswers?.length || 0;
      return acc + partner + strangers;
    }, 0);

    return NextResponse.json({
      userCount,
      sessionCount,
      totalResponses,
      featureBreakdown,
      recentSessions: sessions,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
