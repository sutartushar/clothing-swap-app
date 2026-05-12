import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { SwapProposal } from '@/lib/types'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<SwapProposal>('swaps')

    const swaps = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(swaps)
  } catch (error) {
    console.error('Error fetching swaps:', error)
    return NextResponse.json({ error: 'Failed to fetch swaps' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    const collection = db.collection<SwapProposal>('swaps')

    const newSwap: SwapProposal = {
      ...body,
      status: 'pending',
      createdAt: new Date(),
    }

    const result = await collection.insertOne(newSwap)

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating swap:', error)
    return NextResponse.json({ error: 'Failed to create swap' }, { status: 500 })
  }
}
