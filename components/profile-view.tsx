'use client'

import Image from 'next/image'
import { useAuth } from './auth-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Leaf, Package, ArrowLeftRight, Settings, LogOut, Loader2 } from 'lucide-react'

export function ProfileView() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
          <Image
            src={user.avatar}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          {user.name}
        </h2>
        {user.location && (
          <p className="text-muted-foreground">{user.location}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4 text-center">
            <Package className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-semibold text-foreground">{user.itemsListed}</p>
            <p className="text-xs text-muted-foreground">Items Listed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4 text-center">
            <ArrowLeftRight className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-semibold text-foreground">{user.swapsDone}</p>
            <p className="text-xs text-muted-foreground">Swaps Done</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4 text-center">
            <Leaf className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-semibold text-foreground">{user.co2Saved}kg</p>
            <p className="text-xs text-muted-foreground">CO2 Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Impact Card */}
      <Card className="border-0 shadow-sm bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-serif text-lg font-medium text-foreground">
              Your Sustainability Impact
            </h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            By swapping clothes instead of buying new, you&apos;ve helped reduce textile waste 
            and saved the equivalent of {user.co2Saved}kg of CO2 emissions. Keep swapping to make a bigger impact!
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start rounded-xl h-12">
          <Settings className="w-4 h-4 mr-3" />
          Account Settings
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start rounded-xl h-12 text-muted-foreground hover:text-destructive hover:border-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-4">
        SwapStyle v1.0 - Made with love for the planet
      </p>
    </div>
  )
}
