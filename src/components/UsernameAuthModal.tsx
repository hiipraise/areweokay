'use client'

import { FormEvent, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  clearStoredUsername,
  getStoredUsername,
  setStoredUsername,
} from '@/lib/client-username'

type ResolveFn = (username: string | null) => void

export default function UsernameAuthModal() {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionUsername, setSessionUsername] = useState<string | null>(null)
  const [resolver, setResolver] = useState<ResolveFn | null>(null)

  useEffect(() => {
    setSessionUsername(getStoredUsername())

    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ resolve: ResolveFn }>
      setResolver(() => customEvent.detail.resolve)
      setOpen(true)
      setError('')
      setUsername('')
    }

    window.addEventListener('awo:open-auth-modal', handleOpen)
    return () => window.removeEventListener('awo:open-auth-modal', handleOpen)
  }, [])

  const onClose = () => {
    setOpen(false)
    if (resolver) {
      resolver(null)
      setResolver(null)
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const normalized = username.trim().toLowerCase()

    if (!normalized) {
      setError('Username is required.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/users/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalized }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Could not use this username.')
        return
      }

      setStoredUsername(data.username)
      setSessionUsername(data.username)
      setOpen(false)
      if (resolver) {
        resolver(data.username)
        setResolver(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearStoredUsername()
    setSessionUsername(null)
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2 rounded-full border bg-background/90 px-3 py-2 shadow-sm backdrop-blur">
        <span className="text-xs text-muted-foreground">
          {sessionUsername ? `@${sessionUsername}` : 'Signed out'}
        </span>
        {sessionUsername ? (
          <Button size="sm" variant="outline" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button size="sm" onClick={() => setOpen(true)}>
            Login
          </Button>
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) onClose()
          else setOpen(value)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login with your username</DialogTitle>
            <DialogDescription>
              Username is your auth. Sessions expire, so you may need to re-enter it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Continue'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
