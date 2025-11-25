import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// Create a write client for user creation
const writeClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN, // This needs to be a token with write permissions
  perspective: 'published',
})

const MAX_USERS = 2

export async function POST(request: Request) {
  try {
    const { token, email, password, name } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check secret token
    if (token !== process.env.SIGNUP_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid or missing signup token' },
        { status: 403 }
      )
    }

    // Check if max users reached
    const existingUsers = await writeClient.fetch<number>(
      `count(*[_type == "user"])`
    )

    if (existingUsers >= MAX_USERS) {
      return NextResponse.json(
        { error: 'Maximum number of users reached. Registration is closed.' },
        { status: 403 }
      )
    }

    // Check if email already exists
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user in Sanity
    const newUser = await writeClient.create({
      _type: 'user',
      email,
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // Check secret token
    if (token !== process.env.SIGNUP_SECRET_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 403 }
      )
    }

    // Check if signup is still available
    const existingUsers = await writeClient.fetch<number>(
      `count(*[_type == "user"])`
    )

    return NextResponse.json({
      available: existingUsers < MAX_USERS,
      currentUsers: existingUsers,
      maxUsers: MAX_USERS,
    })
  } catch (error) {
    console.error('Signup check error:', error)
    return NextResponse.json(
      { error: 'Failed to check signup availability' },
      { status: 500 }
    )
  }
}
