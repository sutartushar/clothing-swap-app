export interface User {
  _id?: string
  name: string
  email: string
  password: string
  avatar: string
  location: string
  itemsListed: number
  swapsDone: number
  co2Saved: number
  createdAt: Date
}

export interface ClothingItem {
  _id?: string
  title: string
  description: string
  category: string
  size: string
  condition: 'new' | 'like-new' | 'good' | 'fair'
  imageUrl: string
  ownerId: string
  owner: {
    name: string
    avatar: string
    location: string
  }
  createdAt: Date
}

export interface SwapProposal {
  _id?: string
  itemId: string
  itemTitle: string
  itemOwnerId: string
  proposerId: string
  proposerName: string
  proposerEmail: string
  message: string
  offerDescription: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: Date
}

export interface ChatMessage {
  _id?: string
  swapId: string
  senderId: string
  senderName: string
  message: string
  createdAt: Date
}

export const CATEGORIES = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
] as const

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

export const CONDITIONS = [
  { value: 'new', label: 'New with tags' },
  { value: 'like-new', label: 'Like new' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
] as const
