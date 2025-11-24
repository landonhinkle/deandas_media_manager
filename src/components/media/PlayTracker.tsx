'use client'

import { useEffect } from 'react'

interface PlayTrackerProps {
  mediaId: string
}

const STORAGE_KEY = 'recently-played-media'
const MAX_RECENT = 10

export default function PlayTracker({ mediaId }: PlayTrackerProps) {
  useEffect(() => {
    if (!mediaId) return

    // Track this media play in localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    let recentIds: string[] = []
    
    if (stored) {
      try {
        recentIds = JSON.parse(stored)
        if (!Array.isArray(recentIds)) recentIds = []
      } catch {
        recentIds = []
      }
    }

    // Remove if already exists (to move to front)
    recentIds = recentIds.filter(id => id !== mediaId)
    
    // Add to front
    recentIds.unshift(mediaId)
    
    // Keep only last 10
    recentIds = recentIds.slice(0, MAX_RECENT)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds))
  }, [mediaId])

  return null
}