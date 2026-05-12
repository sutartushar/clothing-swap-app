'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from './auth-provider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage, SwapProposal } from '@/lib/types'

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  swap: SwapProposal | null
}

export function ChatDialog({ open, onOpenChange, swap }: ChatDialogProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && swap?._id) {
      fetchMessages()
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [open, swap?._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    if (!swap?._id) return
    
    try {
      setLoading(messages.length === 0)
      const response = await fetch(`/api/chat/${swap._id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !swap?._id) return

    setSending(true)
    try {
      const response = await fetch(`/api/chat/${swap._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user._id,
          senderName: user.name,
          message: newMessage.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, data.message])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-xl bg-card h-[600px] flex flex-col">
        <DialogHeader className="pb-2 border-b border-border">
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Swap Chat
          </DialogTitle>
          {swap && (
            <p className="text-sm text-muted-foreground">
              Discussing swap with {swap.proposerName}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                Start chatting to arrange your swap!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === user?._id
              return (
                <div
                  key={msg._id}
                  className={cn(
                    'flex',
                    isOwn ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2',
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-secondary-foreground rounded-bl-md'
                    )}
                  >
                    {!isOwn && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className={cn(
                      'text-[10px] mt-1',
                      isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-border">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-background"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending}
            className="shrink-0"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
