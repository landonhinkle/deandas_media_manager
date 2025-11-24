import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LayoutsHomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Home Page Layout</h1>
          <Link href="/studio/dashboard" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
        <p className="text-sm text-gray-600 mb-4">Configure the welcome hero banner displayed at the top of the home page.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure hero text, background, and call-to-action buttons.</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Media</h2>
        <p className="text-sm text-gray-600 mb-4">Customize how recent media is displayed on the home page.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure number of items shown, grid layout options, and filtering preferences.</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories Display</h2>
        <p className="text-sm text-gray-600 mb-4">Control how categories are presented on the home page.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Coming soon - configure category card styling, ordering, and descriptions.</p>
        </div>
      </section>
    </div>
  )
}