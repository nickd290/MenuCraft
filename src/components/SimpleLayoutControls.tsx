/**
 * SimpleLayoutControls - Manager-friendly preset-based controls
 * Uses named presets instead of granular sliders
 */

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  LayoutSettings,
  PaperSize,
  PAPER_SIZES,
} from '@/types/layout'
import { Grid2x2, Grid3x3, Rows3 } from 'lucide-react'

interface SimpleLayoutControlsProps {
  layout: LayoutSettings
  onLayoutChange: (layout: LayoutSettings) => void
}

// Preset mappings (internally use existing settings)
const SPACING_PRESETS = {
  compact: { spacingPreset: 'tight' as const, fontSizeOverride: 'small' as const },
  standard: { spacingPreset: 'normal' as const, fontSizeOverride: 'medium' as const },
  roomy: { spacingPreset: 'relaxed' as const, fontSizeOverride: 'large' as const },
}

const COLUMN_PRESETS = [
  { value: 1, label: '1 Column', description: 'Classic single-column menu', icon: <Rows3 className="w-5 h-5" /> },
  { value: 2, label: '2 Columns', description: 'Compact two-column layout', icon: <Grid2x2 className="w-5 h-5" /> },
  { value: 3, label: '3 Columns', description: 'High-density three-column', icon: <Grid3x3 className="w-5 h-5" /> },
]

export function SimpleLayoutControls({ layout, onLayoutChange }: SimpleLayoutControlsProps) {
  const currentSpacingPreset =
    Object.entries(SPACING_PRESETS).find(
      ([, preset]) =>
        preset.spacingPreset === layout.spacingPreset &&
        preset.fontSizeOverride === layout.fontSizeOverride
    )?.[0] || 'standard'

  const handleSpacingChange = (presetName: keyof typeof SPACING_PRESETS) => {
    const preset = SPACING_PRESETS[presetName]
    onLayoutChange({
      ...layout,
      ...preset,
    })
  }

  return (
    <div className="space-y-6">
      {/* Paper Size */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Paper Size</Label>
        <div className="grid grid-cols-2 gap-2">
          {(['8.5x11', '8.5x14', '11x17'] as PaperSize[]).map((size) => (
            <button
              key={size}
              onClick={() => onLayoutChange({ ...layout, paperSize: size })}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                layout.paperSize === size
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm">{PAPER_SIZES[size].name}</div>
              <div className="text-xs text-slate-600 mt-1">{PAPER_SIZES[size].description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Layout</Label>
        <div className="space-y-2">
          {COLUMN_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onLayoutChange({ ...layout, columns: preset.value as 1 | 2 | 3 })}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                layout.columns === preset.value
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`${layout.columns === preset.value ? 'text-[#0f7c5a]' : 'text-slate-400'}`}>
                {preset.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{preset.label}</div>
                <div className="text-xs text-slate-600">{preset.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing Presets */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Spacing & Text Size</Label>
        <div className="space-y-2">
          {(Object.keys(SPACING_PRESETS) as Array<keyof typeof SPACING_PRESETS>).map((presetName) => (
            <button
              key={presetName}
              onClick={() => handleSpacingChange(presetName)}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all capitalize ${
                currentSpacingPreset === presetName
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm">{presetName}</div>
              <div className="text-xs text-slate-600 mt-1">
                {presetName === 'compact' && 'Tight spacing, smaller text for high-density menus'}
                {presetName === 'standard' && 'Balanced spacing and text size for most menus'}
                {presetName === 'roomy' && 'Generous spacing and larger text for premium feel'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pages */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Pages</Label>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((pages) => (
            <button
              key={pages}
              onClick={() => onLayoutChange({ ...layout, pageCount: pages as 1 | 2 })}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                layout.pageCount === pages
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10 text-[#0f7c5a]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm">{pages} {pages === 1 ? 'Page' : 'Pages'}</div>
              <div className="text-xs text-slate-600 mt-1">
                {pages === 1 ? 'Single page menu' : 'Front & back layout'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
