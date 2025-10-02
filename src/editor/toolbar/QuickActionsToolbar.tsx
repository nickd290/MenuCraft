/**
 * QuickActionsToolbar - Floating toolbar for selected elements
 * Shows Duplicate, Delete, Lock/Unlock, Hide/Show actions
 */

import { Copy, Trash2, Lock, Unlock, Eye, EyeOff } from 'lucide-react'
import { useDocStore } from '@/state/doc'

interface QuickActionsToolbarProps {
  position: { x: number; y: number }
  onDuplicate: () => void
  onDelete: () => void
}

export default function QuickActionsToolbar({
  position,
  onDuplicate,
  onDelete,
}: QuickActionsToolbarProps) {
  const selectedIds = useDocStore((s) => s.selectedIds)
  const isLocked = useDocStore((s) => s.isLocked)
  const isHidden = useDocStore((s) => s.isHidden)
  const toggleLock = useDocStore((s) => s.toggleLock)
  const toggleVisibility = useDocStore((s) => s.toggleVisibility)

  if (selectedIds.length === 0) return null

  // Check states for first selected element
  const firstId = selectedIds[0]
  const locked = isLocked(firstId)
  const hidden = isHidden(firstId)

  return (
    <div
      className="quick-actions-toolbar"
      role="toolbar"
      aria-label="Element actions"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y - 50, // Position above selection
        transform: 'translateX(-50%)',
        zIndex: 1001,
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        padding: '4px',
        display: 'flex',
        gap: '2px',
        pointerEvents: 'auto',
      }}
    >
      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        className="toolbar-btn"
        title="Duplicate (⌘D)"
        aria-label="Duplicate selected element"
        style={{
          padding: '6px 8px',
          background: 'transparent',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: '#475569',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <Copy className="w-4 h-4" />
      </button>

      {/* Lock/Unlock */}
      <button
        onClick={() => selectedIds.forEach((id) => toggleLock(id))}
        className="toolbar-btn"
        title={locked ? 'Unlock (⌘L)' : 'Lock (⌘L)'}
        aria-label={locked ? 'Unlock selected element' : 'Lock selected element'}
        aria-pressed={locked}
        style={{
          padding: '6px 8px',
          background: locked ? '#f1f5f9' : 'transparent',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: locked ? '#0f172a' : '#475569',
        }}
        onMouseEnter={(e) => {
          if (!locked) e.currentTarget.style.background = '#f1f5f9'
        }}
        onMouseLeave={(e) => {
          if (!locked) e.currentTarget.style.background = 'transparent'
        }}
      >
        {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
      </button>

      {/* Hide/Show */}
      <button
        onClick={() => selectedIds.forEach((id) => toggleVisibility(id))}
        className="toolbar-btn"
        title={hidden ? 'Show (H)' : 'Hide (H)'}
        aria-label={hidden ? 'Show selected element' : 'Hide selected element'}
        aria-pressed={hidden}
        style={{
          padding: '6px 8px',
          background: hidden ? '#f1f5f9' : 'transparent',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: hidden ? '#0f172a' : '#475569',
        }}
        onMouseEnter={(e) => {
          if (!hidden) e.currentTarget.style.background = '#f1f5f9'
        }}
        onMouseLeave={(e) => {
          if (!hidden) e.currentTarget.style.background = 'transparent'
        }}
      >
        {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>

      {/* Divider */}
      <div style={{ width: '1px', background: '#e2e8f0', margin: '4px 2px' }} />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="toolbar-btn"
        title="Delete (⌫)"
        aria-label="Delete selected element"
        style={{
          padding: '6px 8px',
          background: 'transparent',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: '#dc2626',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
