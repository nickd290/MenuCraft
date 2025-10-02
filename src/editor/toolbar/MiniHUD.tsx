/**
 * MiniHUD - Context-aware floating toolbar with scope control
 * PR6: Full integration with theme system and style overrides
 */

import { useState, useRef, useEffect } from 'react'
import { useDocStore } from '@/state/doc'
import { TextRole, TextStyle } from '@/types/doc'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  DollarSign,
  RotateCcw,
  ChevronDown,
  ImageIcon,
  Square,
} from 'lucide-react'

interface MiniHUDProps {
  position: { x: number; y: number }
  elementId?: string
  elementRole?: TextRole
  elementType?: 'text' | 'image' | 'shape'
  onLogoReplace?: () => void
  onLogoFitChange?: (mode: 'cover' | 'contain') => void
  onLogoRoundCorners?: (enabled: boolean) => void
}

export default function MiniHUD({
  position,
  elementId,
  elementRole,
  elementType,
  onLogoReplace,
  onLogoFitChange,
  onLogoRoundCorners,
}: MiniHUDProps) {
  const selectedIds = useDocStore((s) => s.selectedIds)
  const updateStyleOverride = useDocStore((s) => s.updateStyleOverride)
  const updateRoleStyle = useDocStore((s) => s.updateRoleStyle)
  const clearStyleOverride = useDocStore((s) => s.clearStyleOverride)
  const getComputedStyle = useDocStore((s) => s.getComputedStyle)
  const hasStyleOverride = useDocStore((s) => s.hasStyleOverride)

  const [scope, setScope] = useState<'item' | 'role'>('item')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Get current computed style
  const currentStyle = elementId ? getComputedStyle(elementId, elementRole) : {}
  const hasOverride = elementId ? hasStyleOverride(elementId) : false

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (selectedIds.length === 0 || !elementId) return null

  // Hide HUD for non-styleable elements
  if (elementType !== 'text' && elementType !== 'image') return null

  const applyStyle = (style: Partial<TextStyle>) => {
    if (scope === 'item') {
      // Apply to selected item(s)
      selectedIds.forEach(id => updateStyleOverride(id, style))
    } else if (scope === 'role' && elementRole) {
      // Apply to all elements with this role
      updateRoleStyle(elementRole, style)
    }
  }

  const handleFontSize = (delta: number) => {
    const currentSize = currentStyle.fontSize || 14
    applyStyle({ fontSize: Math.max(8, Math.min(72, currentSize + delta)) })
  }

  const handleToggleStyle = (property: keyof TextStyle, value: any, currentValue: any) => {
    applyStyle({ [property]: currentValue === value ? undefined : value })
  }

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    applyStyle({ textAlign: alignment })
  }

  const handleColorChange = (color: string) => {
    applyStyle({ color })
    setShowColorPicker(false)
  }

  const handleResetToTheme = () => {
    selectedIds.forEach(id => clearStyleOverride(id))
  }

  const handleToggleLeaders = () => {
    applyStyle({ showLeaders: !currentStyle.showLeaders })
  }

  const handleCurrencyChange = (currency: string) => {
    applyStyle({ currency })
    setShowCurrencyPicker(false)
  }

  // Scope label based on element role
  const getScopeLabel = () => {
    if (scope === 'item') return selectedIds.length > 1 ? `These ${selectedIds.length} Items` : 'This Item'
    if (!elementRole) return 'All'
    const roleLabels: Record<TextRole, string> = {
      header: 'All Headers',
      subheader: 'All Subheaders',
      body: 'All Body Text',
      price: 'All Prices',
      description: 'All Descriptions',
    }
    return roleLabels[elementRole]
  }

  // Logo-specific HUD
  if (elementType === 'image' && elementId === 'logo') {
    return (
      <div
        className="mini-hud"
        role="toolbar"
        aria-label="Logo controls"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y - 60,
          transform: 'translateX(-50%)',
          zIndex: 1002,
        }}
      >
        <button onClick={onLogoReplace} className="hud-btn" title="Replace logo">
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs ml-1">Replace</span>
        </button>

        <div className="hud-divider" />

        <button onClick={() => onLogoFitChange?.('contain')} className="hud-btn" title="Fit mode: Contain">
          <span className="text-xs">Fit</span>
        </button>
        <button onClick={() => onLogoFitChange?.('cover')} className="hud-btn" title="Fit mode: Cover">
          <span className="text-xs">Fill</span>
        </button>

        <div className="hud-divider" />

        <button onClick={() => onLogoRoundCorners?.(true)} className="hud-btn" title="Round corners">
          <Square className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Theme color swatches
  const themeColors = ['#1a1a1a', '#333333', '#666666', '#999999', '#d4af37', '#0f7c5a', '#8b4513']
  const currencies = ['$', '€', '£', '¥', '₹']

  return (
    <div
      className="mini-hud"
      role="toolbar"
      aria-label="Text formatting"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y - 70,
        transform: 'translateX(-50%)',
        zIndex: 1002,
      }}
    >
      {/* Scope Selector */}
      <div className="relative">
        <button
          onClick={() => setScope(scope === 'item' ? 'role' : 'item')}
          className="hud-btn"
          style={{ padding: '6px 10px' }}
          title="Switch scope"
        >
          <span className="text-xs font-medium">{getScopeLabel()}</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
      </div>

      <div className="hud-divider" />

      {/* Font Style */}
      <button
        onClick={() => handleToggleStyle('fontWeight', 'bold', currentStyle.fontWeight)}
        className={`hud-btn ${currentStyle.fontWeight === 'bold' ? 'bg-slate-100' : ''}`}
        title="Bold (⌘B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToggleStyle('fontStyle', 'italic', currentStyle.fontStyle)}
        className={`hud-btn ${currentStyle.fontStyle === 'italic' ? 'bg-slate-100' : ''}`}
        title="Italic (⌘I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToggleStyle('textDecoration', 'underline', currentStyle.textDecoration)}
        className={`hud-btn ${currentStyle.textDecoration === 'underline' ? 'bg-slate-100' : ''}`}
        title="Underline (⌘U)"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="hud-divider" />

      {/* Font Size */}
      <button onClick={() => handleFontSize(-2)} className="hud-btn" title="Decrease size">
        <Type className="w-3 h-3" />
        <span className="text-xs">−</span>
      </button>
      <span className="text-xs font-medium px-2 text-slate-600">{currentStyle.fontSize || 14}</span>
      <button onClick={() => handleFontSize(2)} className="hud-btn" title="Increase size">
        <Type className="w-4 h-4" />
        <span className="text-xs">+</span>
      </button>

      <div className="hud-divider" />

      {/* Alignment */}
      <button
        onClick={() => handleAlign('left')}
        className={`hud-btn ${currentStyle.textAlign === 'left' ? 'bg-slate-100' : ''}`}
        title="Align left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAlign('center')}
        className={`hud-btn ${currentStyle.textAlign === 'center' ? 'bg-slate-100' : ''}`}
        title="Align center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAlign('right')}
        className={`hud-btn ${currentStyle.textAlign === 'right' ? 'bg-slate-100' : ''}`}
        title="Align right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="hud-divider" />

      {/* Color Picker */}
      <div className="relative" ref={colorPickerRef}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="hud-btn"
          title="Text color"
        >
          <Palette className="w-4 h-4" />
          <div
            className="w-3 h-3 rounded-full ml-1 border border-slate-300"
            style={{ backgroundColor: currentStyle.color || '#1a1a1a' }}
          />
        </button>

        {showColorPicker && (
          <div
            className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border-2 border-slate-200 p-3 z-[1003]"
            style={{ minWidth: '200px' }}
          >
            <div className="text-xs font-medium mb-2 text-slate-600">Theme Colors</div>
            <div className="grid grid-cols-7 gap-2 mb-3">
              {themeColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="w-6 h-6 rounded-full border-2 border-slate-200 hover:border-slate-400 transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="text-xs font-medium mb-2 text-slate-600">Custom</div>
            <input
              type="color"
              value={currentStyle.color || '#1a1a1a'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-8 rounded border border-slate-300 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Price-specific controls */}
      {elementRole === 'price' && (
        <>
          <div className="hud-divider" />

          {/* Currency Picker */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
              className="hud-btn"
              title="Currency symbol"
            >
              <DollarSign className="w-4 h-4" />
              <span className="text-xs ml-1">{currentStyle.currency || '$'}</span>
            </button>

            {showCurrencyPicker && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border-2 border-slate-200 p-2 z-[1003]">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => handleCurrencyChange(curr)}
                    className="block w-full px-3 py-2 text-left hover:bg-slate-100 rounded text-sm"
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Leaders Toggle */}
          <button
            onClick={handleToggleLeaders}
            className={`hud-btn ${currentStyle.showLeaders ? 'bg-slate-100' : ''}`}
            title="Toggle price leaders"
          >
            <span className="text-xs font-mono">.......</span>
          </button>
        </>
      )}

      {/* Reset to Theme */}
      {hasOverride && scope === 'item' && (
        <>
          <div className="hud-divider" />
          <button onClick={handleResetToTheme} className="hud-btn" title="Reset to theme defaults">
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs ml-1">Reset</span>
          </button>
        </>
      )}
    </div>
  )
}
