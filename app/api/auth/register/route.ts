import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { generateToken } from '@/lib/auth'
import type { User } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, location } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const usersCollection = db.collection<User>('users')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      location: location || '',
      itemsListed: 0,
      swapsDone: 0,
      co2Saved: 0,
      createdAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser as User)

    // Generate token
    const token = generateToken({
      userId: result.insertedId.toString(),
      email,
    })

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        _id: result.insertedId.toString(),
        name,
        email,
        avatar: newUser.avatar,
        location: newUser.location,
        itemsListed: 0,
        swapsDone: 0,
        co2Saved: 0,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
