// ─── expression/page.tsx ─────────────────────────────────────────────
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Copy, Check, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function ExpressionPage() {
  const [expression, setExpression] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCreate = async () => {
    if (!expression.trim()) { alert('Please provide your expression'); return }
    setIsProcessing(true)
    try {
      const sessionRes = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'expression', expression }),
      })
      const sessionData = await sessionRes.json()
      if (!sessionData.success) throw new Error('Failed to create session')
      setSessionId(sessionData.sessionId)
      setShareLink(`${window.location.origin}/expression/${sessionData.sessionId}`)
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
              <CardTitle className="text-3xl">What Does It Take to Love You?</CardTitle>
              <CardDescription className="text-base">Express your true feelings. Share what's in your heart with someone special.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Expression</label>
                <textarea
                  className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Write what's in your heart..."
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{expression.length}/1000 characters</p>
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
                    <Button variant="outline" className="w-full h-11"><BarChart3 className="mr-2 h-4 w-4" />See Who Viewed It</Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="pt-4 border-t">
                  <Button onClick={handleCreate} disabled={isProcessing || !expression.trim()} className="w-full h-12 text-lg">{isProcessing ? 'Creating...' : 'Get Shareable Link'}<Share2 className="ml-2 h-5 w-5" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


