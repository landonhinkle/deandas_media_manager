'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MediaAsset { _id: string; url: string; mimeType: string; originalFilename?: string }
interface Category { _id: string; title: string; slug?: { current: string } }
interface MediaItem {
  _id: string
  title?: string
  description?: string
  file?: { asset: MediaAsset }
  categories?: Category[]
}

interface RecentlyPlayedProps {
  allMedia: MediaItem[]
}

const STORAGE_KEY = 'recently-played-media'

function getRecentlyPlayed(): string[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    const ids = JSON.parse(stored)
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export default function RecentlyPlayed({ allMedia }: RecentlyPlayedProps) {
  const [recentIds] = useState<string[]>(getRecentlyPlayed)

  // Filter media to only include recently played items, in order
  const recentMedia = recentIds
    .map(id => allMedia.find(m => m._id === id))
    .filter((m): m is MediaItem => !!m)
    .slice(0, 6)

  const displayMedia = recentMedia.length > 0 ? recentMedia : allMedia.slice(0, 6)

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Recently Played
      </h2>
      {displayMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayMedia.map((m) => (
            <MediaCard key={m._id} media={m} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No media available</p>
      )}
    </section>
  )
}

function MediaCard({ media }: { media: MediaItem }) {
  const mime = media.file?.asset?.mimeType || ''
  const isAudio = mime.startsWith('audio/')
  const isVideo = mime.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(media.file?.asset?.originalFilename || '')
  const isImage = mime.startsWith('image/')

  return (
    <Link
      href={`/media_player?id=${media._id}`}
      className="group block bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden"
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {isImage && media.file?.asset?.url && (
          <Image 
            src={media.file.asset.url} 
            alt={media.title || 'Media'} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform" 
          />
        )}
        {!isImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600">
            <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isAudio && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              )}
              {isVideo && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
              {!isAudio && !isVideo && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              )}
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">{media.title || 'Untitled'}</h3>
        {media.description && <p className="text-xs text-gray-500 truncate mt-1">{media.description}</p>}
      </div>
    </Link>
  )
}