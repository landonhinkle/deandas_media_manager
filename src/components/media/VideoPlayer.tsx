'use client'

import { useEffect, useRef } from 'react'

interface VideoPlayerProps {
  src: string
  mimeType: string
  filename?: string
}

export default function VideoPlayer({ src, mimeType, filename }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => {
      console.log('Video load started:', { src, mimeType, filename })
    }

    const handleCanPlay = () => {
      console.log('Video can play - success!')
    }

    const handleError = (e: Event) => {
      const video = e.target as HTMLVideoElement
      console.error('Video error details:', {
        src,
        mimeType,
        filename,
        networkState: video.networkState,
        readyState: video.readyState,
        error: video.error?.code,
        errorMessage: video.error?.message
      })
    }

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      })
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [src, mimeType, filename])

  const isAVI = mimeType.includes('avi') || filename?.toLowerCase().includes('.avi')

  return (
    <div className="aspect-video bg-black relative">
      <video 
        ref={videoRef}
        controls 
        className="w-full h-full" 
        preload="metadata"
      >
        {/* Primary source with detected MIME type */}
        <source src={src} type={mimeType} />
        
        {/* AVI-specific fallback sources */}
        {isAVI && (
          <>
            <source src={src} type="video/x-msvideo" />
            <source src={src} type="video/avi" />
            <source src={src} type="video/msvideo" />
            <source src={src} />
          </>
        )}
        
        {/* Other format fallbacks */}
        {mimeType.includes('mp4') && <source src={src} type="video/mp4" />}
        {mimeType.includes('mov') && <source src={src} type="video/quicktime" />}
        {mimeType.includes('mkv') && <source src={src} type="video/x-matroska" />}
        {mimeType.includes('webm') && <source src={src} type="video/webm" />}
        {mimeType.includes('ogg') && <source src={src} type="video/ogg" />}
        
        Your browser does not support this video format. Format detected: {mimeType}
      </video>
      
      {/* AVI compatibility warning */}
      {isAVI && (
        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
          AVI format - codec dependent
        </div>
      )}
    </div>
  )
}