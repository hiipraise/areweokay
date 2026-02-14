// src/app/api/session/[id]/answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Session from "@/models/Session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const { answers, answererType } = await request.json();

    const session = await Session.findOne({ sessionId: id });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (answererType === "partner") {
      session.responses.partnerAnswers = answers;
    } else if (answererType === "stranger") {
      if (!session.responses.strangerAnswers) {
        session.responses.strangerAnswers = [];
      }
      session.responses.strangerAnswers.push(answers);
    }

    await session.save();

    return NextResponse.json({
      success: true,
      message: "Answers submitted successfully",
    });
  } catch (error) {
    console.error("Answer submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit answers" },
      { status: 500 }
    );
  }
}