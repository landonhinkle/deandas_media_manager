import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get('error')
  
  // Handle NextAuth error callbacks
  return NextResponse.json({ 
    error: error || 'Authentication error occurred',
    timestamp: new Date().toISOString()
  }, { 
    status: 400 
  })
}

export async function POST(request: NextRequest) {
  return GET(request)
}

// Ensure this file is treated as a module
export {}