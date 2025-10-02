/**
 * SmartGuides - Snap guides and distance markers
 * Shows alignment lines and distance badges during transforms
 */

import { useEffect, useState } from 'react'

export interface GuideInfo {
  type: 'vertical' | 'horizontal'
  position: number
  label?: string
}

export interface DistanceBadge {
  position: { x: number; y: number }
  distance: number
  axis: 'x' | 'y'
}

interface SmartGuidesProps {
  guides: GuideInfo[]
  distances: DistanceBadge[]
  scale?: number
}

export default function SmartGuides({ guides, distances, scale = 1 }: SmartGuidesProps) {
  return (
    <div className="smart-guides-container pointer-events-none absolute inset-0" style={{ zIndex: 999 }}>
      {/* Alignment guides */}
      {guides.map((guide, idx) => (
        <div
          key={`guide-${idx}`}
          className="guide-line"
          style={{
            position: 'absolute',
            background: '#ff00ff',
            boxShadow: '0 0 1px rgba(255, 0, 255, 0.5)',
            ...(guide.type === 'vertical'
              ? {
                  left: guide.position,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  height: '100%',
                }
              : {
                  top: guide.position,
                  left: 0,
                  right: 0,
                  height: '1px',
                  width: '100%',
                }),
          }}
        >
          {guide.label && (
            <div
              className="guide-label"
              style={{
                position: 'absolute',
                background: '#ff00ff',
                color: 'white',
                fontSize: '10px',
                padding: '2px 4px',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                ...(guide.type === 'vertical'
                  ? { top: '4px', left: '4px' }
                  : { left: '4px', top: '4px' }),
              }}
            >
              {guide.label}
            </div>
          )}
        </div>
      ))}

      {/* Distance badges */}
      {distances.map((badge, idx) => (
        <div
          key={`distance-${idx}`}
          className="distance-badge"
          style={{
            position: 'absolute',
            left: badge.position.x,
            top: badge.position.y,
            background: '#3b82f6',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '3px',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {Math.round(badge.distance)}px
        </div>
      ))}
    </div>
  )
}

// Utility functions for guide calculation
export function calculateAlignmentGuides(
  draggedElement: DOMRect,
  otherElements: DOMRect[],
  threshold = 8
): GuideInfo[] {
  const guides: GuideInfo[] = []

  const draggedCenterX = draggedElement.left + draggedElement.width / 2
  const draggedCenterY = draggedElement.top + draggedElement.height / 2

  otherElements.forEach((other) => {
    const otherCenterX = other.left + other.width / 2
    const otherCenterY = other.top + other.height / 2

    // Vertical alignment (left, center, right)
    if (Math.abs(draggedElement.left - other.left) < threshold) {
      guides.push({ type: 'vertical', position: other.left, label: 'Left' })
    }
    if (Math.abs(draggedCenterX - otherCenterX) < threshold) {
      guides.push({ type: 'vertical', position: otherCenterX, label: 'Center' })
    }
    if (Math.abs(draggedElement.right - other.right) < threshold) {
      guides.push({ type: 'vertical', position: other.right, label: 'Right' })
    }

    // Horizontal alignment (top, middle, bottom)
    if (Math.abs(draggedElement.top - other.top) < threshold) {
      guides.push({ type: 'horizontal', position: other.top, label: 'Top' })
    }
    if (Math.abs(draggedCenterY - otherCenterY) < threshold) {
      guides.push({ type: 'horizontal', position: otherCenterY, label: 'Middle' })
    }
    if (Math.abs(draggedElement.bottom - other.bottom) < threshold) {
      guides.push({ type: 'horizontal', position: other.bottom, label: 'Bottom' })
    }
  })

  return guides
}

export function calculateDistanceBadges(
  draggedElement: DOMRect,
  otherElements: DOMRect[],
  threshold = 30
): DistanceBadge[] {
  const badges: DistanceBadge[] = []

  otherElements.forEach((other) => {
    // Horizontal distance (X axis)
    const xGap = Math.min(
      Math.abs(draggedElement.left - other.right),
      Math.abs(draggedElement.right - other.left)
    )

    if (xGap < threshold && xGap > 2) {
      const midY = (Math.max(draggedElement.top, other.top) + Math.min(draggedElement.bottom, other.bottom)) / 2
      badges.push({
        position: {
          x: draggedElement.left < other.left
            ? (draggedElement.right + other.left) / 2
            : (other.right + draggedElement.left) / 2,
          y: midY,
        },
        distance: xGap,
        axis: 'x',
      })
    }

    // Vertical distance (Y axis)
    const yGap = Math.min(
      Math.abs(draggedElement.top - other.bottom),
      Math.abs(draggedElement.bottom - other.top)
    )

    if (yGap < threshold && yGap > 2) {
      const midX = (Math.max(draggedElement.left, other.left) + Math.min(draggedElement.right, other.right)) / 2
      badges.push({
        position: {
          x: midX,
          y: draggedElement.top < other.top
            ? (draggedElement.bottom + other.top) / 2
            : (other.bottom + draggedElement.top) / 2,
        },
        distance: yGap,
        axis: 'y',
      })
    }
  })

  return badges
}