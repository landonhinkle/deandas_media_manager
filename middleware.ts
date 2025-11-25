export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/studio/dashboard/:path*', '/studio/layouts/:path*', '/studio/media/:path*', '/studio/preview/:path*']
}
