import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import type { SwapProposal } from '@/lib/types'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<SwapProposal>('swaps')

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Swap not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating swap:', error)
    return NextResponse.json(
      { error: 'Failed to update swap' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<SwapProposal>('swaps')

    const swap = await collection.findOne({ _id: new ObjectId(id) })

    if (!swap) {
      return NextResponse.json(
        { error: 'Swap not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(swap)
  } catch (error) {
    console.error('Error fetching swap:', error)
    return NextResponse.json(
      { error: 'Failed to fetch swap' },
      { status: 500 }
    )
  }
}
