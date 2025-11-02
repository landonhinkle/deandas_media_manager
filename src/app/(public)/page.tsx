import { sanityFetch } from '@/lib/sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import { RECENT_MEDIA } from '@/lib/sanity/queries'

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
  const recentMedia = await sanityFetch<MediaItem[]>({
    query: RECENT_MEDIA,
  })

  const categories = await sanityFetch<Category[]>({
    query: `*[_type == "category" && !(_id in path("drafts.**"))] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`,
  })

  return { recentMedia, categories }
}

export default async function HomePage() {
  const { recentMedia, categories } = await getHomeData()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to Deandas Media
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of media, organized beautifully for your browsing pleasure.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/media"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Browse All Media
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Explore Categories
          </Link>
        </div>
      </section>

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

        {recentMedia && recentMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMedia.map((item) => (
              <Link
                key={item._id}
                href={`/media_player?id=${item._id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Media Preview */}
                {item.file?.asset && (
                  <div className="relative aspect-video bg-gray-100">
                    {item.file.asset.mimeType?.startsWith('image/') ? (
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
                      {item.categories.slice(0, 2).map((cat: Category) => (
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
      {categories && categories.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug?.current || category._id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 text-center"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                  {category.title}
                </h3>
                {category.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
