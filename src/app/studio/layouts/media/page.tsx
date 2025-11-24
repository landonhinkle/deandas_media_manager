import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LayoutsMediaPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Media Page Layout</h1>
          <Link href="/studio/dashboard" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Grid Display</h2>
        <p className="text-sm text-gray-600 mb-4">Configure how media files are displayed in the library grid.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure grid size, thumbnail quality, items per page, and sorting options.</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtering Options</h2>
        <p className="text-sm text-gray-600 mb-4">Control what filtering and search options are available to users.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - enable/disable filters by file type, category, date, and search functionality.</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Player Integration</h2>
        <p className="text-sm text-gray-600 mb-4">Customize how the media player behaves when files are selected.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure autoplay settings, inline preview options, and player positioning.</p>
        </div>
      </section>
    </div>
  )
}