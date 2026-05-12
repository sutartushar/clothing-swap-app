import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ClothingItem } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const { db } = await connectToDatabase()
    const collection = db.collection<ClothingItem>('items')

    const query = category && category !== 'All' ? { category } : {}
    const items = await collection.find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    const collection = db.collection<ClothingItem>('items')

    const newItem: ClothingItem = {
      ...body,
      createdAt: new Date(),
    }

    const result = await collection.insertOne(newItem)

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
