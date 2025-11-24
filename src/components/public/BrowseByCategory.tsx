'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Category { 
  _id: string
  title: string
  slug?: { current: string }
  description?: string
  count?: number
}

interface MediaAsset {
  _id: string
  url: string
  mimeType: string
  originalFilename?: string
}

interface MediaItem {
  _id: string
  title?: string
  description?: string
  file?: {
    asset: MediaAsset
  }
  categories?: Category[]
}

interface BrowseByCategoryProps {
  categories: Category[]
  allMedia: MediaItem[]
  showCounts?: boolean
}

export default function BrowseByCategory({ categories, allMedia, showCounts = false }: BrowseByCategoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  if (!categories || categories.length === 0) {
    return <div className="bg-white rounded-xl shadow p-6 text-gray-600">No categories yet.</div>
  }

  // Filter media by selected category
  const filteredMedia = selectedCategoryId
    ? allMedia.filter(media => 
        media.categories?.some(cat => cat._id === selectedCategoryId)
      )
    : []

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategoryId(
              selectedCategoryId === category._id ? null : category._id
            )}
            className={`group rounded-lg shadow-md hover:shadow-lg transition-all p-6 text-left ${
              selectedCategoryId === category._id
                ? 'bg-indigo-600 text-white'
                : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold transition-colors ${
                selectedCategoryId === category._id
                  ? 'text-white'
                  : 'text-gray-900 group-hover:text-indigo-600'
              }`}>
                {category.title}
              </h3>
              {showCounts && typeof category.count !== 'undefined' && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategoryId === category._id
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {category.count}
                </span>
              )}
            </div>
            {category.description && (
              <p className={`text-xs line-clamp-2 ${
                selectedCategoryId === category._id
                  ? 'text-indigo-100'
                  : 'text-gray-500'
              }`}>
                {category.description}
              </p>
            )}
          </button>
        ))}
      </div>

      {selectedCategoryId && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {categories.find(c => c._id === selectedCategoryId)?.title} Files
          </h3>
          {filteredMedia.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-gray-600">
              No files in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((media) => {
                if (!media.file?.asset) return null
                
                return (
                  <Link
                    key={media._id}
                    href={`/media_player?id=${media._id}`}
                    className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="aspect-video bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      {media.file.asset.mimeType.startsWith('video/') ? (
                      <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    ) : (
                      <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {media.title}
                    </h4>
                    {media.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{media.description}</p>
                    )}
                  </div>
                </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
