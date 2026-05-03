import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

interface BulkActionBarProps {
  isOpen: boolean
  children: React.ReactNode
  onClose?: () => void
}

export function BulkActionBar({
  isOpen,
  children,
  onClose,
}: BulkActionBarProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-wrap justify-center gap-2 rounded-lg border border-border bg-background p-3 shadow-lg"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
