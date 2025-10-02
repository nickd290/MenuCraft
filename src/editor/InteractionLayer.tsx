/**
 * InteractionLayer - Handles on-canvas selection and transforms
 * PR1: Selection only (no movement yet)
 * PR2: Added transform handles and keyboard shortcuts
 * PR4: Added inline text editing
 * PR6: Added MiniHUD with theme system integration
 */

import { useEffect, useRef, useState } from 'react'
import { useDocStore } from '@/state/doc'
import { TextRole } from '@/types/doc'
import TransformHandles from './move/TransformHandles'
import InlineTextEditor, { useInlineTextEdit } from './text/InlineTextEditor'
import SmartGuides, { GuideInfo, DistanceBadge } from './guides/SmartGuides'
import QuickActionsToolbar from './toolbar/QuickActionsToolbar'
import SelectionBounds from './toolbar/SelectionBounds'
import MiniHUD from './toolbar/MiniHUD'
import { InlineContentEditor } from './content/InlineContentEditor'

interface InteractionLayerProps {
  canvasRef: React.RefObject<HTMLDivElement>
  scale?: number
  onTextCommit?: (elementId: string, text: string) => void
  onDuplicate?: () => void
  onDelete?: () => void
}

export default function InteractionLayer({ canvasRef, scale = 1, onTextCommit, onDuplicate, onDelete }: InteractionLayerProps) {
  const setSelected = useDocStore(s => s.setSelected)
  const toggleSelected = useDocStore(s => s.toggleSelected)
  const setHover = useDocStore(s => s.setHover)
  const selectedIds = useDocStore(s => s.selectedIds)
  const hoverId = useDocStore(s => s.hoverId)
  const updateTransform = useDocStore(s => s.updateTransform)
  const getTransform = useDocStore(s => s.getTransform)
  const bringForward = useDocStore(s => s.bringForward)
  const sendBackward = useDocStore(s => s.sendBackward)
  const toggleLock = useDocStore(s => s.toggleLock)
  const isLocked = useDocStore(s => s.isLocked)
  const isHidden = useDocStore(s => s.isHidden)
  const toggleVisibility = useDocStore(s => s.toggleVisibility)
  const updateText = useDocStore(s => s.updateText)
  const containerRef = useRef<HTMLDivElement>(null)

  // Enable double-click text editing
  const { editingId } = useInlineTextEdit()

  // Smart guides state
  const [guides, setGuides] = useState<GuideInfo[]>([])
  const [distances, setDistances] = useState<DistanceBadge[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Toolbar position
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })

  // Handle click selection
  useEffect(() => {
    const root = containerRef.current?.parentElement ?? document.getElementById('menu-canvas')
    if (!root) return

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-el]')

      // Click on empty space - clear selection
      if (!target) {
        setSelected([])
        return
      }

      const id = target.getAttribute('data-el')
      if (!id) return

      // Multi-select with Cmd/Ctrl/Shift
      const additive = e.metaKey || e.ctrlKey || e.shiftKey
      toggleSelected(id, additive)
    }

    const onMove = (e: MouseEvent) => {
      const over = (e.target as HTMLElement)?.closest<HTMLElement>('[data-el]')?.getAttribute('data-el') || undefined
      setHover(over)
    }

    root.addEventListener('click', onClick)
    root.addEventListener('mousemove', onMove)

    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('mousemove', onMove)
    }
  }, [setSelected, toggleSelected, setHover])

  // Apply selection/hover/locked/hidden classes to elements
  useEffect(() => {
    const root = document.getElementById('menu-canvas')
    if (!root) return

    root.querySelectorAll<HTMLElement>('[data-el]').forEach(node => {
      const id = node.getAttribute('data-el')
      if (!id) return

      const hidden = isHidden(id)

      node.classList.toggle('is-selected', selectedIds.includes(id))
      node.classList.toggle('is-hover', hoverId === id && !hidden)
      node.classList.toggle('is-locked', isLocked(id))
      node.classList.toggle('is-hidden', hidden)

      // Hide element from display
      if (hidden) {
        node.style.display = 'none'
      } else {
        node.style.display = ''
      }
    })
  }, [selectedIds, hoverId, isLocked, isHidden])

  // Keyboard shortcuts for selection, nudging, and z-index
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return
      }

      // Escape - clear selection
      if (e.key === 'Escape') {
        setSelected([])
        e.preventDefault()
      }

      // Cmd/Ctrl + A - select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        const all = Array.from(document.querySelectorAll('[data-el]'))
          .map(el => el.getAttribute('data-el'))
          .filter(Boolean) as string[]
        setSelected(all)
        e.preventDefault()
      }

      // Cmd/Ctrl + D - duplicate
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        if (onDuplicate) onDuplicate()
        e.preventDefault()
      }

      // Delete/Backspace - delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0 && onDelete) {
          onDelete()
          e.preventDefault()
        }
      }

      // H - toggle visibility
      if (e.key === 'h' && !e.metaKey && !e.ctrlKey) {
        selectedIds.forEach(id => toggleVisibility(id))
        e.preventDefault()
      }

      // Cmd/Ctrl + L - toggle lock
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        selectedIds.forEach(id => toggleLock(id))
        e.preventDefault()
      }

      // Cmd/Ctrl + [ - send backward
      if ((e.metaKey || e.ctrlKey) && e.key === '[') {
        selectedIds.forEach(id => sendBackward(id))
        e.preventDefault()
      }

      // Cmd/Ctrl + ] - bring forward
      if ((e.metaKey || e.ctrlKey) && e.key === ']') {
        selectedIds.forEach(id => bringForward(id))
        e.preventDefault()
      }

      // Arrow keys - nudge
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const nudgeAmount = e.shiftKey ? 10 : 1

        selectedIds.forEach(id => {
          if (isLocked(id)) return

          const transform = getTransform(id) || { x: 0, y: 0 }
          let dx = 0
          let dy = 0

          if (e.key === 'ArrowLeft') dx = -nudgeAmount
          if (e.key === 'ArrowRight') dx = nudgeAmount
          if (e.key === 'ArrowUp') dy = -nudgeAmount
          if (e.key === 'ArrowDown') dy = nudgeAmount

          updateTransform(id, {
            x: transform.x + dx,
            y: transform.y + dy
          })
          // Visual update handled by React re-render from store
        })

        e.preventDefault()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setSelected, selectedIds, updateTransform, getTransform, bringForward, sendBackward, toggleLock, toggleVisibility, isLocked, onDuplicate, onDelete])

  // NOTE: Removed DOM manipulation - transforms are applied declaratively via inline styles in templates
  // Templates read from store and apply transforms during render
  // This prevents conflicts between React's declarative rendering and imperative DOM updates

  // Update toolbar position when selection changes (smart positioning near edges)
  useEffect(() => {
    if (selectedIds.length > 0 && !editingId && !isDragging) {
      const firstId = selectedIds[0]
      const el = document.querySelector<HTMLElement>(`[data-el="${firstId}"]`)
      if (el) {
        const rect = el.getBoundingClientRect()
        const canvas = canvasRef.current?.getBoundingClientRect()
        if (canvas) {
          const toolbarHeight = 50
          const toolbarWidth = 200 // Approximate width
          const padding = 16

          // Default: center above element
          let x = rect.left + rect.width / 2 - canvas.left
          let y = rect.top - canvas.top - toolbarHeight

          // If too close to top, position below instead
          if (rect.top - canvas.top < toolbarHeight + padding) {
            y = rect.bottom - canvas.top + 8
          }

          // If too close to left edge, shift right
          if (x - toolbarWidth / 2 < padding) {
            x = padding + toolbarWidth / 2
          }

          // If too close to right edge, shift left
          if (x + toolbarWidth / 2 > canvas.width - padding) {
            x = canvas.width - padding - toolbarWidth / 2
          }

          setToolbarPosition({ x, y })
        }
      }
    }
  }, [selectedIds, editingId, isDragging, canvasRef])

  // Handle text commit
  const handleTextCommit = (elementId: string, text: string) => {
    updateText(elementId, text)
    if (onTextCommit) {
      onTextCommit(elementId, text)
    }
  }

  // Get initial text for editing
  const getInitialText = (elementId: string) => {
    const element = document.querySelector<HTMLElement>(`[data-el="${elementId}"]`)
    return element?.textContent?.trim() || ''
  }

  // Extract element metadata for MiniHUD
  const getElementMetadata = (elementId: string) => {
    const element = document.querySelector<HTMLElement>(`[data-el="${elementId}"]`)
    if (!element) return null

    const type = element.getAttribute('data-el-type') as 'text' | 'image' | 'shape' | 'group' | null
    const role = element.getAttribute('data-role') as TextRole | null

    return { type, role }
  }

  // Get element metadata for MiniHUD
  const selectedElement = selectedIds.length > 0 ? getElementMetadata(selectedIds[0]) : null
  const showMiniHUD = selectedIds.length > 0 &&
    !editingId &&
    !isDragging &&
    selectedElement?.type === 'text'

  return (
    <>
      <div
        id="interaction-layer"
        ref={containerRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{ pointerEvents: 'none' }}
      />

      {/* Smart guides (only during drag) */}
      {isDragging && <SmartGuides guides={guides} distances={distances} scale={scale} />}

      {/* Hide transform handles during editing or dragging with guides */}
      {!editingId && <TransformHandles canvasRef={canvasRef} scale={scale} />}

      {/* MiniHUD - DISABLED: All styling controls now in left sidebar */}
      {/* {showMiniHUD && (
        <MiniHUD
          position={toolbarPosition}
          elementId={selectedIds[0]}
          elementRole={selectedElement?.role || undefined}
          elementType={selectedElement?.type || undefined}
        />
      )} */}

      {/* Quick actions toolbar (hide during editing and dragging) */}
      {selectedIds.length > 0 && !editingId && !isDragging && onDuplicate && onDelete && (
        <QuickActionsToolbar
          position={toolbarPosition}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}

      {/* Inline text editor */}
      {editingId && (
        <InlineTextEditor
          elementId={editingId}
          initialText={getInitialText(editingId)}
          onCommit={(text) => handleTextCommit(editingId, text)}
          onCancel={() => {
            // Just stop editing without committing
          }}
        />
      )}

      {/* Selection bounds readout (only for single selection, not during editing/dragging) */}
      {selectedIds.length === 1 && !editingId && !isDragging && (
        <SelectionBounds canvasRef={canvasRef} scale={scale} />
      )}

      {/* Inline content editor - DISABLED: interferes with clicking, use sidebar instead */}
      {/* {!editingId && <InlineContentEditor />} */}
    </>
  )
}