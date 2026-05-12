'use client'

import { ClothingItem } from '@/lib/types'
import { ItemCard } from './item-card'
import { Loader2 } from 'lucide-react'

interface ItemGridProps {
  items: ClothingItem[]
  loading: boolean
  onItemClick: (item: ClothingItem) => void
}

export function ItemGrid({ items, loading, onItemClick }: ItemGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">👗</span>
        </div>
        <h3 className="font-serif text-xl font-medium text-foreground mb-2">
          No items found
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Be the first to add an item in this category!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((item) => (
        <ItemCard 
          key={item._id} 
          item={item} 
          onClick={() => onItemClick(item)} 
        />
      ))}
    </div>
  )
}
