'use client'

import { useEffect, useState, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(true) // start as playing
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5 // optional: set initial volume
      audioRef.current.play().catch((err) => {
        console.warn('Autoplay failed:', err)
        setIsPlaying(false) // if autoplay blocked, set paused
      })
    }
  }, [])

  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/sounds/ambient.mp3" type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          className="bg-card/80 backdrop-blur-md border border-border rounded-full h-12 w-12"
        >
          {isPlaying ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </motion.div>
    </>
  )
}
