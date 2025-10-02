/**
 * CoachChips - Dismissible first-use tips
 * Shows helpful coaching tips for editor interactions
 */

import { useState, useEffect } from 'react'
import { usePreferences } from '@/hooks/usePreferences'
import { X, Move, Hand, ZoomIn, Type } from 'lucide-react'

interface CoachTip {
  id: string
  icon: React.ReactNode
  message: string
  delay?: number // Show after N milliseconds
}

const TIPS: CoachTip[] = [
  {
    id: 'drag-to-move',
    icon: <Move className="w-4 h-4" />,
    message: 'Drag elements to move them around the page',
    delay: 2000,
  },
  {
    id: 'space-pan',
    icon: <Hand className="w-4 h-4" />,
    message: 'Hold Space + Drag to pan the canvas',
    delay: 5000,
  },
  {
    id: 'zoom-controls',
    icon: <ZoomIn className="w-4 h-4" />,
    message: 'Use Cmd/Ctrl +/− to zoom, or the zoom controls in the topbar',
    delay: 8000,
  },
  {
    id: 'text-styling',
    icon: <Type className="w-4 h-4" />,
    message: "Click text to style it. Use 'All Headers' to update the whole menu",
    delay: 11000,
  },
]

export default function CoachChips() {
  const { isTipDismissed, dismissTip } = usePreferences()
  const [visibleTips, setVisibleTips] = useState<string[]>([])

  useEffect(() => {
    // Show tips with delays
    const timers: NodeJS.Timeout[] = []

    TIPS.forEach((tip) => {
      if (!isTipDismissed(tip.id)) {
        const timer = setTimeout(() => {
          setVisibleTips((prev) => [...prev, tip.id])
        }, tip.delay || 0)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [isTipDismissed])

  const handleDismiss = (tipId: string) => {
    dismissTip(tipId)
    setVisibleTips((prev) => prev.filter((id) => id !== tipId))
  }

  const activeTips = TIPS.filter((tip) => visibleTips.includes(tip.id))

  if (activeTips.length === 0) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {activeTips.map((tip) => (
        <div
          key={tip.id}
          className="pointer-events-auto bg-slate-900 text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="text-blue-400">{tip.icon}</div>
          <p className="text-sm font-medium flex-1">{tip.message}</p>
          <button
            onClick={() => handleDismiss(tip.id)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss tip"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
