'use client'

import { useState, useEffect } from 'react'
import { X, Play } from 'lucide-react'

interface VideoModalProps {
  videoUrl?: string
  title?: string
  onClose?: () => void
}

export function VideoModal({ videoUrl = '/campaign-video.mp4', title = 'Campaign Message', onClose }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showButton, setShowButton] = useState(true)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isClosing) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isClosing])

  const handleOpen = () => {
    setIsOpen(true)
    setShowButton(false)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      setShowButton(true)
      onClose?.()
    }, 200)
  }

  if (!isOpen && !showButton) return null

  return (
    <>
      {/* Floating Play Button */}
      {showButton && !isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-8 right-8 z-40 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
          aria-label="Watch campaign video"
          style={{ willChange: 'transform' }}
        >
          <Play size={28} className="group-hover:scale-110 transition-transform" fill="currentColor" />
          <span className="absolute -top-12 right-0 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Watch Video
          </span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <>
          {/* Modal Overlay - Simplified */}
          <div
            className={`fixed inset-0 z-40 bg-black/80 transition-opacity duration-200 ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleClose}
            style={{ willChange: 'opacity' }}
          />

          {/* Modal Content */}
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
              isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ willChange: 'transform, opacity' }}
          >
            <div
              className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-red-500/30"
              onClick={(e) => e.stopPropagation()}
              style={{ willChange: 'transform' }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-200 group shadow-lg"
                aria-label="Close video"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* Title */}
              {title && (
                <div className="relative bg-red-600 px-6 py-4">
                  <h2 className="relative text-white text-xl md:text-2xl font-bold">{title}</h2>
                </div>
              )}

              {/* Video Container */}
              <div className="relative bg-black w-full pt-[56.25%]">
                <video
                  playsInline
                  controls
                  className="absolute inset-0 w-full h-full"
                  controlsList="nodownload"
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Footer */}
              <div className="relative bg-slate-800 px-6 py-3 border-t border-red-500/20">
                <div className="flex items-center justify-between">
                  <p className="text-gray-300 text-sm">Press <span className="px-2 py-1 bg-red-600/30 text-red-400 rounded font-mono text-xs">ESC</span> to close</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <p className="text-xs text-gray-400">New Patriotic Party</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
``
