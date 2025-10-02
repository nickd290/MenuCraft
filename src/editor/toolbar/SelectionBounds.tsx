/**
 * SelectionBounds - Shows W×H dimensions for selected element
 * Appears near selection for quick reference
 */

import { useEffect, useState } from 'react'
import { useDocStore } from '@/state/doc'

interface SelectionBoundsProps {
  canvasRef: React.RefObject<HTMLDivElement>
  scale?: number
}

export default function SelectionBounds({ canvasRef, scale = 1 }: SelectionBoundsProps) {
  const selectedIds = useDocStore((s) => s.selectedIds)
  const [bounds, setBounds] = useState<{ width: number; height: number; x: number; y: number } | null>(null)

  useEffect(() => {
    if (selectedIds.length !== 1) {
      setBounds(null)
      return
    }

    const id = selectedIds[0]
    const el = document.querySelector<HTMLElement>(`[data-el="${id}"]`)
    const canvas = canvasRef.current

    if (!el || !canvas) {
      setBounds(null)
      return
    }

    const rect = el.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    // Calculate actual dimensions (accounting for scale)
    const width = Math.round(rect.width / scale)
    const height = Math.round(rect.height / scale)

    // Position the badge at bottom-right of selection
    const x = rect.right - canvasRect.left
    const y = rect.bottom - canvasRect.top

    setBounds({ width, height, x, y })
  }, [selectedIds, canvasRef, scale])

  if (!bounds) return null

  return (
    <div
      className="selection-bounds"
      style={{
        position: 'absolute',
        left: bounds.x,
        top: bounds.y + 4,
        background: '#0f172a',
        color: 'white',
        fontSize: '11px',
        padding: '3px 6px',
        borderRadius: '4px',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 1000,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        animation: 'fadeIn 0.1s ease-out',
      }}
      role="status"
      aria-live="polite"
      aria-label={`Selection size: ${bounds.width} by ${bounds.height} pixels`}
    >
      {bounds.width} × {bounds.height}
    </div>
  )
}
