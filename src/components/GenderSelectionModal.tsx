'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function GenderSelectionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)

  useEffect(() => {
    const selected = sessionStorage.getItem('gender-selected')
    if (!selected) {
      setTimeout(() => setIsOpen(true), 2000)
    } else {
      setHasSelected(true)
    }
  }, [])

  const handleSelection = async (gender: 'male' | 'female' | 'skip') => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gender }),
      })
    } catch (error) {
      console.error('Failed to track gender:', error)
    }
    
    sessionStorage.setItem('gender-selected', 'true')
    setHasSelected(true)
    setIsOpen(false)
  }

  if (hasSelected) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to AreWeOkay</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Help us understand our community better. This is completely anonymous.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleSelection('male')}
              variant="outline"
              className="w-full h-12 text-base"
            >
              Male
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleSelection('female')}
              variant="outline"
              className="w-full h-12 text-base"
            >
              Female
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleSelection('skip')}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              Skip
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}