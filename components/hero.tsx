'use client'

import { Button } from '@/components/ui/button'
import { Leaf, ArrowDown } from 'lucide-react'

interface HeroProps {
  onBrowseClick: () => void
  onGetStarted?: () => void
}

export function Hero({ onBrowseClick, onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
          <Leaf className="w-4 h-4" />
          <span>Sustainable Fashion Movement</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight text-balance mb-6">
          Give Your Wardrobe a{' '}
          <span className="text-primary">Second Life</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 text-pretty leading-relaxed">
          Swap clothes with others who share your style. Refresh your closet sustainably while reducing fashion waste.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onBrowseClick}
            className="px-8 py-6 text-base font-medium rounded-full"
          >
            Start Swapping
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-medium rounded-full border-2"
            onClick={onGetStarted}
          >
            Join Now
          </Button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-lg">2.5k+</span>
            <span>Active Swappers</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-lg">10k+</span>
            <span>Items Swapped</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-lg">5 tons</span>
            <span>CO2 Saved</span>
          </div>
        </div>
      </div>

      <button
        onClick={onBrowseClick}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        aria-label="Scroll to browse"
      >
        <span className="text-sm font-medium">Browse Items</span>
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  )
}
