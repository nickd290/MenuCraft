export type PaperSize = '11x17' | '8.5x14' | '8.5x11' | '5.5x8.5'
export type ColumnCount = 1 | 2 | 3
export type PageCount = 1 | 2
export type FontSizePreset = 'small' | 'medium' | 'large' | 'x-large'
export type SpacingPreset = 'tight' | 'normal' | 'relaxed'

export interface LayoutSettings {
  paperSize: PaperSize
  columns: ColumnCount
  pageCount: PageCount
  fontSizeOverride?: FontSizePreset
  spacingPreset?: SpacingPreset
  autoFit?: boolean
}

export interface PaperDimensions {
  name: string
  width: number // in inches
  height: number // in inches
  aspectRatio: number
  description: string
}

export const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
  '11x17': {
    name: '11×17"',
    width: 11,
    height: 17,
    aspectRatio: 11 / 17,
    description: 'Tabloid'
  },
  '8.5x14': {
    name: '8.5×14"',
    width: 8.5,
    height: 14,
    aspectRatio: 8.5 / 14,
    description: 'Legal'
  },
  '8.5x11': {
    name: '8.5×11"',
    width: 8.5,
    height: 11,
    aspectRatio: 8.5 / 11,
    description: 'Letter'
  },
  '5.5x8.5': {
    name: '5.5×8.5"',
    width: 5.5,
    height: 8.5,
    aspectRatio: 5.5 / 8.5,
    description: 'Half Letter'
  }
}

// Print margins in inches
export const PRINT_MARGIN = 0.5

// DPI for screen rendering (pixels per inch)
export const SCREEN_DPI = 96

// Scale factor for preview - adjust based on paper size to fit viewport
// Changed from 0.6 to dynamic scaling based on paper size
export const PREVIEW_SCALE = 1.0 // Base scale for 8.5x11

// Get dynamic preview scale based on paper size to fit in viewport
export function getPreviewScale(paperSize: PaperSize): number {
  switch (paperSize) {
    case '5.5x8.5':
      return 1.2 // Smaller paper can be shown larger
    case '8.5x11':
      return 1.0 // baseline
    case '8.5x14':
      return 0.85 // Scale down to fit
    case '11x17':
      return 0.6 // Scale down significantly to fit
    default:
      return 1.0
  }
}

// Calculate scale factors for different paper sizes
export function getScaleFactorForSize(paperSize: PaperSize): number {
  // Use specific scale factors for each paper size as requested
  switch (paperSize) {
    case '5.5x8.5':
      return 0.85 // 15% smaller
    case '8.5x11':
      return 1.0 // baseline
    case '8.5x14':
      return 1.1 // 10% larger
    case '11x17':
      return 1.3 // 30% larger
    default:
      return 1.0
  }
}

// Base font sizes for each paper size (in pixels)
// These ensure menu text is clearly readable without zooming
const BASE_FONT_SIZES: Record<PaperSize, number> = {
  '5.5x8.5': 14,   // Compact menu - still readable
  '8.5x11': 16,    // Standard letter - comfortable reading size
  '8.5x14': 18,    // Legal size - larger for easier reading
  '11x17': 22,     // Tabloid - prominent and clear
}

// Get font scale for different sizes with content awareness
export function getFontScale(
  paperSize: PaperSize,
  contentMetrics?: { itemCount: number; columnCount: number; avgDescLength: number }
): number {
  // Start with base font size for this paper size
  let baseFontSize = BASE_FONT_SIZES[paperSize]

  // If content metrics provided, adjust font size based on density
  if (contentMetrics) {
    const { itemCount, columnCount, avgDescLength } = contentMetrics
    const paper = PAPER_SIZES[paperSize]

    // Calculate content density (items per column per inch of height)
    const usableHeight = paper.height - (PRINT_MARGIN * 2)
    const itemsPerColumn = itemCount / columnCount
    const densityPerInch = itemsPerColumn / usableHeight

    // Scale down if density is high
    if (densityPerInch > 4) {
      // Very dense - reduce by 20%
      baseFontSize *= 0.8
    } else if (densityPerInch > 3) {
      // Dense - reduce by 10%
      baseFontSize *= 0.9
    }

    // Further adjust if descriptions are long
    if (avgDescLength > 100) {
      baseFontSize *= 0.95
    }
  }

  // Convert to scale factor relative to 14px base
  return baseFontSize / 14
}

// Calculate pixel dimensions for preview
export function getPreviewDimensions(paperSize: PaperSize) {
  const paper = PAPER_SIZES[paperSize]
  const scale = getPreviewScale(paperSize)
  return {
    widthPx: paper.width * SCREEN_DPI * scale,
    heightPx: paper.height * SCREEN_DPI * scale,
    marginPx: PRINT_MARGIN * SCREEN_DPI * scale
  }
}

