import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/lib/sanity/client'
import { MEDIA_BY_ID, MEDIA_LIST } from '@/lib/sanity/queries'
import VideoPlayer from '@/components/media/VideoPlayer'
import TextFileViewer from '@/components/media/TextFileViewer'
import BrowseByCategory from '@/components/public/BrowseByCategory'
import RecentlyPlayed from '@/components/media/RecentlyPlayed'
import PlayTracker from '@/components/media/PlayTracker'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MediaAsset { _id: string; url: string; mimeType: string; originalFilename?: string }
interface Category { _id: string; title: string; slug?: { current: string }; description?: string }
interface MediaItem {
  _id: string
  title?: string
  description?: string
  file?: { asset: MediaAsset }
  categories?: Category[]
}

async function getMedia(id: string) {
  return sanityFetch<MediaItem | null>({ query: MEDIA_BY_ID, params: { id } })
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

export default async function MediaPlayerPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams
  const id = params?.id

  // Get all media and categories for the page
  const allMedia = await getAllMedia()
  const categories = await getCategories()
  const safeAllMedia = (allMedia ?? []).filter((m): m is MediaItem => !!m && typeof m._id === 'string')

  // If no ID, show empty player with media library
  if (!id) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty Player */}
        <div className="bg-white rounded-xl shadow p-4 mb-8">
          <div className="aspect-video bg-black flex items-center justify-center rounded-md">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">Select media to play</p>
              <p className="text-sm mt-2">Choose from recently played or browse by category below</p>
            </div>
          </div>
        </div>

        {/* Recently Played */}
        <RecentlyPlayed allMedia={safeAllMedia} />

        {/* Browse by Category */}
        <section className="mb-12">
          <BrowseByCategory categories={categories} allMedia={safeAllMedia} />
        </section>

        {/* All Media Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Media</h2>
          {safeAllMedia.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {safeAllMedia.map((m) => {
                const mime = m.file?.asset?.mimeType || ''
                const isAudio = mime.startsWith('audio/')
                const isVideo = mime.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(m.file?.asset?.originalFilename || '')
                const isImage = mime.startsWith('image/')

                return (
                  <Link
                    key={m._id}
                    href={`/media_player?id=${m._id}`}
                    className="group block bg-white rounded-lg shadow hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {isImage && m.file?.asset?.url && (
                        <Image src={m.file.asset.url} alt={m.title || 'Media'} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                      )}
                      {!isImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600">
                          <svg className="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isAudio && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />}
                            {isVideo && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />}
                            {!isAudio && !isVideo && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{m.title || 'Untitled'}</h3>
                      {m.description && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{m.description}</p>}
                      {m.categories && m.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {m.categories.slice(0, 2).map((cat) => (
                            <span key={cat._id} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                              {cat.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">No media available</p>
          )}
        </section>
      </div>
    )
  }

  const media = await getMedia(id)

  if (!media || !media.file?.asset?.url) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-700">We couldnt find that media item.</p>
          <div className="mt-4">
            <Link href="/media" className="text-indigo-600 hover:underline">Back to Media →</Link>
          </div>
        </div>
      </div>
    )
  }

  const { title, description, file: { asset } } = media
  const mime = asset.mimeType || ''

  const isAudio = mime.startsWith('audio/')
  const isVideo = mime.startsWith('video/') || 
    /\.(mp4|mov|avi|mkv|webm|ogg|m4v|3gp|flv|wmv)$/i.test(asset.originalFilename || '') ||
    ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm', 'video/ogg'].includes(mime)
  const isImage = mime.startsWith('image/')
  const isTextLike =
    mime.startsWith('text/') ||
    mime === 'application/json' ||
    (!!asset.originalFilename && /\.(md|markdown|txt|json)$/i.test(asset.originalFilename))

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Track this media play */}
      <PlayTracker mediaId={media._id} />
      
      <div className="mb-6">
        <Link href="/media" className="text-sm text-indigo-600 hover:underline">← Back to Media</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          {/* Text File Viewer */}
          {isTextLike && (
            <TextFileViewer 
              url={asset.url}
              mimeType={mime}
              filename={asset.originalFilename}
              title={title}
            />
          )}
          
          {/* Media Player (for audio, video, images) */}
          {!isTextLike && (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="relative w-full overflow-hidden rounded-md">
                {isAudio && (
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <audio controls className="w-full">
                      <source src={asset.url} type={mime} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {isVideo && (
                  <VideoPlayer 
                    src={asset.url} 
                    mimeType={mime} 
                    filename={asset.originalFilename} 
                  />
                )}
                {isImage && (
                  <div className="aspect-video bg-black">
                    <Image src={asset.url} alt={title || 'Media image'} fill className="object-contain" />
                  </div>
                )}
                {/* Fallback when no preview available */}
                {!isAudio && !isVideo && !isImage && (
                  <div className="aspect-video bg-black text-gray-300 text-center p-8 flex items-center justify-center">
                    <p>Preview not available for this file type.</p>
                  </div>
                )}
              </div>

              {/* Download fallback */}
              <div className="mt-4 flex items-center gap-4">
                <a
                  href={asset.url}
                  download
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Download{asset.originalFilename ? ` (${asset.originalFilename})` : ''}
                </a>
                <span className="text-xs text-gray-500">{mime}</span>
              </div>
              
              {/* AVI-specific help */}
              {(mime.includes('avi') || asset.originalFilename?.toLowerCase().includes('.avi')) && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">AVI Format Notice</h3>
                  <p className="text-sm text-yellow-700 mb-2">
                    AVI files use different codecs that may not be supported by web browsers. Common issues:
                  </p>
                  <ul className="text-xs text-yellow-600 list-disc list-inside space-y-1">
                    <li><strong>DivX/XviD:</strong> Not supported in browsers</li>
                    <li><strong>H.264:</strong> Should work in most browsers</li>
                    <li><strong>MJPEG:</strong> Limited browser support</li>
                  </ul>
                  <p className="text-xs text-yellow-600 mt-2">
                    If the video doesn&apos;t play, try downloading and playing in VLC or converting to MP4.
                  </p>
                </div>
              )}

              {/* Debug info for troubleshooting */}
              <div className="mt-2 text-xs text-gray-400 border-t pt-2">
                <p>File type detected: {isVideo ? 'Video' : isAudio ? 'Audio' : isImage ? 'Image' : 'Other'}</p>
                <p>MIME type: {mime}</p>
                <p>Filename: {asset.originalFilename || 'Unknown'}</p>
                <p>Asset URL: {asset.url}</p>
                {isVideo && (
                  <p className="mt-1 text-yellow-600">
                    ⚠️ Check browser console for video loading details
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Download button for text files */}
          {isTextLike && (
            <div className="mt-4">
              <a
                href={asset.url}
                download
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Download{asset.originalFilename ? ` (${asset.originalFilename})` : ''}
              </a>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title || 'Untitled'}</h1>
          {description && <p className="text-gray-700 mb-4">{description}</p>}
          {media.categories && media.categories.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {media.categories.map((c) => (
                  <Link key={c._id} href={`/categories/${c.slug?.current || c._id}`} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recently Played */}
      <div className="mt-12">
        <RecentlyPlayed allMedia={safeAllMedia} />
      </div>

      {/* Browse by Category */}
      <section className="mt-12">
        <BrowseByCategory categories={categories} allMedia={safeAllMedia} />
      </section>

      {/* All Media Grid */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Media</h2>
        {safeAllMedia.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {safeAllMedia.map((m) => {
              const mime = m.file?.asset?.mimeType || ''
              const isAudio = mime.startsWith('audio/')
              const isVideo = mime.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(m.file?.asset?.originalFilename || '')
              const isImage = mime.startsWith('image/')

              return (
                <Link
                  key={m._id}
                  href={`/media_player?id=${m._id}`}
                  className="group block bg-white rounded-lg shadow hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {isImage && m.file?.asset?.url && (
                      <Image src={m.file.asset.url} alt={m.title || 'Media'} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                    {!isImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600">
                        <svg className="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {isAudio && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />}
                          {isVideo && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />}
                          {!isAudio && !isVideo && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{m.title || 'Untitled'}</h3>
                    {m.description && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{m.description}</p>}
                    {m.categories && m.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {m.categories.slice(0, 2).map((cat) => (
                          <span key={cat._id} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                            {cat.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500">No media available</p>
        )}
      </section>
    </div>
  )
}
