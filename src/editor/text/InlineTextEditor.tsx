/**
 * InlineTextEditor - Double-click to edit text inline
 * WYSIWYG text editing with contentEditable
 */

import { useEffect, useRef, useState } from 'react'
import { useDocStore } from '@/state/doc'

interface InlineTextEditorProps {
  elementId: string
  initialText: string
  onCommit: (text: string) => void
  onCancel: () => void
}

export default function InlineTextEditor({
  elementId,
  initialText,
  onCommit,
  onCancel,
}: InlineTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState(initialText)
  const stopEditing = useDocStore((s) => s.stopEditing)

  // Focus and select all text on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()

      // Select all text
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter (no shift) = commit
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        const currentText = editorRef.current?.textContent || ''
        onCommit(currentText)
        stopEditing()
      }

      // Escape = cancel
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        stopEditing()
      }

      // Rich text formatting shortcuts
      if (e.metaKey || e.ctrlKey) {
        // Bold: Cmd/Ctrl + B
        if (e.key === 'b') {
          e.preventDefault()
          document.execCommand('bold')
        }

        // Italic: Cmd/Ctrl + I
        if (e.key === 'i') {
          e.preventDefault()
          document.execCommand('italic')
        }

        // Underline: Cmd/Ctrl + U
        if (e.key === 'u') {
          e.preventDefault()
          document.execCommand('underline')
        }

        // Link: Cmd/Ctrl + K (optional for now - just prevent default)
        if (e.key === 'k') {
          e.preventDefault()
          // TODO: Implement link insertion
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCommit, onCancel, stopEditing])

  // Handle blur (clicking outside)
  const handleBlur = (e: React.FocusEvent) => {
    // Small delay to allow other interactions to complete
    setTimeout(() => {
      const currentText = editorRef.current?.textContent || ''
      onCommit(currentText)
      stopEditing()
    }, 100)
  }

  // Get computed styles from the original element
  const element = document.querySelector<HTMLElement>(`[data-el="${elementId}"]`)
  const computedStyles = element ? window.getComputedStyle(element) : null

  const editorStyles: React.CSSProperties = {
    position: 'absolute',
    top: element?.offsetTop || 0,
    left: element?.offsetLeft || 0,
    width: element?.offsetWidth || 'auto',
    minHeight: element?.offsetHeight || 'auto',
    fontFamily: computedStyles?.fontFamily || 'inherit',
    fontSize: computedStyles?.fontSize || 'inherit',
    fontWeight: computedStyles?.fontWeight || 'inherit',
    lineHeight: computedStyles?.lineHeight || 'inherit',
    color: computedStyles?.color || 'inherit',
    textAlign: (computedStyles?.textAlign as any) || 'left',
    padding: computedStyles?.padding || '0',
    margin: '0',
    border: '2px solid #3b82f6',
    borderRadius: '4px',
    outline: 'none',
    background: 'white',
    cursor: 'text',
    zIndex: 1000,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      style={editorStyles}
      onBlur={handleBlur}
      onInput={(e) => setText(e.currentTarget.textContent || '')}
    >
      {initialText}
    </div>
  )
}

// Hook to enable double-click editing
export function useInlineTextEdit() {
  const startEditing = useDocStore((s) => s.startEditing)
  const editingId = useDocStore((s) => s.editingId)
  const isLocked = useDocStore((s) => s.isLocked)
  const isHidden = useDocStore((s) => s.isHidden)

  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-el]')
      if (!target) return

      const id = target.getAttribute('data-el')
      const type = target.getAttribute('data-el-type')

      if (!id || type !== 'text') return
      if (isLocked(id) || isHidden(id)) return

      e.preventDefault()
      e.stopPropagation()
      startEditing(id)
    }

    const canvas = document.getElementById('menu-canvas')
    if (canvas) {
      canvas.addEventListener('dblclick', handleDoubleClick)
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('dblclick', handleDoubleClick)
      }
    }
  }, [startEditing, isLocked, isHidden])

  return { editingId }
}