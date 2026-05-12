'use client'

import { cn } from '@/lib/utils'
import { Search, ArrowLeftRight, PlusCircle, User } from 'lucide-react'

type NavItem = 'browse' | 'swaps' | 'add' | 'profile'

interface BottomNavProps {
  active: NavItem
  onChange: (item: NavItem) => void
  onAddClick: () => void
}

const navItems = [
  { id: 'browse' as const, icon: Search, label: 'Browse' },
  { id: 'swaps' as const, icon: ArrowLeftRight, label: 'Swaps' },
  { id: 'add' as const, icon: PlusCircle, label: 'Add' },
  { id: 'profile' as const, icon: User, label: 'Profile' },
]

export function BottomNav({ active, onChange, onAddClick }: BottomNavProps) {
  const handleClick = (id: NavItem) => {
    if (id === 'add') {
      onAddClick()
    } else {
      onChange(id)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          const isAdd = item.id === 'add'

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-6 transition-colors',
                isAdd 
                  ? 'text-primary' 
                  : isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon 
                className={cn(
                  'w-6 h-6 transition-transform',
                  isAdd && 'scale-110',
                  isActive && !isAdd && 'scale-105'
                )} 
                strokeWidth={isActive || isAdd ? 2.5 : 2}
              />
              <span className={cn(
                'text-xs font-medium',
                isActive && 'text-primary'
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
      {/* Safe area for mobile */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  )
}
