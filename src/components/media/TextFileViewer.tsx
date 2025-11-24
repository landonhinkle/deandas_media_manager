'use client'

import { useEffect, useState } from 'react'

interface TextFileViewerProps {
  url: string
  mimeType: string
  filename?: string
  title?: string
}

export default function TextFileViewer({ url, mimeType, filename, title }: TextFileViewerProps) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        setError(null)
        
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to fetch file content')
        }
        
        let text = await res.text()
        
        // Format JSON files
        if (mimeType === 'application/json' || /\.json$/i.test(filename || '')) {
          try {
            const parsed = JSON.parse(text)
            text = JSON.stringify(parsed, null, 2)
          } catch {
            // Keep raw text if JSON parsing fails
          }
        }
        
        // Limit very large files
        const MAX_CHARS = 200_000
        if (text.length > MAX_CHARS) {
          setTruncated(true)
          text = text.slice(0, MAX_CHARS)
        }
        
        setContent(text)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file')
      } finally {
        setLoading(false)
      }
    }
    
    fetchContent()
  }, [url, mimeType, filename])

  if (loading) {
    return (
      <div className="bg-gray-900 text-gray-100 rounded-md p-8 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p>Loading file content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-gray-100 rounded-md p-8 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-gray-400 mt-2">Unable to preview this file</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {title || filename || 'Text File'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded border border-gray-300">
            {mimeType.split('/')[1]?.toUpperCase() || 'TEXT'}
          </span>
          {content && (
            <span className="text-xs text-gray-500">
              {content.split('\n').length} lines
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-900 text-gray-100 p-6 min-h-[50vh] max-h-[70vh] overflow-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {content}
        </pre>
        {truncated && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded text-yellow-200 text-sm">
            <p className="font-semibold mb-1">⚠ File truncated</p>
            <p className="text-xs">Preview limited to 200,000 characters. Download the file to view the complete content.</p>
          </div>
        )}
      </div>
    </div>
  )
}
