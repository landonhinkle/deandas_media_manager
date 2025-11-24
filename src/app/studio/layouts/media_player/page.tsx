import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LayoutsMediaPlayerPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Media Player Page Layout</h1>
          <Link href="/studio/dashboard" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Player Display</h2>
        <p className="text-sm text-gray-600 mb-4">Configure how the media player is displayed on the media player page.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure player size, controls visibility, and autoplay settings.</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Played</h2>
        <p className="text-sm text-gray-600 mb-4">Customize the recently played media section.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure number of items shown, display style, and ordering.</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Browser</h2>
        <p className="text-sm text-gray-600 mb-4">Control how categories are displayed for browsing.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure category layout, inline media display, and filtering options.</p>
        </div>
      </section>
    </div>
  )
}