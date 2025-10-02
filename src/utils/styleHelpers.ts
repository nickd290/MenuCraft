/**
 * Style helpers for applying styleOverrides and roleStyles during render
 */

import { TextStyle, ElementTransform } from '@/types/doc'
import { CSSProperties } from 'react'

/**
 * Converts TextStyle to React CSSProperties
 */
export function textStyleToCSS(style: Partial<TextStyle>): CSSProperties {
  const css: CSSProperties = {}

  if (style.fontSize !== undefined) css.fontSize = `${style.fontSize}px`
  if (style.fontWeight !== undefined) css.fontWeight = style.fontWeight
  if (style.color !== undefined) css.color = style.color
  if (style.textAlign !== undefined) css.textAlign = style.textAlign
  if (style.fontStyle !== undefined) css.fontStyle = style.fontStyle
  if (style.textDecoration !== undefined) css.textDecoration = style.textDecoration

  return css
}

/**
 * Converts ElementTransform to React CSSProperties
 */
export function transformToCSS(transform?: ElementTransform): CSSProperties {
  if (!transform) return {}

  const css: CSSProperties = {}

  // Build transform string
  const transforms: string[] = []
  if (transform.x !== undefined || transform.y !== undefined) {
    transforms.push(`translate(${transform.x ?? 0}px, ${transform.y ?? 0}px)`)
  }
  if (transform.rotate !== undefined && transform.rotate !== 0) {
    transforms.push(`rotate(${transform.rotate}deg)`)
  }

  if (transforms.length > 0) {
    css.transform = transforms.join(' ')
  }

  if (transform.width !== undefined) css.width = `${transform.width}px`
  if (transform.height !== undefined) css.height = `${transform.height}px`
  if (transform.zIndex !== undefined) css.zIndex = transform.zIndex

  return css
}

/**
 * Merges base styles with overrides
 */
export function mergeStyles(
  baseStyle: CSSProperties,
  override?: Partial<TextStyle>
): CSSProperties {
  if (!override) return baseStyle

  const overrideCSS = textStyleToCSS(override)
  return { ...baseStyle, ...overrideCSS }
}
