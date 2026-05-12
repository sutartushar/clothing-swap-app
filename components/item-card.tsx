'use client'

import Image from 'next/image'
import { ClothingItem } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'

interface ItemCardProps {
  item: ClothingItem
  onClick: () => void
}

const conditionColors = {
  'new': 'bg-emerald-100 text-emerald-700',
  'like-new': 'bg-teal-100 text-teal-700',
  'good': 'bg-amber-100 text-amber-700',
  'fair': 'bg-orange-100 text-orange-700',
}

const conditionLabels = {
  'new': 'New',
  'like-new': 'Like New',
  'good': 'Good',
  'fair': 'Fair',
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={`${conditionColors[item.condition]} border-0 font-medium`}>
            {conditionLabels[item.condition]}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm font-semibold">
            {item.size}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-foreground truncate mb-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
            <Image
              src={item.owner.avatar}
              alt={item.owner.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm text-muted-foreground truncate flex-1">
            {item.owner.name}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{item.owner.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
