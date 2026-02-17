'use client'

import { useEffect, useState } from 'react'

export default function TypingName() {
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const fullName = 'Dr. Charles Dwamena(Dr. China)'
  const typingSpeed = 50
  const deletingSpeed = 30
  const delayBeforeDelete = 2000
  const delayBeforeRetype= 500

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      // Typing mode
      if (displayText.length < fullName.length) {
        timeout = setTimeout(() => {
          setDisplayText(fullName.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        // Wait before starting to delete
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, delayBeforeDelete)
      }
    } else {
      // Deleting mode
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deletingSpeed)
      } else {
        // Wait before starting to type again
        timeout = setTimeout(() => {
          setIsDeleting(false)
        }, delayBeforeRetype)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting])

  return (
    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance drop-shadow-lg min-h-24 flex items-center justify-center">
      <span className="inline-block border-r-4 border-white pr-2 pb-2">
        {displayText}
      </span>
    </h1>
  )
}
