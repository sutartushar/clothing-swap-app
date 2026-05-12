import { MongoClient, Db } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI!

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable')
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(MONGO_URI)
  const db = client.db('swapstyle')

  cachedClient = client
  cachedDb = db

  return { client, db }
}
