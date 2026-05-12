'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { CATEGORIES, SIZES, CONDITIONS } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Camera, Loader2, CheckCircle2, X } from 'lucide-react'

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemAdded: () => void
}

export function AddItemDialog({ open, onOpenChange, onItemAdded }: AddItemDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    imageUrl: '',
    ownerName: '',
    ownerLocation: '',
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await response.json()
      if (data.imageUrl) {
        setFormData({ ...formData, imageUrl: data.imageUrl })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.imageUrl) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          size: formData.size,
          condition: formData.condition,
          imageUrl: formData.imageUrl,
          owner: {
            name: formData.ownerName,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.ownerName}`,
            location: formData.ownerLocation,
          },
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onItemAdded()
          handleClose()
        }, 1500)
      }
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      size: '',
      condition: '',
      imageUrl: '',
      ownerName: '',
      ownerLocation: '',
    })
    setImagePreview(null)
    setSubmitted(false)
    onOpenChange(false)
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData({ ...formData, imageUrl: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-semibold text-foreground">
            Add an Item
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
            <p className="font-serif text-xl font-medium text-foreground mb-2">
              Item Added!
            </p>
            <p className="text-muted-foreground">
              Your item is now available for swapping
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium">Photo</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative aspect-square w-full max-w-[200px] rounded-xl overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-[200px] aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors bg-secondary/30"
                  >
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Add photo
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Levi's Denim Jacket"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your item..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            {/* Category & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Size</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <Label className="text-sm font-medium">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value}>
                      {cond.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Owner Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ownerLocation" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="ownerLocation"
                  placeholder="e.g., Brooklyn, NY"
                  value={formData.ownerLocation}
                  onChange={(e) => setFormData({ ...formData, ownerLocation: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full font-medium"
              disabled={submitting || !formData.imageUrl}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Item...
                </>
              ) : (
                'Add to Swap'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
