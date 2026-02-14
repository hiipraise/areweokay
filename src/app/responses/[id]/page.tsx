// src/app/responses/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import {
  Heart,
  Loader2,
  Users,
  User,
  ArrowLeft,
  MessageSquare,
  BarChart3,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Answer {
  id: string;
  question: string;
  answer: string;
  answeredBy?: "partner" | "stranger";
}

interface SessionData {
  sessionId: string;
  type: string;
  questions: { id: string; question: string }[];
  expression?: string;
  appreciationMessage?: string;
  isPublic: boolean;
  responses: {
    partnerAnswers?: Answer[];
    strangerAnswers?: Answer[][];
  };
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    "know-me": "Does My Babe Really Know Me?",
    "stranger-comparison": "Does a Stranger Know Me More?",
    expression: "What Does It Take to Love You?",
    appreciation: "Your Love Is Appreciated",
    breakup: "Break Up, or Forever?",
    "safe-love": "Is My Love Really Safe With Them?",
  };
  return labels[type] || "Session Responses";
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "know-me": "#e879a0",
    "stranger-comparison": "#7c3aed",
    expression: "#db2777",
    appreciation: "#dc2626",
    breakup: "#ea580c",
    "safe-love": "#059669",
  };
  return colors[type] || "#6366f1";
}

function AnswerBlock({
  question,
  answer,
  index,
  accentColor,
}: {
  question: string;
  answer: string;
  index: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="group relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: accentColor }} />
      <div className="pl-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: accentColor }}>
          Q{index + 1}
        </p>
        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{question}</p>
        <p className="text-base font-medium leading-relaxed">
          {answer || <span className="text-muted-foreground/50 italic">No answer provided</span>}
        </p>
      </div>
    </motion.div>
  );
}

