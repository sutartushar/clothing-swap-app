import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from './mongodb'
import { ObjectId } from 'mongodb'
import type { User } from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'swapstyle-secret-key-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<Omit<User, 'password'> | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const { db } = await connectToDatabase()
    const user = await db.collection<User>('users').findOne(
      { _id: new ObjectId(payload.userId) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return null
    }

    return {
      ...user,
      _id: user._id.toString(),
    }
  } catch {
    return null
  }
}
