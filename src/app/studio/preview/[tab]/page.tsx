import type { Metadata } from 'next'
import WelcomeHero from '@/components/public/WelcomeHero'
import RecentMedia from '@/components/public/RecentMedia'
import BrowseByCategory from '@/components/public/BrowseByCategory'
import MediaLibrary from '@/components/media/MediaLibrary'
import AboutPreview from '@/components/public/AboutPreview'
import { sanityFetch } from '@/lib/sanity/client'
import { MEDIA_LIST } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Site Preview | Admin',
  description: 'Preview public pages inside the admin without shell components.',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MediaAsset { _id: string; url: string; mimeType: string; originalFilename?: string }
interface Category { _id: string; title: string; slug?: { current: string }; description?: string }
interface MediaItem {
  _id: string
  title: string
  description?: string
  file: { asset: MediaAsset }
  categories?: Category[]
}

async function getAllMedia() {
  return sanityFetch<MediaItem[]>({ query: MEDIA_LIST })
}

async function getCategories() {
  return sanityFetch<Category[]>({
    query: `*[_type == "category" && !(_id in path("drafts.**"))] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`,
  })
}

export default async function PreviewPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params
  const key = (tab || '').toLowerCase()
  
  const allMedia = await getAllMedia()
  const categories = await getCategories()
  const safeAllMedia = (allMedia ?? []).filter((m): m is MediaItem => !!m && typeof m._id === 'string')

  switch (key) {
    case 'home':
      return (
        <div>
          <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4 mb-6">
            <WelcomeHero />
          </div>
          <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4 mb-6">
            <RecentMedia />
          </div>
          <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4">
            <BrowseByCategory categories={categories} allMedia={safeAllMedia} />
          </div>
        </div>
      )
    case 'media':
      return (
        <div>
          <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4">
            <MediaLibrary />
          </div>
        </div>
      )
    case 'media_player':
      return (
        <div>
          <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Media Player Preview</h2>
            <p className="text-gray-600 mb-4">This shows an empty player with categories and media grid.</p>
            <BrowseByCategory categories={categories} allMedia={safeAllMedia} />
          </div>
        </div>
      )
    case 'about':
      return <AboutPreview />
    default:
      return (
        <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-6 text-gray-700">
          Unknown preview &quot;{tab}&quot;. Try one of: home, media, media_player, about.
        </div>
      )
  }
}
