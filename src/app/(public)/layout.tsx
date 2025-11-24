import Link from 'next/link'
import { Metadata } from 'next'
import MobileNavigation from '@/components/public/MobileNavigation'

export const metadata: Metadata = {
  title: 'Deandas Media | Home',
  description: 'Browse our media collection and content.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
              Deandas Media
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/media"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Media
              </Link>
              <Link
                href="/media_player"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Media Player
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Deandas Media</h3>
              <p className="text-sm text-gray-400">
                Your media collection, beautifully organized.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/media" className="hover:text-white transition-colors">
                    Media
                  </Link>
                </li>
                <li>
                  <Link href="/media_player" className="hover:text-white transition-colors">
                    Media Player
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact/Social */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Connect</h4>
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Deandas Media. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
