'use client'

import { useSession } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const contentPadding = isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16'

  const isActive = (path: string) => {
    if (path === '/studio/dashboard') {
      return pathname === path
    }
    if (path === '/studio/preview/home') {
      return pathname?.startsWith('/studio/preview')
    }
    return pathname?.startsWith(path)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/login')
  }

  return (
  <div className="min-h-screen bg-dashboard">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white/70 backdrop-blur-sm shadow-lg transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-64 lg:w-16'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className={`flex items-center h-16 border-b border-white px-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800">App Editor</h2>
              {/* Collapse sidebar button (always visible) */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Collapse sidebar"
                title="Collapse"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            // Collapsed: show only expand button
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Expand sidebar"
              title="Expand"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        <nav className="py-4 pl-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/studio/dashboard"
                aria-label="Dashboard"
                title="Dashboard"
                className={`flex items-center py-2 hover:bg-gray-100 hover:rounded-lg ${
                  isSidebarOpen ? 'pr-4 justify-start' : 'pr-4 justify-center'
                } ${
                  isActive('/studio/dashboard')
                    ? 'bg-indigo-100 text-indigo-700 rounded-lg'
                    : 'text-gray-700'
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''} shrink-0`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <div>
                <Link
                  href="/studio/structure"
                  aria-label="Sanity Studio"
                  title="Sanity Studio"
                  className={`flex items-center py-2 hover:bg-gray-100 hover:rounded-lg ${
                    isSidebarOpen ? 'pr-4 justify-start' : 'pr-4 justify-center'
                  } ${
                    isActive('/studio/structure')
                      ? 'bg-indigo-100 text-indigo-700 rounded-lg'
                      : 'text-gray-700'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''} shrink-0`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  {isSidebarOpen && <span>Sanity Studio</span>}
                </Link>
                {/* Sub-navigation for Sanity Studio when active */}
                {isSidebarOpen && isActive('/studio/structure') && (
                  <ul className="mt-1 space-y-1 bg-indigo-50/50 rounded-lg">
                    <li>
                      <Link
                        href="/studio/media"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/media'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        App Media
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div>
                <Link
                  href="/studio/preview/home"
                  aria-label="Site Preview"
                  title="Site Preview"
                  className={`flex items-center py-2 hover:bg-gray-100 hover:rounded-lg ${
                    isSidebarOpen ? 'pr-4 justify-start' : 'pr-4 justify-center'
                  } ${
                    isActive('/studio/preview/home')
                      ? 'bg-indigo-100 text-indigo-700 rounded-lg'
                      : 'text-gray-700'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''} shrink-0`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {isSidebarOpen && <span>Site Preview</span>}
                </Link>
                {/* Sub-navigation for Site Preview */}
                {isSidebarOpen && isActive('/studio/preview/home') && (
                  <ul className="mt-1 space-y-1 bg-indigo-50/50 rounded-lg">
                    <li>
                      <Link
                        href="/studio/preview/home"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/preview/home'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/studio/preview/media"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/preview/media'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        Media
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/studio/preview/media_player"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/preview/media_player'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        Media Player
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/studio/preview/about"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/preview/about'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div>
                <Link
                  href="/studio/layouts/home"
                  aria-label="Layouts"
                  title="Layouts"
                  className={`flex items-center py-2 hover:bg-gray-100 hover:rounded-lg ${
                    isSidebarOpen ? 'pr-4 justify-start' : 'pr-4 justify-center'
                  } ${
                    isActive('/studio/layouts')
                      ? 'bg-indigo-100 text-indigo-700 rounded-lg'
                      : 'text-gray-700'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''} shrink-0`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"
                    />
                  </svg>
                  {isSidebarOpen && <span>Layouts</span>}
                </Link>
                {/* Sub-navigation for Layouts */}
                {isSidebarOpen && isActive('/studio/layouts') && (
                  <ul className="mt-1 space-y-1 bg-indigo-50/50 rounded-lg">
                    <li>
                      <Link
                        href="/studio/layouts/home"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/layouts/home'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        Edit Home Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/studio/layouts/media"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/layouts/media'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        Edit Media Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/studio/layouts/media_player"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/layouts/media_player'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        Edit Media Player Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/studio/layouts/about"
                        className={`flex items-center py-1.5 pl-8 pr-4 text-sm hover:bg-indigo-100 hover:rounded-lg ${
                          pathname === '/studio/layouts/about'
                            ? 'text-indigo-700 font-medium bg-indigo-100 rounded-lg'
                            : 'text-gray-600'
                        }`}
                      >
                        Edit About Page
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <Link
                href="/studio/settings"
                aria-label="Settings"
                title="Settings"
                className={`flex items-center py-2 hover:bg-gray-100 hover:rounded-lg ${
                  isSidebarOpen ? 'pr-4 justify-start' : 'pr-4 justify-center'
                } ${
                  isActive('/studio/settings')
                    ? 'bg-indigo-100 text-indigo-700 rounded-lg'
                    : 'text-gray-700'
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''} shrink-0`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {isSidebarOpen && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile sidebar toggle */}
      <div className={contentPadding}>
  <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <span className="text-sm text-gray-700">{session.user?.email}</span>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
