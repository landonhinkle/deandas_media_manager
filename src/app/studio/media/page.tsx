import type { Metadata } from 'next'
import MediaLibrary from '@/components/media/MediaLibrary'
import WelcomeHero from '@/components/public/WelcomeHero'
import BrowseByCategory from '@/components/public/BrowseByCategory'
import { sanityFetch } from '@/lib/sanity/client'
import { MEDIA_LIST } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Media Preview | Admin',
  description: 'Preview the public Media page content inside the admin.',
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

export default async function StudioMediaPreviewPage() {
  const allMedia = await getAllMedia()
  const categories = await getCategories()
  const safeAllMedia = (allMedia ?? []).filter((m): m is MediaItem => !!m && typeof m._id === 'string')

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Public Media Preview</h1>
      <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4 mb-6">
        {/* Include the public welcome hero component */}
        <WelcomeHero />
      </div>
      <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4 mb-6">
        {/* Include the Browse by Category component */}
        <BrowseByCategory categories={categories} allMedia={safeAllMedia} />
      </div>
      <div className="bg-white/70 backdrop-blur-sm shadow rounded-lg p-4">
        {/* Shared public content without public layout shell */}
        <MediaLibrary showCategories={false} />
      </div>
    </div>
  )
}
