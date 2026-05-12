import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import type { ChatMessage } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ swapId: string }> }
) {
  try {
    const { swapId } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<ChatMessage>('messages')

    const messages = await collection
      .find({ swapId })
      .sort({ createdAt: 1 })
      .toArray()

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ swapId: string }> }
) {
  try {
    const { swapId } = await params
    const { senderId, senderName, message } = await request.json()

    if (!senderId || !senderName || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<ChatMessage>('messages')

    const newMessage: ChatMessage = {
      swapId,
      senderId,
      senderName,
      message,
      createdAt: new Date(),
    }

    const result = await collection.insertOne(newMessage)

    return NextResponse.json({
      success: true,
      message: {
        ...newMessage,
        _id: result.insertedId.toString(),
      },
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
