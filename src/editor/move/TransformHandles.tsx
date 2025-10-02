/**
 * TransformHandles - Move/resize/rotate with react-moveable
 * Provides visual handles for transforming selected elements
 */

import { useRef, useEffect } from 'react'
import Moveable from 'react-moveable'
import { useDocStore } from '@/state/doc'

interface TransformHandlesProps {
  canvasRef: React.RefObject<HTMLDivElement>
  scale?: number
}

export default function TransformHandles({ canvasRef, scale = 1 }: TransformHandlesProps) {
  const selectedIds = useDocStore((s) => s.selectedIds)
  const updateTransform = useDocStore((s) => s.updateTransform)
  const getTransform = useDocStore((s) => s.getTransform)
  const isLocked = useDocStore((s) => s.isLocked)

  const moveableRef = useRef<any>(null)

  // Get selected element refs
  const targets = selectedIds
    .filter(id => !isLocked(id))
    .map(id => document.querySelector<HTMLElement>(`[data-el="${id}"]`))
    .filter(Boolean) as HTMLElement[]

  // Update moveable when selection changes
  useEffect(() => {
    if (moveableRef.current) {
      moveableRef.current.updateRect()
    }
  }, [selectedIds])

  if (targets.length === 0) return null

  // Get page bounds for constraints
  const getPageBounds = () => {
    const page = canvasRef.current?.querySelector('.doc-frame')
    if (!page) return null

    const rect = page.getBoundingClientRect()
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    }
  }

  const snap = (value: number, threshold = 8) => {
    const pageBounds = getPageBounds()
    if (!pageBounds) return value

    // Snap to page edges
    const snapPoints = [
      0,
      pageBounds.width / 2,
      pageBounds.width
    ]

    for (const point of snapPoints) {
      if (Math.abs(value - point) < threshold) {
        return point
      }
    }

    return value
  }

  return (
    <Moveable
      ref={moveableRef}
      target={targets}
      draggable={true}
      resizable={true}
      rotatable={true}
      keepRatio={false}
      snappable={true}
      snapThreshold={8}
      origin={false}
      padding={{ left: 0, top: 0, right: 0, bottom: 0 }}

      // Drag
      onDragStart={(e) => {
        e.set([0, 0])
      }}
      onDrag={(e) => {
        const target = e.target as HTMLElement
        const id = target.getAttribute('data-el')
        if (!id) return

        const transform = getTransform(id) || { x: 0, y: 0 }
        const newX = snap(transform.x + e.delta[0] / scale)
        const newY = transform.y + e.delta[1] / scale

        updateTransform(id, { x: newX, y: newY })
        // DOM manipulation during drag for immediate feedback - React will sync on next render
        target.style.transform = `translate(${newX}px, ${newY}px) rotate(${transform.rotate ?? 0}deg)`
      }}
      onDragEnd={() => {
        // Force React to re-render with store values after drag completes
        if (moveableRef.current) {
          moveableRef.current.updateRect()
        }
      }}

      // Resize
      onResizeStart={(e) => {
        e.setOrigin(['%', '%'])
      }}
      onResize={(e) => {
        const target = e.target as HTMLElement
        const id = target.getAttribute('data-el')
        if (!id) return

        const transform = getTransform(id) || { x: 0, y: 0 }

        updateTransform(id, {
          width: e.width,
          height: e.height,
          x: transform.x + e.delta[0] / scale,
          y: transform.y + e.delta[1] / scale
        })

        // DOM manipulation during resize for immediate feedback
        target.style.width = `${e.width}px`
        target.style.height = `${e.height}px`
        target.style.transform = `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotate ?? 0}deg)`
      }}
      onResizeEnd={() => {
        // Force React to re-render with store values
        if (moveableRef.current) {
          moveableRef.current.updateRect()
        }
      }}

      // Rotate
      onRotateStart={(e) => {
        e.set(0)
      }}
      onRotate={(e) => {
        const target = e.target as HTMLElement
        const id = target.getAttribute('data-el')
        if (!id) return

        const transform = getTransform(id) || { x: 0, y: 0 }
        const rotate = e.rotation

        updateTransform(id, { rotate })
        // DOM manipulation during rotate for immediate feedback
        target.style.transform = `translate(${transform.x}px, ${transform.y}px) rotate(${rotate}deg)`
      }}
      onRotateEnd={() => {
        // Force React to re-render with store values
        if (moveableRef.current) {
          moveableRef.current.updateRect()
        }
      }}
    />
  )
}