// Paper size recommendations based on content
export interface PaperSizeRecommendation {
  size: PaperSize
  columns: ColumnCount
  fontScale: number
  spacing: SpacingPreset
  lineHeight: number
  recommendation: string
  warning?: string
}

export function getPaperSizeRecommendations(itemCount: number): Record<PaperSize, PaperSizeRecommendation> {
  return {
    '8.5x11': {
      size: '8.5x11',
      columns: itemCount > 30 ? 2 : 1,
      fontScale: 1.0,
      spacing: 'tight',
      lineHeight: 1.3,
      recommendation: 'Good for 15-25 items per page',
      warning: itemCount > 25 ? 'Consider 11×17" or 2 pages for better readability' : undefined
    },
    '11x17': {
      size: '11x17',
      columns: itemCount > 40 ? 3 : 2,
      fontScale: 1.3,
      spacing: 'relaxed',
      lineHeight: 1.5,
      recommendation: 'Comfortable for 40-60 items',
      warning: itemCount < 20 ? 'May look sparse with few items' : undefined
    },
    '8.5x14': {
      size: '8.5x14',
      columns: itemCount > 35 ? 2 : 1,
      fontScale: 1.1,
      spacing: 'normal',
      lineHeight: 1.4,
      recommendation: 'Good middle ground for 25-35 items'
    },
    '5.5x8.5': {
      size: '5.5x8.5',
      columns: 1,
      fontScale: 0.85,
      spacing: 'tight',
      lineHeight: 1.2,
      recommendation: 'Best for 10-15 items maximum',
      warning: itemCount > 15 ? 'Too many items for this size - text will be very small' : undefined
    }
  }
}

// Font size preset multipliers
export const FONT_SIZE_MULTIPLIERS: Record<FontSizePreset, number> = {
  'small': 0.85,
  'medium': 1.0,
  'large': 1.15,
  'x-large': 1.3
}

// Spacing preset line heights
export const SPACING_LINE_HEIGHTS: Record<SpacingPreset, number> = {
  'tight': 1.3,
  'normal': 1.5,
  'relaxed': 1.7
}

// Get font scale with overrides
export function getFontScaleWithOverrides(
  paperSize: PaperSize,
  contentMetrics?: { itemCount: number; columnCount: number; avgDescLength: number },
  fontSizeOverride?: FontSizePreset,
  autoFit?: boolean
): number {
  let baseFontScale = getFontScale(paperSize, contentMetrics)

  // Apply font size override if specified
  if (fontSizeOverride) {
    baseFontScale *= FONT_SIZE_MULTIPLIERS[fontSizeOverride]
  }

  // If auto-fit is enabled, calculate optimal size
  if (autoFit && contentMetrics) {
    const recommendations = getPaperSizeRecommendations(contentMetrics.itemCount)
    const recommendation = recommendations[paperSize]
    baseFontScale = recommendation.fontScale * (contentMetrics.itemCount > 40 ? 0.9 : 1.0)
  }

  return baseFontScale
}

// Calculate total content metrics
export function calculateContentMetrics(sections: Array<{ items: Array<{ name: string; description: string; price: string }> }>) {
  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0)

  let totalChars = 0
  let totalDescLength = 0

  sections.forEach(section => {
    totalChars += section.items.reduce((sum, item) => {
      return sum + item.name.length + (item.description?.length || 0) + item.price.length
    }, 0)

    totalDescLength += section.items.reduce((sum, item) => sum + (item.description?.length || 0), 0)
  })

  const avgDescLength = totalItems > 0 ? totalDescLength / totalItems : 0

  return {
    totalItems,
    totalChars,
    avgDescLength
  }
}

// Estimate if content will fit on page
export function estimateContentFit(
  sections: Array<{ title: string; items: Array<{ name: string; description: string; price: string }> }>,
  paperSize: PaperSize,
  columns: number,
  fontScale: number
): { fits: boolean; estimatedHeight: number; availableHeight: number; overflowPercent: number } {
  const paper = PAPER_SIZES[paperSize]
  const previewScale = getPreviewScale(paperSize)
  const usableHeight = (paper.height - PRINT_MARGIN * 2) * SCREEN_DPI * previewScale

  // Rough estimation: each item takes ~60px base height (scaled by font)
  // Section headers take ~40px each
  const metrics = calculateContentMetrics(sections)
  const baseItemHeight = 60 * fontScale
  const baseSectionHeaderHeight = 40 * fontScale

  const totalSections = sections.length
  const estimatedHeight = (metrics.totalItems * baseItemHeight + totalSections * baseSectionHeaderHeight) / columns

  const fits = estimatedHeight <= usableHeight
  const overflowPercent = ((estimatedHeight - usableHeight) / usableHeight) * 100

  return {
    fits,
    estimatedHeight,
    availableHeight: usableHeight,
    overflowPercent: Math.max(0, overflowPercent)
  }
}