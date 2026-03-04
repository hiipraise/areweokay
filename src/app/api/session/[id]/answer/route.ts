import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const { answers, answererType, username } = await request.json();
    const normalizedUsername = String(username || '').trim().toLowerCase();

    if (!normalizedUsername) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return NextResponse.json({ error: 'Username not found. Claim a username first.' }, { status: 404 });
    }

    const session = await Session.findOne({ sessionId: id });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (answererType === "partner") {
      session.responses.partnerUsername = normalizedUsername;
      session.responses.partnerAnswers = answers;
    } else if (answererType === "stranger") {
      if (!session.responses.strangerAnswers) {
        session.responses.strangerAnswers = [];
      }
      if (!session.responses.strangerUsernames) {
        session.responses.strangerUsernames = [];
      }
      session.responses.strangerUsernames.push(normalizedUsername);
      session.responses.strangerAnswers.push(answers);
    }

    await session.save();

    return NextResponse.json({ success: true, message: "Answers submitted successfully" });
  } catch (error) {
    console.error("Answer submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit answers" },
      { status: 500 }
    );
  }
}
