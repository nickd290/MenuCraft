/**
 * usePreferences - Persist UI preferences to localStorage
 * Saves zoom, snap, sidebar state, etc.
 */

import { useState, useEffect } from 'react'

export interface EditorPreferences {
  zoom: number
  fitToWidth: boolean
  snapEnabled: boolean
  sidebarOpen: boolean
  lastTool?: string
  rulerUnits: 'px' | 'in' | 'mm'
  gridOpacity: number
  editorMode: 'simple' | 'pro'
  dismissedTips: string[]
}

const DEFAULT_PREFS: EditorPreferences = {
  zoom: 1,
  fitToWidth: true,
  snapEnabled: true,
  sidebarOpen: true,
  rulerUnits: 'px',
  gridOpacity: 15,
  editorMode: 'simple',
  dismissedTips: [],
}

const PREFS_KEY = 'menucraft.editor.prefs'

export function usePreferences() {
  const [prefs, setPrefs] = useState<EditorPreferences>(() => {
    // Hydrate from localStorage before first paint
    if (typeof window === 'undefined') return DEFAULT_PREFS

    try {
      const stored = localStorage.getItem(PREFS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_PREFS, ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error)
    }

    return DEFAULT_PREFS
  })

  // Save to localStorage whenever prefs change
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    } catch (error) {
      console.warn('Failed to save preferences:', error)
    }
  }, [prefs])

  const updatePref = <K extends keyof EditorPreferences>(
    key: K,
    value: EditorPreferences[K]
  ) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const resetPrefs = () => {
    setPrefs(DEFAULT_PREFS)
    localStorage.removeItem(PREFS_KEY)
  }

  const dismissTip = (tipId: string) => {
    setPrefs((prev) => ({
      ...prev,
      dismissedTips: [...prev.dismissedTips, tipId]
    }))
  }

  const isTipDismissed = (tipId: string) => {
    return prefs.dismissedTips.includes(tipId)
  }

  return {
    prefs,
    updatePref,
    resetPrefs,
    dismissTip,
    isTipDismissed,
  }
}

// Hook for snap state specifically (used in multiple places)
export function useSnapEnabled() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('menucraft.snap.enabled')
      return stored !== null ? stored === 'true' : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    localStorage.setItem('menucraft.snap.enabled', String(enabled))
  }, [enabled])

  return [enabled, setEnabled] as const
}
