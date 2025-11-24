import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity/client'
import { SITE_SETTINGS } from '@/lib/sanity/queries'
import SelectButton from '../SelectButton'
import SaveAltForm from '../SaveAltForm'
import ClearSelectionButton from '../ClearSelectionButton'
import SaveAboutTextForm from '../components/SaveAboutTextForm'
import SaveAboutMissionForm from '../components/SaveAboutMissionForm'
import SaveContactEmailForm from '../components/SaveContactEmailForm'
import AddAboutSectionForm from '@/app/studio/layouts/components/AddAboutSectionForm'
import DeleteAboutSectionButton from '@/app/studio/layouts/components/DeleteAboutSectionButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MediaItem { _id: string; title?: string; file?: { asset?: { url?: string; mimeType?: string } } }
interface SiteSettings { title?: string; description?: string; aboutIntroText?: string; aboutImage?: MediaItem | null; aboutImageAlt?: string; aboutMissionHeading?: string; aboutMissionText?: string; aboutExtraSections?: Array<{ _key: string; heading?: string; text?: string }>; contactEmail?: string }

async function getData() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS })
  const images = await sanityFetch<MediaItem[]>({
    query: `*[_type == "media" && !(_id in path("drafts.**")) && defined(file.asset->_id) && (file.asset->mimeType match "image/*")] | order(_createdAt desc) {
      _id,
      title,
      file { asset-> { url, mimeType } }
    }`,
  })
  return { settings, images: images || [] }
}

export default async function LayoutsAboutPage() {
  const { settings, images } = await getData()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">About Page Content</h1>
          <Link href="/studio/dashboard" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Text</h2>
        <p className="text-sm text-gray-600 mb-4">Update the title and headline text shown on the public About page.</p>
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-700">
            <div>
              <span className="font-medium">Current title:</span>{' '}
              {settings?.title ? (
                <span>{settings.title}</span>
              ) : (
                <span className="italic text-gray-500">none</span>
              )}
            </div>
            <div className="mt-1">
              <span className="font-medium">Current headline text:</span>
              {settings?.description ? (
                <span className="block whitespace-pre-wrap mt-1">{settings.description}</span>
              ) : (
                <span className="ml-1 italic text-gray-500">none</span>
              )}
            </div>
            <div className="mt-1">
              <span className="font-medium">Current intro text:</span>
              {settings?.aboutIntroText ? (
                <span className="block whitespace-pre-wrap mt-1">{settings.aboutIntroText}</span>
              ) : (
                <span className="block whitespace-pre-wrap mt-1 italic text-gray-500">We built this site to organize and share our media in a simple, beautiful way. Check back as we continue to grow the collection.</span>
              )}
            </div>
          </div>
        </div>
        <SaveAboutTextForm currentTitle={settings?.title} currentDescription={settings?.description} currentIntro={settings?.aboutIntroText} />
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Image</h2>
        <p className="text-sm text-gray-600 mb-4">Select an image to display on the public About page.</p>
        
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-700">
            <div>
              <span className="font-medium">Current image:</span>{' '}
              {settings?.aboutImage?.file?.asset?.url ? (
                <span className="text-green-700">Selected</span>
              ) : (
                <span className="italic text-gray-500">none</span>
              )}
            </div>
            <div className="mt-1">
              <span className="font-medium">Current alt text:</span>{' '}
              {settings?.aboutImageAlt ? (
                <span>{settings.aboutImageAlt}</span>
              ) : (
                <span className="italic text-gray-500">none</span>
              )}
            </div>
          </div>
        </div>

        {settings?.aboutImage?.file?.asset?.url ? (
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.aboutImage.file.asset.url!} alt={settings.aboutImageAlt || ''} className="rounded-lg shadow max-h-56 w-auto" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Preview of selected image.</p>
              <div className="mt-3">
                <ClearSelectionButton />
              </div>
              <SaveAltForm currentAlt={settings.aboutImageAlt} />
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600">No image selected. Choose one below.</p>
        )}
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose an image</h2>
        {images && images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((m) => (
              <div key={m._id} className="group border rounded-lg p-3 hover:shadow transition">
                <div className="relative aspect-video bg-gray-100 overflow-hidden rounded">
                  {m.file?.asset?.url && (
                    <Image src={m.file.asset.url} alt={m.title || 'Image'} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform" />
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900 truncate">{m.title || 'Untitled'}</div>
                  <SelectButton mediaId={m._id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No image media found. Create a media item with an image file in Studio.</p>
        )}
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Mission Section</h2>
        <p className="text-sm text-gray-600 mb-4">Update the mission section heading and text shown below the image on the About page.</p>
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-700">
            <div>
              <span className="font-medium">Current heading:</span>{' '}
              {settings?.aboutMissionHeading ? (
                <span>{settings.aboutMissionHeading}</span>
              ) : (
                <span className="italic text-gray-500">default (Our Mission)</span>
              )}
            </div>
            <div className="mt-1">
              <span className="font-medium">Current text:</span>
              {settings?.aboutMissionText ? (
                <span className="block whitespace-pre-wrap mt-1">{settings.aboutMissionText}</span>
              ) : (
                <span className="block whitespace-pre-wrap mt-1 italic text-gray-500">Our goal is to make it effortless to find and enjoy the content you care about. Categories help you explore themes, while the media player makes listening and watching smooth on any device.</span>
              )}
            </div>
          </div>
        </div>
        <SaveAboutMissionForm currentHeading={settings?.aboutMissionHeading} currentText={settings?.aboutMissionText} />
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional About Sections</h2>
        <p className="text-sm text-gray-600 mb-4">Manage extra text sections that appear between the image and the contact form on the About page.</p>

        {Array.isArray(settings?.aboutExtraSections) && settings!.aboutExtraSections.length > 0 ? (
          <div className="space-y-4 mb-6">
            {settings!.aboutExtraSections.map((sec) => (
              <div key={sec._key} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {sec.heading && <div className="text-sm font-medium text-gray-900">{sec.heading}</div>}
                    {sec.text && <div className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{sec.text}</div>}
                  </div>
                  <DeleteAboutSectionButton sectionKey={sec._key} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6">No extra sections added yet.</p>
        )}

        <AddAboutSectionForm />
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Form Settings</h2>
        <p className="text-sm text-gray-600 mb-4">Configure the email address that will receive contact form submissions from the About page.</p>
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Current email:</span>{' '}
            {settings?.contactEmail ? (
              <span>{settings.contactEmail}</span>
            ) : (
              <span className="italic text-gray-500">not set</span>
            )}
          </div>
        </div>
        <SaveContactEmailForm currentEmail={settings?.contactEmail} />
      </section>
    </div>
  )
}