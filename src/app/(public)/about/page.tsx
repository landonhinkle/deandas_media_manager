import { sanityFetch } from '@/lib/sanity/client'
import { SITE_SETTINGS } from '@/lib/sanity/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SiteSettings { title?: string; description?: string }

async function getData() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS })
  return { settings }
}

export default async function AboutPage() {
  const { settings } = await getData()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About{settings?.title ? ` ${settings.title}` : ''}</h1>
        {settings?.description ? (
          <p className="text-lg text-gray-600">{settings.description}</p>
        ) : (
          <p className="text-lg text-gray-600">
            We built this site to organize and share our media in a simple, beautiful way. Check back as we continue to grow the collection.
          </p>
        )}
      </section>

      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          Our goal is to make it effortless to find and enjoy the content you care about. Categories help you explore themes, while the media player makes listening and watching smooth on any device.
        </p>
      </section>
    </div>
  )
}
