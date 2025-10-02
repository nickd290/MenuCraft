/**
 * Hook to get computed styles for an element
 * Returns merged styles: theme roleStyles + styleOverrides
 */

import { useDocStore } from '@/state/doc'
import { TextRole } from '@/types/doc'
import { CSSProperties } from 'react'

export function useElementStyle(elementId: string, role?: TextRole): CSSProperties {
  const getComputedStyle = useDocStore((s) => s.getComputedStyle)

  const style = getComputedStyle(elementId, role)

  // Convert to React CSSProperties
  const cssProps: CSSProperties = {}

  if (style.fontSize !== undefined) cssProps.fontSize = `${style.fontSize}px`
  if (style.fontWeight !== undefined) cssProps.fontWeight = style.fontWeight
  if (style.color !== undefined) cssProps.color = style.color
  if (style.textAlign !== undefined) cssProps.textAlign = style.textAlign
  if (style.fontStyle !== undefined) cssProps.fontStyle = style.fontStyle
  if (style.textDecoration !== undefined) cssProps.textDecoration = style.textDecoration

  return cssProps
}
