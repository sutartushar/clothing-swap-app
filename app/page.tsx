'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ClothingItem, SwapProposal } from '@/lib/types'
import { Hero } from '@/components/hero'
import { CategoryFilter } from '@/components/category-filter'
import { ItemGrid } from '@/components/item-grid'
import { ItemDetailDialog } from '@/components/item-detail-dialog'
import { AddItemDialog } from '@/components/add-item-dialog'
import { BottomNav } from '@/components/bottom-nav'
import { SwapsView } from '@/components/swaps-view'
import { ProfileView } from '@/components/profile-view'
import { AuthDialog } from '@/components/auth-dialog'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

type NavItem = 'browse' | 'swaps' | 'add' | 'profile'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [activeNav, setActiveNav] = useState<NavItem>('browse')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [items, setItems] = useState<ClothingItem[]>([])
  const [swaps, setSwaps] = useState<SwapProposal[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingSwaps, setLoadingSwaps] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
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
    if (!user) return
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
  }, [user])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    if (activeNav === 'swaps' && user) {
      fetchSwaps()
    }
  }, [activeNav, fetchSwaps, user])

  const handleBrowseClick = () => {
    setActiveNav('browse')
    browseRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item)
    setDetailDialogOpen(true)
  }

  const handleAddClick = () => {
    if (!user) {
      setAuthMode('login')
      setAuthDialogOpen(true)
      return
    }
    setAddDialogOpen(true)
  }

  const handleNavChange = (nav: NavItem) => {
    // Profile and Swaps require login
    if ((nav === 'profile' || nav === 'swaps') && !user) {
      setAuthMode('login')
      setAuthDialogOpen(true)
      return
    }
    setActiveNav(nav)
  }

  const handleItemAdded = () => {
    fetchItems()
    setActiveNav('browse')
  }

  const handleLoginRequired = () => {
    setDetailDialogOpen(false)
    setAuthMode('login')
    setAuthDialogOpen(true)
  }

  const openRegister = () => {
    setAuthMode('register')
    setAuthDialogOpen(true)
  }

  // Protected content component
  const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
    if (authLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-medium text-foreground mb-2">
            Sign In Required
          </h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Please sign in to access this feature
          </p>
          <Button onClick={() => setAuthDialogOpen(true)}>
            Sign In
          </Button>
        </div>
      )
    }

    return <>{children}</>
  }

  return (
    <main className="min-h-screen pb-24">
      {activeNav === 'browse' && (
        <>
          <Hero onBrowseClick={handleBrowseClick} onGetStarted={openRegister} />
          
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
          <ProtectedContent>
            <SwapsView 
              swaps={swaps} 
              loading={loadingSwaps} 
              onSwapUpdate={fetchSwaps}
            />
          </ProtectedContent>
        </section>
      )}

      {activeNav === 'profile' && (
        <section className="px-4 md:px-6 lg:px-8 max-w-lg mx-auto py-8">
          <ProtectedContent>
            <ProfileView />
          </ProtectedContent>
        </section>
      )}

      <BottomNav
        active={activeNav}
        onChange={handleNavChange}
        onAddClick={handleAddClick}
      />

      <ItemDetailDialog
        item={selectedItem}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onLoginRequired={handleLoginRequired}
      />

      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onItemAdded={handleItemAdded}
      />

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode={authMode}
      />
    </main>
  )
}
