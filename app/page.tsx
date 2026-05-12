'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ClothingItem, SwapProposal } from '@/lib/types'
import { Hero } from '@/components/hero'
import { CategoryFilter } from '@/components/category-filter'
import { ItemGrid } from '@/components/item-grid'
import { ItemDetailDialog } from '@/components/item-detail-dialog'
import { AddItemDialog } from '@/components/add-item-dialog'
import { BottomNav } from '@/components/bottom-nav'
import { SwapsView } from '@/components/swaps-view'
import { ProfileView } from '@/components/profile-view'

type NavItem = 'browse' | 'swaps' | 'add' | 'profile'

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavItem>('browse')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [items, setItems] = useState<ClothingItem[]>([])
  const [swaps, setSwaps] = useState<SwapProposal[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingSwaps, setLoadingSwaps] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const browseRef = useRef<HTMLDivElement>(null)

  const fetchItems = useCallback(async () => {
    setLoadingItems(true)
    try {
      const params = selectedCategory !== 'All' ? `?category=${selectedCategory}` : ''
      const response = await fetch(`/api/items${params}`)
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching items:', error)
      setItems([])
    } finally {
      setLoadingItems(false)
    }
  }, [selectedCategory])

  const fetchSwaps = useCallback(async () => {
    setLoadingSwaps(true)
    try {
      const response = await fetch('/api/swaps')
      const data = await response.json()
      setSwaps(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching swaps:', error)
      setSwaps([])
    } finally {
      setLoadingSwaps(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    if (activeNav === 'swaps') {
      fetchSwaps()
    }
  }, [activeNav, fetchSwaps])

  const handleBrowseClick = () => {
    setActiveNav('browse')
    browseRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item)
    setDetailDialogOpen(true)
  }

  const handleAddClick = () => {
    setAddDialogOpen(true)
  }

  const handleItemAdded = () => {
    fetchItems()
    setActiveNav('browse')
  }

  return (
    <main className="min-h-screen pb-24">
      {activeNav === 'browse' && (
        <>
          <Hero onBrowseClick={handleBrowseClick} />
          
          <section ref={browseRef} className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-12">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-3">
                Discover Pieces
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Browse unique items from our community ready to find a new home
              </p>
            </div>

            <div className="mb-8">
              <CategoryFilter
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <ItemGrid
              items={items}
              loading={loadingItems}
              onItemClick={handleItemClick}
            />
          </section>
        </>
      )}

      {activeNav === 'swaps' && (
        <section className="px-4 md:px-6 lg:px-8 max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-3">
              Your Swaps
            </h2>
            <p className="text-muted-foreground">
              Track your swap proposals and activity
            </p>
          </div>
          <SwapsView swaps={swaps} loading={loadingSwaps} />
        </section>
      )}

      {activeNav === 'profile' && (
        <section className="px-4 md:px-6 lg:px-8 max-w-lg mx-auto py-8">
          <ProfileView />
        </section>
      )}

      <BottomNav
        active={activeNav}
        onChange={setActiveNav}
        onAddClick={handleAddClick}
      />

      <ItemDetailDialog
        item={selectedItem}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onItemAdded={handleItemAdded}
      />
    </main>
  )
}
