'use client'

import { CATEGORIES } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selected === category
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