function StrangerResponseAccordion({
  answers,
  index,
  accentColor,
}: {
  answers: Answer[];
  index: number;
  accentColor: string;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-border/50 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: accentColor }}>
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-semibold">Stranger #{index + 1}</p>
            <p className="text-xs text-muted-foreground">
              {answers.filter((a) => a.answer).length} of {answers.length} answered
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
              {answers.map((answer, i) => (
                <AnswerBlock
                  key={answer.id}
                  question={answer.question}
                  answer={answer.answer}
                  index={i}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ResponsesPage() {
  const params = useParams();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"partner" | "strangers">("partner");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) fetchSession();
  }, [params.id]);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/session/${params.id}`);
      const data = await res.json();
      if (data.success) setSession(data.session);
    } catch (error) {
      console.error("Failed to fetch session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/${session?.type}/${session?.sessionId}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const accentColor = session ? getTypeColor(session.type) : "#6366f1";

  const partnerAnswers = session?.responses?.partnerAnswers ?? [];
  const strangerAnswers = session?.responses?.strangerAnswers ?? [];
  const hasPartner = partnerAnswers.length > 0;
  const hasStrangers = strangerAnswers.length > 0;
  const isComparison = session?.type === "stranger-comparison";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-3">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-lg font-medium">Session not found</p>
            <p className="text-sm text-muted-foreground">
              This session may have expired or the link is invalid.
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-2">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalResponses =
    (hasPartner ? 1 : 0) + strangerAnswers.length;
  const isExpression =
    session.type === "expression" || session.type === "appreciation";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
            style={{ backgroundColor: accentColor }}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Responses
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {getTypeLabel(session.type)}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              {totalResponses} {totalResponses === 1 ? "response" : "responses"}
            </span>
            {session.questions.length > 0 && (
              <span>{session.questions.length} questions</span>
            )}
          </div>
        </motion.div>

        {/* Stats strip */}
        {!isExpression && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[
              {
                label: "Total Responses",
                value: totalResponses,
                icon: MessageSquare,
              },
              {
                label: "Partner",
                value: hasPartner ? "✓" : "–",
                icon: User,
              },
              {
                label: "Strangers",
                value: strangerAnswers.length,
                icon: Users,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/50 bg-card/50 p-4 text-center"
              >
                <stat.icon className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                <p
                  className="text-2xl font-bold"
                  style={{ color: accentColor }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Expression / Appreciation display */}
        {(session.expression || session.appreciationMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-base italic leading-relaxed text-muted-foreground">
                  {session.expression || session.appreciationMessage}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No responses yet */}
        {totalResponses === 0 && !isExpression && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center">
              <CardContent className="py-16 space-y-4">
                <div
                  className="h-16 w-16 rounded-full mx-auto flex items-center justify-center opacity-20"
                  style={{ backgroundColor: accentColor }}
                >
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">Waiting for answers...</p>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    No one has responded yet. Share your link to start collecting
                    answers.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleCopyLink} variant="outline" size="sm">
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy Share Link"}
                  </Button>
                  <Button onClick={fetchSession} variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs — only shown for stranger-comparison or when both types exist */}
        {(hasPartner || hasStrangers) && !isExpression && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-6"
          >
            {isComparison && hasStrangers && hasPartner && (
              <div className="flex rounded-xl border border-border/50 overflow-hidden bg-card/30 p-1 gap-1">
                {(
                  [
                    { key: "partner", label: "Partner", icon: User },
                    {
                      key: "strangers",
                      label: `Strangers (${strangerAnswers.length})`,
                      icon: Users,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? "text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={
                      activeTab === tab.key
                        ? { backgroundColor: accentColor }
                        : {}
                    }
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Partner answers */}
            {hasPartner &&
              (!isComparison || activeTab === "partner") && (
                <motion.div
                  key="partner"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div
                          className="h-7 w-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: accentColor + "22" }}
                        >
                          <User
                            className="h-4 w-4"
                            style={{ color: accentColor }}
                          />
                        </div>
                        Partner's Answers
                      </CardTitle>
                      <CardDescription>
                        {partnerAnswers.filter((a) => a.answer).length} of{" "}
                        {partnerAnswers.length} questions answered
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {partnerAnswers.map((answer, i) => (
                        <AnswerBlock
                          key={answer.id}
                          question={answer.question}
                          answer={answer.answer}
                          index={i}
                          accentColor={accentColor}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

            {/* Stranger answers */}
            {hasStrangers &&
              (!isComparison || activeTab === "strangers") && (
                <motion.div
                  key="strangers"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {!hasPartner || !isComparison ? (
                    // Non-comparison: show partner-style heading for strangers
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div
                            className="h-7 w-7 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: accentColor + "22" }}
                          >
                            <Users
                              className="h-4 w-4"
                              style={{ color: accentColor }}
                            />
                          </div>
                          Responses ({strangerAnswers.length})
                        </CardTitle>
                        <CardDescription>
                          Anonymous answers from people who received your link
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {strangerAnswers.map((batch, i) => (
                          <div key={i}>
                            {strangerAnswers.length > 1 && (
                              <p
                                className="text-xs font-bold uppercase tracking-widest mb-3"
                                style={{ color: accentColor }}
                              >
                                Response #{i + 1}
                              </p>
                            )}
                            <div className="space-y-4">
                              {batch.map((answer, j) => (
                                <AnswerBlock
                                  key={answer.id}
                                  question={answer.question}
                                  answer={answer.answer}
                                  index={j}
                                  accentColor={accentColor}
                                />
                              ))}
                            </div>
                            {i < strangerAnswers.length - 1 && (
                              <div className="border-t border-border/30 mt-6" />
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    // Comparison mode: accordion
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {strangerAnswers.length} stranger{" "}
                          {strangerAnswers.length === 1
                            ? "response"
                            : "responses"}
                        </p>
                      </div>
                      {strangerAnswers.map((batch, i) => (
                        <StrangerResponseAccordion
                          key={i}
                          answers={batch}
                          index={i}
                          accentColor={accentColor}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
          </motion.div>
        )}

        {/* Footer actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between"
        >
          <Button onClick={fetchSession} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Responses
          </Button>

          <Button onClick={handleCopyLink} size="sm">
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied!" : "Share Link Again"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}