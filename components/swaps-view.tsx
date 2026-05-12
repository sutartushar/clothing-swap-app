'use client'

import { useState } from 'react'
import { useAuth } from './auth-provider'
import { SwapProposal } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChatDialog } from './chat-dialog'
import { ArrowLeftRight, Loader2, Check, X, MessageCircle } from 'lucide-react'

interface SwapsViewProps {
  swaps: SwapProposal[]
  loading: boolean
  onSwapUpdate?: () => void
}

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-red-100 text-red-700',
}

export function SwapsView({ swaps, loading, onSwapUpdate }: SwapsViewProps) {
  const { user } = useAuth()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedSwap, setSelectedSwap] = useState<SwapProposal | null>(null)

  const handleStatusUpdate = async (swapId: string, status: 'accepted' | 'declined') => {
    setUpdatingId(swapId)
    try {
      const response = await fetch(`/api/swaps/${swapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        onSwapUpdate?.()
      }
    } catch (error) {
      console.error('Error updating swap:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOpenChat = (swap: SwapProposal) => {
    setSelectedSwap(swap)
    setChatOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (swaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <ArrowLeftRight className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-medium text-foreground mb-2">
          No Swap Proposals Yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          When you propose a swap or receive one, it will appear here
        </p>
      </div>
    )
  }

  // Separate swaps into received (where user owns the item) and sent (where user proposed)
  const receivedSwaps = swaps.filter((swap) => swap.itemOwnerId === user?._id)
  const sentSwaps = swaps.filter((swap) => swap.proposerId === user?._id)

  return (
    <div className="space-y-8">
      {/* Received Swaps */}
      {receivedSwaps.length > 0 && (
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            Received Proposals ({receivedSwaps.length})
          </h3>
          <div className="space-y-4">
            {receivedSwaps.map((swap) => (
              <Card key={swap._id} className="border-0 shadow-sm bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{swap.proposerName}</p>
                      <p className="text-sm text-muted-foreground">wants your {swap.itemTitle || 'item'}</p>
                    </div>
                    <Badge className={`${statusColors[swap.status]} border-0 capitalize`}>
                      {swap.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 mb-3">
                    <p className="text-sm text-muted-foreground mb-1">Offering:</p>
                    <p className="font-medium text-foreground">{swap.offerDescription}</p>
                  </div>
                  {swap.message && (
                    <p className="text-sm text-muted-foreground italic mb-3">
                      &ldquo;{swap.message}&rdquo;
                    </p>
                  )}
                  
                  {/* Actions */}
                  {swap.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(swap._id!, 'accepted')}
                        disabled={updatingId === swap._id}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        {updatingId === swap._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(swap._id!, 'declined')}
                        disabled={updatingId === swap._id}
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        {updatingId === swap._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {swap.status === 'accepted' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenChat(swap)}
                      className="w-full mt-4"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat to Arrange Swap
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(swap.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sent Swaps */}
      {sentSwaps.length > 0 && (
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            Your Proposals ({sentSwaps.length})
          </h3>
          <div className="space-y-4">
            {sentSwaps.map((swap) => (
              <Card key={swap._id} className="border-0 shadow-sm bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">For: {swap.itemTitle || 'Item'}</p>
                      <p className="text-sm text-muted-foreground">Your proposal</p>
                    </div>
                    <Badge className={`${statusColors[swap.status]} border-0 capitalize`}>
                      {swap.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 mb-3">
                    <p className="text-sm text-muted-foreground mb-1">You offered:</p>
                    <p className="font-medium text-foreground">{swap.offerDescription}</p>
                  </div>
                  {swap.message && (
                    <p className="text-sm text-muted-foreground italic mb-3">
                      &ldquo;{swap.message}&rdquo;
                    </p>
                  )}

                  {swap.status === 'accepted' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenChat(swap)}
                      className="w-full mt-2"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat to Arrange Swap
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(swap.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <ChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        swap={selectedSwap}
      />
    </div>
  )
}
