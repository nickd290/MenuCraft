import { useState } from 'react'
import { MenuTemplate } from '@/data/templates'
import { LayoutSettings, PAPER_SIZES, getPreviewDimensions, getFontScaleWithOverrides, SPACING_LINE_HEIGHTS, SCREEN_DPI, getPreviewScale, estimateContentFit } from '@/types/layout'
import { TemplatePreview } from './TemplatePreview'
import { Ruler, AlertTriangle, Plus } from 'lucide-react'
import { useDocStore } from '@/state/doc'

interface DesignAnalysis {
  colors: {
    pageBackground: string
    sectionHeaderBackground: string
    sectionHeaderText: string
    bodyText: string
    priceText: string
    dividerColor: string
  }
  sectionHeaderStyle: {
    hasColoredBackground: boolean
    isFullWidth: boolean
    alignment: 'left' | 'center'
  }
  layout: {
    columns: number
    hasDividers: boolean
    sectionSpacing: 'tight' | 'normal' | 'loose'
  }
  fonts: {
    headerFont: 'serif' | 'sans-serif'
    bodyFont: 'serif' | 'sans-serif'
  }
}

interface MenuPreviewWithLayoutProps {
  template: MenuTemplate
  layout: LayoutSettings
  currentPage?: number
  customDesign?: DesignAnalysis | null
  logoUrl?: string | null
  logoFitMode?: 'cover' | 'contain'
  onLogoUpload?: () => void
}

