import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity/client'
import { CATEGORIES_WITH_COUNTS, MEDIA_LIST } from '@/lib/sanity/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Category { _id: string; title: string; slug?: { current: string }; count?: number }
interface MediaAsset { _id: string; url: string; mimeType: string; originalFilename?: string }
interface MediaItem {
  _id: string
  title?: string
  description?: string
  file?: { asset: MediaAsset }
  categories?: Category[]
}

async function getData() {
  const [categories, media] = await Promise.all([
    sanityFetch<Category[]>({ query: CATEGORIES_WITH_COUNTS }),
    sanityFetch<MediaItem[]>({ query: MEDIA_LIST }),
  ])
  return { categories, media }
}

export default async function MediaPage() {
  const { categories, media } = await getData()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Media</h1>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">← Back to Home</Link>
        </div>
        {categories && categories.length > 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat.slug?.current || cat._id}`}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 group-hover:text-indigo-600">{cat.title}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{cat.count ?? 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 text-gray-600">No categories yet.</div>
        )}
      </section>

      {/* Media Grid */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Media</h2>
        {media && media.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <Link key={item._id} href={`/media_player?id=${item._id}`} className="group bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  {item.file?.asset?.mimeType?.startsWith('image/') ? (
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
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-1">{item.title || 'Untitled'}</h3>
                  {item.description && <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>}
                  {item.categories && item.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.categories.slice(0, 2).map((cat) => (
                        <span key={cat._id} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{cat.title}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 text-gray-600">No media items found.</div>
        )}
      </section>
    </div>
  )
}
