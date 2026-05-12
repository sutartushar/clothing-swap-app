'use client'

import { SwapProposal } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftRight, Loader2 } from 'lucide-react'

interface SwapsViewProps {
  swaps: SwapProposal[]
  loading: boolean
}

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-red-100 text-red-700',
}

export function SwapsView({ swaps, loading }: SwapsViewProps) {
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

  return (
    <div className="space-y-4">
      {swaps.map((swap) => (
        <Card key={swap._id} className="border-0 shadow-sm bg-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-foreground">{swap.proposerName}</p>
                <p className="text-sm text-muted-foreground">{swap.proposerEmail}</p>
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
              <p className="text-sm text-muted-foreground italic">
                &ldquo;{swap.message}&rdquo;
              </p>
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
  )
}
