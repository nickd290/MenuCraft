import { Columns, FileText, Layout, Maximize2 } from 'lucide-react'
import { LayoutSettings, PaperSize, ColumnCount, PageCount, PAPER_SIZES } from '@/types/layout'

interface LayoutControlsProps {
  settings: LayoutSettings
  onSettingsChange: (settings: LayoutSettings) => void
}

export const LayoutControls = ({ settings, onSettingsChange }: LayoutControlsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Layout className="w-5 h-5" />
        Layout Settings
      </h2>

      {/* Paper Size Selector */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Maximize2 className="w-4 h-4" />
          Paper Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PAPER_SIZES) as PaperSize[]).map((size) => (
            <button
              key={size}
              onClick={() => onSettingsChange({ ...settings, paperSize: size })}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                settings.paperSize === size
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold">{PAPER_SIZES[size].name}</div>
              <div className="text-xs opacity-75">{PAPER_SIZES[size].description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Column Layout */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Columns className="w-4 h-4" />
          Column Layout
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              onClick={() => onSettingsChange({ ...settings, columns: cols as ColumnCount })}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.columns === cols
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              title={`${cols} Column${cols > 1 ? 's' : ''}`}
            >
              <div className="flex gap-1 justify-center mb-2">
                {Array.from({ length: cols }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 rounded ${
                      settings.columns === cols ? 'bg-white' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs font-medium">{cols} Col</div>
            </button>
          ))}
        </div>
      </div>

      {/* Page Count */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <FileText className="w-4 h-4" />
          Pages
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((pages) => (
            <button
              key={pages}
              onClick={() => onSettingsChange({ ...settings, pageCount: pages as PageCount })}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                settings.pageCount === pages
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {pages === 1 ? 'Single Page' : 'Two Pages'}
              <div className="text-xs opacity-75 mt-1">
                {pages === 1 ? 'One-sided' : 'Front & Back'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}