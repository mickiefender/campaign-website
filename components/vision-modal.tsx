'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface VisionModalProps {
  isOpen: boolean
  onClose: () => void
  vision: {
    title: string
    desc: string
    icon: React.ReactNode
    details: string
    color: string
  } | null
}

export function VisionModal({ isOpen, onClose, vision }: VisionModalProps) {
  if (!vision) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${vision.color}`}>
              {vision.icon}
            </div>
            {vision.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-base text-muted-foreground font-medium">{vision.desc}</p>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">More Details</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{vision.details}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
