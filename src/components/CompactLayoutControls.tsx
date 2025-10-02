import { LayoutSettings, PaperSize, PAPER_SIZES } from '@/types/layout'
import { ChevronDown } from 'lucide-react'

interface CompactLayoutControlsProps {
  settings: LayoutSettings
  onSettingsChange: (settings: LayoutSettings) => void
  isOpen: boolean
  onToggle: () => void
}

export const CompactLayoutControls = ({ settings, onSettingsChange, isOpen, onToggle }: CompactLayoutControlsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Layout Settings</span>
          <span className="text-xs text-slate-500">
            {PAPER_SIZES[settings.paperSize].name} • {settings.columns} col • {settings.pageCount}pg
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t">
          {/* Paper Size Dropdown */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-700">Paper Size</label>
            <select
              value={settings.paperSize}
              onChange={(e) => onSettingsChange({ ...settings, paperSize: e.target.value as PaperSize })}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {(Object.keys(PAPER_SIZES) as PaperSize[]).map((size) => (
                <option key={size} value={size}>
                  {PAPER_SIZES[size].name} - {PAPER_SIZES[size].description}
                </option>
              ))}
            </select>
          </div>

          {/* Columns - Compact segmented control */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-700">Columns</label>
            <div className="inline-flex rounded-lg border overflow-hidden">
              {[1, 2, 3].map((cols) => (
                <button
                  key={cols}
                  onClick={() => onSettingsChange({ ...settings, columns: cols as 1 | 2 | 3 })}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    settings.columns === cols
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cols}
                </button>
              ))}
            </div>
          </div>

          {/* Pages - Compact segmented control */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-700">Pages</label>
            <div className="inline-flex rounded-lg border overflow-hidden">
              {[1, 2].map((pages) => (
                <button
                  key={pages}
                  onClick={() => onSettingsChange({ ...settings, pageCount: pages as 1 | 2 })}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    settings.pageCount === pages
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pages === 1 ? 'Single' : 'Double'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}