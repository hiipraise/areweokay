'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getStoredUsername } from '@/lib/client-username'

type SessionSummary = {
  sessionId: string
  type: string
  creatorUsername: string
  isPublic: boolean
  createdAt: string
  responseCount: number
}

const typeLabel: Record<string, string> = {
  'know-me': 'Know Me',
  'stranger-comparison': 'Stranger Comparison',
  expression: 'Expression',
  appreciation: 'Appreciation',
  breakup: 'Breakup',
  'safe-love': 'Safe Love',
}

export default function ResponsesPage() {
  const [own, setOwn] = useState<SessionSummary[]>([])
  const [pub, setPub] = useState<SessionSummary[]>([])

  useEffect(() => {
    const username = getStoredUsername()
    const url = username ? `/api/session/history?username=${username}` : '/api/session/history'

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setOwn(data.ownSessions || [])
        setPub(data.publicSessions || [])
      })
  }, [])

  const marqueeItems = useMemo(() => (pub.length ? [...pub, ...pub] : []), [pub])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Responses History</h1>
          <p className="text-sm text-muted-foreground">View your sessions and explore public responses.</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your sessions</h2>
          {own.length === 0 ? (
            <p className="text-sm text-muted-foreground">No username session found (or no created sessions yet).</p>
          ) : (
            <div className="grid gap-3">
              {own.map((item) => (
                <Link key={item.sessionId} href={`/responses/${item.sessionId}`} className="rounded-lg border p-4 hover:border-primary/50">
                  <p className="font-medium">{typeLabel[item.type] || item.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()} • {item.responseCount} responses</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3 overflow-hidden">
          <h2 className="text-xl font-semibold">Public responses</h2>
          {marqueeItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No public responses yet.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border py-3">
              <motion.div
                className="flex gap-3 px-3"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              >
                {marqueeItems.map((item, idx) => (
                  <Link
                    key={`${item.sessionId}-${idx}`}
                    href={`/responses/${item.sessionId}`}
                    className="min-w-72 rounded-lg bg-card px-4 py-3"
                  >
                    <p className="font-medium">{typeLabel[item.type] || item.type}</p>
                    <p className="text-xs text-muted-foreground">by @{item.creatorUsername} • {item.responseCount} responses</p>
                  </Link>
                ))}
              </motion.div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
