'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ClothingItem } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MapPin, ArrowLeftRight, Loader2, CheckCircle2 } from 'lucide-react'

interface ItemDetailDialogProps {
  item: ClothingItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const conditionLabels = {
  'new': 'New with tags',
  'like-new': 'Like new',
  'good': 'Good condition',
  'fair': 'Fair condition',
}

export function ItemDetailDialog({ item, open, onOpenChange }: ItemDetailDialogProps) {
  const [showSwapForm, setShowSwapForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    proposerName: '',
    proposerEmail: '',
    offerDescription: '',
    message: '',
  })

  const handleSubmitSwap = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          itemId: item._id,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setShowSwapForm(false)
          setSubmitted(false)
          setFormData({
            proposerName: '',
            proposerEmail: '',
            offerDescription: '',
            message: '',
          })
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting swap:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setShowSwapForm(false)
      setSubmitted(false)
    }
    onOpenChange(open)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-card">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left mb-4">
              <DialogTitle className="font-serif text-2xl font-semibold text-foreground">
                {item.title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="font-medium">
                Size {item.size}
              </Badge>
              <Badge variant="outline" className="font-medium">
                {item.category}
              </Badge>
              <Badge variant="outline" className="font-medium text-primary border-primary/30">
                {conditionLabels[item.condition]}
              </Badge>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
              {item.description}
            </p>

            {/* Owner Info */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.owner.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{item.owner.location}</span>
                </div>
              </div>
            </div>

            {!showSwapForm ? (
              <Button
                size="lg"
                className="w-full rounded-full font-medium"
                onClick={() => setShowSwapForm(true)}
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Propose a Swap
              </Button>
            ) : submitted ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary mb-3" />
                <p className="font-medium text-foreground">Swap Proposal Sent!</p>
                <p className="text-sm text-muted-foreground">
                  {item.owner.name} will review your offer
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSwap} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.proposerName}
                      onChange={(e) => setFormData({ ...formData, proposerName: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.proposerEmail}
                      onChange={(e) => setFormData({ ...formData, proposerEmail: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="offer" className="text-sm font-medium">
                    What would you like to offer?
                  </Label>
                  <Input
                    id="offer"
                    placeholder="e.g., Blue denim jacket, Size M"
                    value={formData.offerDescription}
                    onChange={(e) => setFormData({ ...formData, offerDescription: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal note..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1 resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => setShowSwapForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Proposal'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
