// src/app/know-me/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, X, Share2, Copy, Check, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface Question {
  id: string
  text: string
}

export default function KnowMePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)

  const addQuestion = () => {
    if (currentQuestion.trim() && questions.length < 10) {
      setQuestions([...questions, { id: Date.now().toString(), text: currentQuestion }])
      setCurrentQuestion('')
    }
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleCreate = async () => {
    if (questions.length === 0) {
      alert('Please add at least one question')
      return
    }

    setIsProcessing(true)

    try {
      const sessionRes = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'know-me',
          questions: questions.map(q => ({ id: q.id, question: q.text })),
        }),
      })

      const sessionData = await sessionRes.json()

      if (!sessionData.success) {
        throw new Error('Failed to create session')
      }

      setSessionId(sessionData.sessionId)
      const link = `${window.location.origin}/know-me/${sessionData.sessionId}`
      setShareLink(link)
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 grain-texture">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="grain-texture">
            <CardHeader>
              <CardTitle className="text-3xl">Does My Babe Really Know Me?</CardTitle>
              <CardDescription className="text-base">
                Create up to 10 questions to test how well your partner knows you.
                Share the link and discover the truth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Questions ({questions.length}/10)
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="What's my favorite...?"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                    disabled={questions.length >= 10}
                  />
                  <Button
                    onClick={addQuestion}
                    disabled={questions.length >= 10 || !currentQuestion.trim()}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {questions.map((q, index) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                    >
                      <span className="text-sm flex-1">{q.text}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {shareLink ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 border-t space-y-3"
                >
                  <p className="text-sm font-medium text-center text-primary">
                    Your shareable link is ready! 🎉
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm flex-1 truncate">{shareLink}</p>
                    <Button size="sm" variant="outline" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={handleCopy} className="w-full h-12 text-lg">
                    {copied ? 'Copied!' : 'Copy Link'}
                    <Share2 className="ml-2 h-5 w-5" />
                  </Button>
                  <Link href={`/responses/${sessionId}`} className="block">
                    <Button variant="outline" className="w-full h-11">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Responses
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Your partner answers for free</p>
                    <p className="text-sm text-muted-foreground">100% anonymous</p>
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={isProcessing || questions.length === 0}
                    className="w-full h-12 text-lg"
                  >
                    {isProcessing ? 'Creating...' : 'Get Shareable Link'}
                    <Share2 className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}