export const MenuPreviewWithLayout = ({
  template,
  layout,
  currentPage = 1,
  customDesign,
  logoUrl,
  logoFitMode = 'contain',
  onLogoUpload
}: MenuPreviewWithLayoutProps) => {
  const [showPrintGuides, setShowPrintGuides] = useState(true)

  // Get styleOverrides, roleStyles, and transforms from the doc store
  const styleOverrides = useDocStore(s => s.styleOverrides)
  const roleStyles = useDocStore(s => s.roleStyles)
  const transforms = useDocStore(s => s.transforms)

  const paperSize = PAPER_SIZES[layout.paperSize]
  const dimensions = getPreviewDimensions(layout.paperSize)
  const previewScale = getPreviewScale(layout.paperSize)

  // Calculate content metrics for intelligent font scaling
  const totalItems = template.sections.reduce((sum, section) => sum + section.items.length, 0)
  const avgDescLength = template.sections.reduce((sum, section) => {
    const totalDescLength = section.items.reduce((itemSum, item) => itemSum + (item.description?.length || 0), 0)
    return sum + totalDescLength
  }, 0) / Math.max(totalItems, 1)

  const contentMetrics = {
    itemCount: totalItems,
    columnCount: layout.columns,
    avgDescLength
  }

  const fontScale = getFontScaleWithOverrides(
    layout.paperSize,
    contentMetrics,
    layout.fontSizeOverride,
    layout.autoFit
  )

  // Calculate absolute font size in pixels (not em!)
  // fontScale is a ratio like 1.14 (16px / 14px baseline)
  // We want absolute pixels to ensure readability
  const baseFontSizePx = 14 // baseline
  const actualFontSizePx = baseFontSizePx * fontScale

  // Get line height from spacing preset
  const lineHeight = layout.spacingPreset ? SPACING_LINE_HEIGHTS[layout.spacingPreset] : 1.5

  // Check if content fits
  const contentFit = estimateContentFit(template.sections, layout.paperSize, layout.columns, fontScale)
  const showOverflowWarning = !contentFit.fits && fontScale < 0.75

  // Bleed area (0.125" outside trim) - use dynamic preview scale
  const bleedInches = 0.125
  const bleedPx = bleedInches * SCREEN_DPI * previewScale

  // Safety margin (0.25" inside trim) - use dynamic preview scale
  const safetyMarginInches = 0.25
  const safetyMarginPx = safetyMarginInches * SCREEN_DPI * previewScale

  // Crop mark dimensions - use dynamic preview scale
  const cropMarkLength = 0.125 * SCREEN_DPI * previewScale // 0.125" marks
  const cropMarkDistance = 0.125 * SCREEN_DPI * previewScale // 0.125" outside bleed

  // Split sections across pages if 2-page layout
  const sectionsPerPage = Math.ceil(template.sections.length / layout.pageCount)
  const startIdx = (currentPage - 1) * sectionsPerPage
  const endIdx = startIdx + sectionsPerPage
  const pageSections = template.sections.slice(startIdx, endIdx)

  // Calculate gutter width for column spacing - minimal gap
  const gutterWidth = layout.columns > 1 ? 8 : 0

  // Ruler tick marks
  const renderRulerTicks = (length: number, isHorizontal: boolean) => {
    const ticks = []
    const inchesTotal = length / (SCREEN_DPI * previewScale)

    for (let i = 0; i <= Math.ceil(inchesTotal); i++) {
      const position = i * SCREEN_DPI * previewScale
      if (position <= length) {
        ticks.push(
          <div key={i}>
            {isHorizontal ? (
              <>
                <div
                  className="absolute bg-slate-700"
                  style={{
                    left: `${position}px`,
                    top: '0',
                    width: '1px',
                    height: i % 1 === 0 ? '12px' : '6px'
                  }}
                />
                {i % 1 === 0 && (
                  <span
                    className="absolute text-[10px] text-slate-600"
                    style={{
                      left: `${position + 2}px`,
                      top: '0'
                    }}
                  >
                    {i}″
                  </span>
                )}
              </>
            ) : (
              <>
                <div
                  className="absolute bg-slate-700"
                  style={{
                    top: `${position}px`,
                    left: '0',
                    height: '1px',
                    width: i % 1 === 0 ? '12px' : '6px'
                  }}
                />
                {i % 1 === 0 && (
                  <span
                    className="absolute text-[10px] text-slate-600"
                    style={{
                      top: `${position - 10}px`,
                      left: '14px'
                    }}
                  >
                    {i}″
                  </span>
                )}
              </>
            )}
          </div>
        )
      }
    }
    return ticks
  }

  return (
    <div className="bg-slate-200 p-8 rounded-lg flex gap-4">
      {/* Left sidebar with document info */}
      <div className="flex-shrink-0 space-y-4">
        {/* Document Info Card */}
        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border shadow-sm text-xs space-y-1 w-48">
          <div className="font-semibold text-slate-900 mb-2">Document Info</div>
          <div className="text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{paperSize.width}″ × {paperSize.height}″</span>
            </div>
            <div className="flex justify-between">
              <span>DPI:</span>
              <span className="font-medium">300 / 96</span>
            </div>
            <div className="flex justify-between">
              <span>Bleed:</span>
              <span className="font-medium">0.125″</span>
            </div>
            <div className="flex justify-between">
              <span>Margins:</span>
              <span className="font-medium">0.5″</span>
            </div>
            <div className="flex justify-between">
              <span>Columns:</span>
              <span className="font-medium">{layout.columns}</span>
            </div>
          </div>
        </div>

        {/* Print Guides Toggle */}
        <button
          onClick={() => setShowPrintGuides(!showPrintGuides)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            showPrintGuides
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border hover:bg-slate-50'
          }`}
        >
          <Ruler className="w-3 h-3" />
          Print Guides
        </button>
      </div>

      {/* Main canvas area */}
      <div className="flex-1">
        {/* Header with paper size info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1 rounded-full border">
              {paperSize.name} {paperSize.description} • {layout.columns} Column{layout.columns > 1 ? 's' : ''}
            </span>
          </div>

          {/* Overflow Warning */}
          {showOverflowWarning && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">
                  ⚠️ Content Overflow Detected
                </p>
                <p className="text-xs text-red-800 leading-relaxed">
                  Your content is {Math.round(contentFit.overflowPercent)}% too large and fonts are becoming unreadable (below 75% size).
                  Consider: reducing content, using 2 pages, switching to larger paper (11×17"), or adding more columns.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ruler container */}
      <div className="relative" style={{ paddingTop: '24px', paddingLeft: '32px' }}>
        {/* Top ruler */}
        {showPrintGuides && (
          <div
            className="absolute bg-slate-50 border-b border-slate-300"
            style={{
              top: '0',
              left: '32px',
              width: `${dimensions.widthPx + bleedPx * 2}px`,
              height: '24px'
            }}
          >
            {renderRulerTicks(dimensions.widthPx + bleedPx * 2, true)}
          </div>
        )}

        {/* Left ruler */}
        {showPrintGuides && (
          <div
            className="absolute bg-slate-50 border-r border-slate-300"
            style={{
              top: '24px',
              left: '0',
              width: '32px',
              height: `${dimensions.heightPx + bleedPx * 2}px`
            }}
          >
            {renderRulerTicks(dimensions.heightPx + bleedPx * 2, false)}
          </div>
        )}

        {/* Paper + bleed area container - renders 1 or 2 pages side by side */}
        <div
          className="relative mx-auto flex gap-8"
          style={{
            width: layout.pageCount === 2
              ? `${(dimensions.widthPx + bleedPx * 2) * 2 + 32}px`
              : `${dimensions.widthPx + bleedPx * 2}px`,
            height: `${dimensions.heightPx + bleedPx * 2}px`
          }}
        >
          {/* Bleed area guide */}
          {showPrintGuides && (
            <div
              className="absolute border-2 border-dashed border-red-300 pointer-events-none z-30"
              style={{
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
              }}
            />
          )}

          {/* Crop marks */}
          {showPrintGuides && (
            <>
              {/* Top-left crop marks */}
              <div className="absolute pointer-events-none z-40" style={{ top: `-${cropMarkDistance}px`, left: `-${cropMarkDistance}px` }}>
                <div className="w-px h-3 bg-black" style={{ marginLeft: `${cropMarkDistance}px` }} />
                <div className="h-px w-3 bg-black" style={{ marginTop: `${cropMarkDistance - 1}px` }} />
              </div>

              {/* Top-right crop marks */}
              <div className="absolute pointer-events-none z-40" style={{ top: `-${cropMarkDistance}px`, right: `-${cropMarkDistance}px` }}>
                <div className="w-px h-3 bg-black ml-auto" style={{ marginRight: `${cropMarkDistance}px` }} />
                <div className="h-px w-3 bg-black ml-auto" style={{ marginTop: `${cropMarkDistance - 1}px`, marginRight: '0' }} />
              </div>

              {/* Bottom-left crop marks */}
              <div className="absolute pointer-events-none z-40" style={{ bottom: `-${cropMarkDistance}px`, left: `-${cropMarkDistance}px` }}>
                <div className="h-px w-3 bg-black" style={{ marginBottom: `${cropMarkDistance}px` }} />
                <div className="w-px h-3 bg-black" style={{ marginLeft: `${cropMarkDistance}px`, marginTop: '-12px' }} />
              </div>

              {/* Bottom-right crop marks */}
              <div className="absolute pointer-events-none z-40" style={{ bottom: `-${cropMarkDistance}px`, right: `-${cropMarkDistance}px` }}>
                <div className="h-px w-3 bg-black ml-auto" style={{ marginBottom: `${cropMarkDistance}px` }} />
                <div className="w-px h-3 bg-black ml-auto" style={{ marginRight: `${cropMarkDistance}px`, marginTop: '-12px' }} />
              </div>
            </>
          )}

          {/* Paper container with shadow - FIXED SIZE, NO OVERFLOW */}
          <div
            className="bg-white absolute shadow-2xl overflow-hidden"
            style={{
              top: `${bleedPx}px`,
              left: `${bleedPx}px`,
              width: `${dimensions.widthPx}px`,
              height: `${dimensions.heightPx}px`
            }}
          >
            {/* Colorful borders for Grandezza Brunch */}
            {template.id === 20 && (
              <div className="absolute inset-0 pointer-events-none z-0">
                {/* Top border */}
                <div className="absolute top-0 left-0 right-0 h-8" style={{
                  background: 'linear-gradient(to right, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
                  opacity: 0.7
                }} />
                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-8" style={{
                  background: 'linear-gradient(to left, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
                  opacity: 0.7
                }} />
                {/* Left border */}
                <div className="absolute top-0 bottom-0 left-0 w-8" style={{
                  background: 'linear-gradient(to bottom, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
                  opacity: 0.7
                }} />
                {/* Right border */}
                <div className="absolute top-0 bottom-0 right-0 w-8" style={{
                  background: 'linear-gradient(to top, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
                  opacity: 0.7
                }} />
              </div>
            )}

            {/* Print margin guides */}
            {showPrintGuides && (
              <div
                className="absolute border border-dashed border-blue-300 pointer-events-none z-20"
                style={{
                  top: `${dimensions.marginPx}px`,
                  left: `${dimensions.marginPx}px`,
                  right: `${dimensions.marginPx}px`,
                  bottom: `${dimensions.marginPx}px`
                }}
              />
            )}

            {/* Content area - 0.25" safety margin */}
            <div
              className="absolute flex flex-col"
              style={{
                top: `${safetyMarginPx}px`,
                left: `${safetyMarginPx}px`,
                width: `${dimensions.widthPx - safetyMarginPx * 2}px`,
                height: `${dimensions.heightPx - safetyMarginPx * 2}px`,
                fontSize: `${actualFontSizePx}px`, // Use absolute pixels, not em!
                lineHeight: lineHeight,
                overflow: 'visible'
              }}
            >
              {/* Header container - spans full width above columns */}
              {logoUrl && (
                <div className="w-full mb-6 flex justify-center flex-shrink-0">
                  <button
                    onClick={onLogoUpload}
                    className="relative overflow-hidden hover:opacity-80 transition-all"
                    data-el="logo"
                    data-el-type="image"
                  >
                    <img
                      src={logoUrl}
                      alt="Restaurant Logo"
                      className="max-w-[200px] max-h-[120px] object-contain"
                      style={{ objectFit: logoFitMode }}
                    />
                  </button>
                </div>
              )}

              {/* Menu content area */}
              <div className="w-full flex-1">
                <TemplatePreview
                  template={{ ...template, sections: pageSections }}
                  customDesign={customDesign}
                  styleOverrides={styleOverrides}
                  roleStyles={roleStyles}
                  transforms={transforms}
                  columnCount={layout.columns}
                />
              </div>
            </div>

            {/* Page indicator badge */}
            {layout.pageCount === 2 && (
              <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-3 py-1 rounded-full text-xs font-medium z-30">
                Page {currentPage} of 2
              </div>
            )}

            {/* Corner fold effect */}
            <div
              className="absolute top-0 right-0 w-8 h-8 bg-slate-100 border-l border-b border-slate-300 z-30"
              style={{
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
              }}
            />
          </div>
        </div>
      </div>
      {/* End of Ruler container */}

        {/* Print info */}
        <div className="text-center mt-4 text-xs text-slate-500">
          Print-ready • {paperSize.width}″ × {paperSize.height}″ • 0.5″ margins • 0.125″ bleed
        </div>
      </div>
      {/* End of Main canvas area */}
    </div>
  )
}