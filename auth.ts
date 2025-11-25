import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// Create a dedicated auth client to ensure we can query all user documents
const authClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false, // Don't use CDN for auth queries
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published', // Query published documents
})

interface SanityUser {
  _id: string
  email: string
  passwordHash: string
  name: string
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Vercel automatically sets NEXTAUTH_URL, but we can override
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        try {
          // Check Sanity users first
          const user = await authClient.fetch<SanityUser | null>(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email }
          )

          console.log('Fetched user:', user ? 'Found' : 'Not found')

          if (user) {
            // Verify password against hash
            const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
            console.log('Password valid:', isValid)
            if (isValid) {
              return {
                id: user._id,
                email: user.email,
                name: user.name,
              }
            }
          }

          // Fallback to environment variable admin (for backward compatibility)
          if (
            credentials.email === process.env.ADMIN_EMAIL &&
            credentials.password === process.env.ADMIN_PASSWORD_PLAINTEXT
          ) {
            console.log('Using env var admin login')
            return {
              id: '1',
              email: credentials.email,
              name: 'Admin',
            }
          }
        } catch (error) {
          console.error('Auth error:', error)
        }
        
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
