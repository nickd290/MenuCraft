/**
 * SimpleStylePanel - Sidebar-integrated style controls for Simple mode
 * Shows essential text styling controls in a clean, manager-friendly UI
 */

import { useState, useEffect, useCallback } from 'react'
import { useDocStore } from '@/state/doc'
import { TextRole, TextStyle } from '@/types/doc'
import { Type, Palette, X, Italic, Underline, Bold } from 'lucide-react'

interface SimpleStylePanelProps {
  selectedElementId?: string
  selectedRole?: TextRole
  onClose?: () => void
  embedded?: boolean // Whether this is embedded in the sidebar or floating
}

export default function SimpleStylePanel({
  selectedElementId,
  selectedRole,
  onClose,
  embedded = false,
}: SimpleStylePanelProps) {
  const updateStyleOverride = useDocStore((s) => s.updateStyleOverride)
  const updateRoleStyle = useDocStore((s) => s.updateRoleStyle)
  const getComputedStyle = useDocStore((s) => s.getComputedStyle)
  const selectedIds = useDocStore((s) => s.selectedIds)
  const styleOverrides = useDocStore((s) => s.styleOverrides)
  const roleStyles = useDocStore((s) => s.roleStyles)

  const [scope, setScope] = useState<'item' | 'all'>('item')
  const [showColorPicker, setShowColorPicker] = useState(false)

  if (!selectedElementId || !selectedRole) return null

  // Re-compute style whenever overrides or roleStyles change
  const currentStyle = getComputedStyle(selectedElementId, selectedRole)

  // Apply style changes directly to state (no preview/staging)
  // Memoized to prevent multiple calls on re-render
  const applyStyleChanges = useCallback((updates: Partial<TextStyle>) => {
    if (scope === 'item') {
      // Always update the selected element, even if selectedIds is empty
      if (selectedElementId) {
        updateStyleOverride(selectedElementId, updates)
      }
      // Also update any other selected elements
      selectedIds.filter(id => id !== selectedElementId).forEach(id => {
        updateStyleOverride(id, updates)
      })
    } else {
      updateRoleStyle(selectedRole, updates)
    }
  }, [scope, selectedElementId, selectedIds, selectedRole, updateStyleOverride, updateRoleStyle])

  const handleFontSize = (delta: number) => {
    const currentSize = currentStyle.fontSize || 14
    applyStyleChanges({ fontSize: Math.max(8, Math.min(72, currentSize + delta)) })
  }

  const roleLabels: Record<TextRole, string> = {
    header: 'Headers',
    subheader: 'Subheaders',
    body: 'Body Text',
    price: 'Prices',
    description: 'Descriptions',
  }

  const themeColors = [
    { name: 'Black', value: '#1a1a1a' },
    { name: 'Gray', value: '#666666' },
    { name: 'Gold', value: '#d4af37' },
    { name: 'Green', value: '#0f7c5a' },
    { name: 'Brown', value: '#8b4513' },
  ]

  const containerClass = embedded
    ? "space-y-4"
    : "fixed left-8 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border-2 border-slate-200 p-4 z-40 w-64"

  const containerStyle = embedded ? {} : { maxHeight: 'calc(100vh - 8rem)' }

  return (
    <div className={containerClass} style={containerStyle}>
      {/* Header - Only show for floating version */}
      {!embedded && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b">
          <h3 className="font-bold text-sm text-slate-900">Text Style</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Scope Selector */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 block mb-2">Apply to</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setScope('item')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              scope === 'item'
                ? 'bg-[#0f7c5a] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            This Item
          </button>
          <button
            onClick={() => setScope('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              scope === 'all'
                ? 'bg-[#0f7c5a] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All {roleLabels[selectedRole]}
          </button>
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 block mb-2">Font Size</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontSize(-2)}
            className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Type className="w-3 h-3 mx-auto" />
            <span className="text-xs block mt-1">Smaller</span>
          </button>
          <div className="px-3 py-2 bg-slate-50 rounded-lg text-center min-w-[60px]">
            <span className="text-lg font-bold text-slate-900">{currentStyle.fontSize || 14}</span>
            <span className="text-xs text-slate-600 block">px</span>
          </div>
          <button
            onClick={() => handleFontSize(2)}
            className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Type className="w-4 h-4 mx-auto" />
            <span className="text-xs block mt-1">Larger</span>
          </button>
        </div>
      </div>

      {/* Font Family */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 block mb-2">Font Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyStyleChanges({ fontFamily: 'Georgia, serif' })}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              (currentStyle.fontFamily || '').includes('serif')
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Serif
          </button>
          <button
            onClick={() => applyStyleChanges({ fontFamily: 'Arial, sans-serif' })}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              (currentStyle.fontFamily || '').includes('sans-serif')
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Sans
          </button>
        </div>
      </div>

      {/* Font Style Controls (Bold, Italic, Underline) */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 block mb-2">Text Style</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => applyStyleChanges({
              fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold'
            })}
            className={`px-3 py-2 rounded-lg transition-all flex items-center justify-center ${
              currentStyle.fontWeight === 'bold'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyStyleChanges({
              fontStyle: currentStyle.fontStyle === 'italic' ? 'normal' : 'italic'
            })}
            className={`px-3 py-2 rounded-lg transition-all flex items-center justify-center ${
              currentStyle.fontStyle === 'italic'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyStyleChanges({
              textDecoration: currentStyle.textDecoration === 'underline' ? 'none' : 'underline'
            })}
            className={`px-3 py-2 rounded-lg transition-all flex items-center justify-center ${
              currentStyle.textDecoration === 'underline'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Color */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 block mb-2">Color</label>
        <div className="space-y-2">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => applyStyleChanges({ color: color.value })}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all ${
                currentStyle.color === color.value ? 'bg-slate-50 ring-2 ring-[#0f7c5a]' : ''
              }`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-slate-200"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-sm flex-1 text-left">{color.name}</span>
              {currentStyle.color === color.value && (
                <div className="w-2 h-2 rounded-full bg-[#0f7c5a]" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color */}
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-full mt-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Palette className="w-3 h-3" />
          Custom Color
        </button>

        {showColorPicker && (
          <div className="mt-2">
            <input
              type="color"
              value={currentStyle.color || '#1a1a1a'}
              onChange={(e) => {
                applyStyleChanges({ color: e.target.value })
                setShowColorPicker(false)
              }}
              className="w-full h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Alignment (only for certain roles) */}
      {(selectedRole === 'header' || selectedRole === 'subheader' || selectedRole === 'body') && (
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-2">Alignment</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => applyStyleChanges({ textAlign: 'left' })}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                currentStyle.textAlign === 'left'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Left
            </button>
            <button
              onClick={() => applyStyleChanges({ textAlign: 'center' })}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                currentStyle.textAlign === 'center'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Center
            </button>
            <button
              onClick={() => applyStyleChanges({ textAlign: 'right' })}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                currentStyle.textAlign === 'right'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Right
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
