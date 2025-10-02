import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  LayoutSettings,
  PaperSize,
  FontSizePreset,
  SpacingPreset,
  PAPER_SIZES,
  getPaperSizeRecommendations,
  calculateContentMetrics,
  estimateContentFit,
  FONT_SIZE_MULTIPLIERS,
  getFontScaleWithOverrides
} from '@/types/layout'
import { Lightbulb, AlertCircle, CheckCircle2, Maximize2 } from 'lucide-react'

interface SmartLayoutControlsProps {
  layout: LayoutSettings
  onLayoutChange: (layout: LayoutSettings) => void
  menuSections: Array<{ items: Array<{ name: string; description: string; price: string }> }>
}

export const SmartLayoutControls = ({ layout, onLayoutChange, menuSections }: SmartLayoutControlsProps) => {
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [suggestedColumns, setSuggestedColumns] = useState<number | null>(null)

  const contentMetrics = calculateContentMetrics(menuSections)
  const recommendations = getPaperSizeRecommendations(contentMetrics.totalItems)
  const currentRecommendation = recommendations[layout.paperSize]

  // Calculate actual font scale being used
  const actualFontScale = getFontScaleWithOverrides(
    layout.paperSize,
    {
      itemCount: contentMetrics.totalItems,
      columnCount: layout.columns,
      avgDescLength: contentMetrics.avgDescLength
    },
    layout.fontSizeOverride,
    layout.autoFit
  )

  // Check if content fits
  const contentFit = estimateContentFit(menuSections, layout.paperSize, layout.columns, actualFontScale)

  // Check if layout should show suggestions when paper size changes
  useEffect(() => {
    const rec = recommendations[layout.paperSize]
    if (rec.columns !== layout.columns) {
      setSuggestion(
        `💡 Switching to ${PAPER_SIZES[layout.paperSize].name}? We recommend ${rec.columns} column${rec.columns > 1 ? 's' : ''} and ${rec.spacing} spacing for better readability.`
      )
      setSuggestedColumns(rec.columns)
      setShowSuggestion(true)
    } else {
      setShowSuggestion(false)
    }
  }, [layout.paperSize])

  const applySuggestions = () => {
    if (suggestedColumns) {
      onLayoutChange({
        ...layout,
        columns: suggestedColumns as 1 | 2 | 3,
        spacingPreset: currentRecommendation.spacing
      })
    }
    setShowSuggestion(false)
  }

  const dismissSuggestion = () => {
    setShowSuggestion(false)
  }

  const fitsOnOnePage = contentFit.fits

  return (
    <div className="space-y-4">
      {/* Suggestion notification */}
      {showSuggestion && suggestion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900">{suggestion}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={applySuggestions}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Suggestions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={dismissSuggestion}
                  >
                    Keep Current Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paper Size Selection */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Paper Size</Label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PAPER_SIZES) as PaperSize[]).map((size) => {
            const rec = recommendations[size]
            return (
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
                <div className="text-xs text-slate-500 mt-1">{rec.recommendation}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Warning if content doesn't fit well */}
      {currentRecommendation.warning && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">{currentRecommendation.warning}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Fit Indicator */}
      <Card className={fitsOnOnePage ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {fitsOnOnePage ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${fitsOnOnePage ? 'text-green-900' : 'text-red-900'}`}>
                  {fitsOnOnePage ? 'Content fits perfectly! ✓' : '⚠️ Content overflow detected'}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {contentMetrics.totalItems} items
              </div>
            </div>
            {!fitsOnOnePage && (
              <div className="text-xs text-red-700">
                Content is {Math.round(contentFit.overflowPercent)}% too large. Try:
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Reduce font size to "Small"</li>
                  <li>Add a 2nd page</li>
                  <li>Switch to 11×17" paper</li>
                  <li>Increase to {layout.columns < 3 ? layout.columns + 1 : 3} columns</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Columns */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Columns</Label>
        <div className="flex gap-2">
          {[1, 2, 3].map((col) => (
            <button
              key={col}
              onClick={() => onLayoutChange({ ...layout, columns: col as 1 | 2 | 3 })}
              className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                layout.columns === col
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10 text-[#0f7c5a]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Override */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Font Size</Label>
        <div className="grid grid-cols-4 gap-2">
          {(['small', 'medium', 'large', 'x-large'] as FontSizePreset[]).map((size) => (
            <button
              key={size}
              onClick={() => onLayoutChange({ ...layout, fontSizeOverride: size })}
              className={`py-2 px-2 rounded-lg border-2 text-xs font-medium transition-all capitalize ${
                layout.fontSizeOverride === size
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10 text-[#0f7c5a]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {size === 'x-large' ? 'X-Large' : size}
              <div className="text-[10px] text-slate-500 mt-0.5">
                {Math.round(FONT_SIZE_MULTIPLIERS[size] * 100)}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Spacing</Label>
        <div className="grid grid-cols-3 gap-2">
          {(['tight', 'normal', 'relaxed'] as SpacingPreset[]).map((spacing) => (
            <button
              key={spacing}
              onClick={() => onLayoutChange({ ...layout, spacingPreset: spacing })}
              className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                layout.spacingPreset === spacing
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10 text-[#0f7c5a]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {spacing}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-fit toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-slate-600" />
          <div>
            <Label className="text-sm font-medium">Auto-fit Content</Label>
            <p className="text-xs text-slate-500">Automatically adjust font size to fit all content</p>
          </div>
        </div>
        <Switch
          checked={layout.autoFit || false}
          onCheckedChange={(checked) => onLayoutChange({ ...layout, autoFit: checked })}
        />
      </div>

      {/* Pages */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Pages</Label>
        <div className="flex gap-2">
          {[1, 2].map((pages) => (
            <button
              key={pages}
              onClick={() => onLayoutChange({ ...layout, pageCount: pages as 1 | 2 })}
              className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                layout.pageCount === pages
                  ? 'border-[#0f7c5a] bg-[#0f7c5a]/10 text-[#0f7c5a]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {pages} {pages === 1 ? 'Page' : 'Pages'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}