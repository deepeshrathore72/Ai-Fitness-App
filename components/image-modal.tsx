"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  query: string
}

export function ImageModal({ isOpen, onClose, title, query }: ImageModalProps) {
  // Use Pollinations.ai for free AI image generation
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=1024&height=1024&model=flux&nologo=true`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
        <p className="text-sm text-muted-foreground text-center">AI-generated visual representation</p>
      </DialogContent>
    </Dialog>
  )
}
