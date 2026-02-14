// ─── safe-love/page.tsx ───────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Shield, RefreshCw, Copy, Check, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getRandomQuestions } from '@/lib/questions'

export default function SafeLovePage() {
  const [questions, setQuestions] = useState<{ id: string; question: string }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)

  const generateQuestions = () => {
    const randomQuestions = getRandomQuestions(10)
    setQuestions(randomQuestions.map((q, i) => ({ id: `q${i}`, question: q })))
  }

  const handleCreate = async () => {
    if (questions.length === 0) {
      alert('Please generate questions first')
      return
    }
    setIsProcessing(true)
    try {
      const sessionRes = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'safe-love', questions }),
      })
      const sessionData = await sessionRes.json()
      if (!sessionData.success) throw new Error('Failed to create session')
      setSessionId(sessionData.sessionId)
      setShareLink(`${window.location.origin}/safe-love/${sessionData.sessionId}`)
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
          <Link href="/"><Button variant="ghost" className="mb-6"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Button></Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="grain-texture">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">Is My Love Really Safe With Them?<Shield className="h-8 w-8 text-primary" /></CardTitle>
              <CardDescription className="text-base">Assess the safety and security of your relationship with randomly selected questions from our extensive bank of 100+ relationship queries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Safety Assessment Questions {questions.length > 0 && `(${questions.length})`}</label>
                  <Button onClick={generateQuestions} variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />{questions.length === 0 ? 'Generate' : 'New Set'}</Button>
                </div>
                {questions.length === 0 ? (
                  <div className="p-8 bg-muted rounded-lg text-center">
                    <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Click "Generate" to get 10 random questions from our bank of 100+ relationship safety questions</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {questions.map((q, index) => (
                      <motion.div key={q.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm"><span className="font-semibold text-primary">{index + 1}.</span> {q.question}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              {shareLink ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t space-y-3">
                  <p className="text-sm font-medium text-center text-primary">Your shareable link is ready! 🎉</p>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm flex-1 truncate">{shareLink}</p>
                    <Button size="sm" variant="outline" onClick={handleCopy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
                  </div>
                  <Button onClick={handleCopy} className="w-full h-12 text-lg">{copied ? 'Copied!' : 'Copy Link'}<Share2 className="ml-2 h-5 w-5" /></Button>
                  <Link href={`/responses/${sessionId}`} className="block">
                    <Button variant="outline" className="w-full h-11"><BarChart3 className="mr-2 h-4 w-4" />View Responses</Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="pt-4 border-t">
                  <Button onClick={handleCreate} disabled={isProcessing || questions.length === 0} className="w-full h-12 text-lg">{isProcessing ? 'Creating...' : 'Get Shareable Link'}<Share2 className="ml-2 h-5 w-5" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}