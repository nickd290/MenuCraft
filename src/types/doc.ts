/**
 * Document element types for on-canvas editing
 * Additive only - no breaking changes to existing data model
 */

export type ElementTransform = {
  x: number
  y: number
  width?: number
  height?: number
  rotate?: number
  zIndex?: number
}

// Text styling roles for theme system
export type TextRole = 'header' | 'subheader' | 'body' | 'price' | 'description'

// Style properties that can be themed or overridden
export type TextStyle = {
  fontFamily?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  textDecoration?: 'none' | 'underline'
  textAlign?: 'left' | 'center' | 'right'
  color?: string
  // Price-specific
  showLeaders?: boolean
  currency?: string
}

export type ElementMeta = {
  id: string
  type: 'text' | 'image' | 'shape' | 'group'
  zIndex: number
  hidden?: boolean
  locked?: boolean
  transform?: ElementTransform  // NEW (optional, non-breaking)
  role?: 'brandMark' | 'decor' | 'content' | 'background'
  textRole?: TextRole  // NEW: for text elements
  styleOverride?: TextStyle  // NEW: per-element overrides (wins over theme)
}