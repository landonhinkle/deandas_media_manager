import { sanityFetch } from '@/lib/sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import { RECENT_MEDIA, MEDIA_LIST } from '@/lib/sanity/queries'
import WelcomeHero from '@/components/public/WelcomeHero'
import BrowseByCategory from '@/components/public/BrowseByCategory'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MediaAsset {
  _id: string
  url: string
  mimeType: string
  metadata?: {
    dimensions?: {
      width: number
      height: number
    }
  }
}

interface Category {
  _id: string
  title: string
  slug?: { current: string }
  description?: string
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

// Fetch recent published media and categories for the home page
async function getHomeData() {
  const [recentMedia, allMedia, categories] = await Promise.all([
    sanityFetch<MediaItem[]>({
      query: RECENT_MEDIA,
    }),
    sanityFetch<MediaItem[]>({
      query: MEDIA_LIST,
    }),
    sanityFetch<Category[]>({
      query: `*[_type == "category" && !(_id in path("drafts.**"))] | order(title asc) {
        _id,
        title,
        slug,
        description
      }`,
    })
  ])

  return { recentMedia, allMedia, categories }
}

export default async function HomePage() {
  const { recentMedia, allMedia, categories } = await getHomeData()
  const safeRecent = (recentMedia ?? []).filter((m): m is MediaItem => !!m && typeof m._id === 'string')
  const safeAllMedia = (allMedia ?? []).filter((m): m is MediaItem => !!m && typeof m._id === 'string')
  const safeCategories = (categories ?? []).filter((c): c is Category => !!c && typeof c._id === 'string')

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <WelcomeHero />

      {/* Recent Media Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Media</h2>
          <Link
            href="/media"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            View all →
          </Link>
        </div>

        {safeRecent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeRecent.map((item) => (
              <Link
                key={item._id}
                href={`/media_player?id=${encodeURIComponent(item._id)}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Media Preview */}
                {item.file?.asset && (
                  <div className="relative aspect-video bg-gray-100">
                    {item.file.asset.mimeType?.startsWith('image/') && !!item.file.asset.url ? (
                      <Image
                        src={item.file.asset.url}
                        alt={item.title || 'Media item'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}

                {/* Media Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {item.title || 'Untitled'}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  {item.categories && item.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.categories.slice(0, 2).filter(Boolean).map((cat: Category) => (
                        <span
                          key={cat._id}
                          className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                        >
                          {cat.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No media items yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Categories Section */}
      {safeCategories.length > 0 && (
        <BrowseByCategory categories={safeCategories} allMedia={safeAllMedia} />
      )}
    </div>
  )
}
