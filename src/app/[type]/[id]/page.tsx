// src/app/[type]/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Question {
  id: string;
  question: string;
  answer?: string;
}

interface SessionData {
  sessionId: string;
  type: string;
  questions: Question[];
  expression?: string;
  appreciationMessage?: string;
  isPublic: boolean;
}

export default function ViewSessionPage() {
  const params = useParams();
  const [session, setSession] = useState<SessionData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSession();
    }
  }, [params.id]);

  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/session/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setSession(data.session);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!session) return;

    const answerArray = session.questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: answers[q.id] || "",
      answeredBy: session.isPublic ? "stranger" : "partner",
    }));

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/session/${params.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answerArray,
          answererType: session.isPublic ? "stranger" : "partner",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit answers:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg">Session not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 grain-texture">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <Card className="text-center grain-texture">
            <CardContent className="pt-6 pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground">
                Your answers have been submitted. The truth awaits.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const getTitle = () => {
    switch (session.type) {
      case "know-me":
        return "Do You Really Know Them?";
      case "stranger-comparison":
        return "Do You Know This Person?";
      case "expression":
        return "A Message For You";
      case "appreciation":
        return "You Are Appreciated";
      case "breakup":
        return "Relationship Reflection";
      case "safe-love":
        return "Is This Love Safe?";
      default:
        return "Answer These Questions";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 grain-texture">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="grain-texture">
            <CardHeader>
              <CardTitle className="text-3xl">{getTitle()}</CardTitle>
              <CardDescription className="text-base">
                {session.type === "expression" ||
                session.type === "appreciation"
                  ? "Someone has shared something special with you"
                  : "Answer honestly. Your responses are completely anonymous."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {session.expression && (
                <div className="p-6 bg-primary/10 rounded-lg">
                  <p className="text-lg italic leading-relaxed">
                    {session.expression}
                  </p>
                </div>
              )}

              {session.appreciationMessage && (
                <div className="p-6 bg-primary/10 rounded-lg">
                  <p className="text-lg italic leading-relaxed">
                    {session.appreciationMessage}
                  </p>
                </div>
              )}

              {session.questions.length > 0 && (
                <div className="space-y-4">
                  {session.questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-2">
                        {index + 1}. {question.question}
                      </label>
                      <Input
                        placeholder="Your answer..."
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {session.questions.length > 0 && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || Object.keys(answers).length === 0}
                    className="w-full h-12 text-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Your Answers"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Answers are 100% anonymous.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
