import { useEffect } from 'react'

interface KeyboardShortcutConfig {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
}

export const useKeyboardShortcuts = (config: KeyboardShortcutConfig) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      // Zoom In: Ctrl/Cmd + Plus or Ctrl/Cmd + =
      if (modifier && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        config.onZoomIn?.()
      }

      // Zoom Out: Ctrl/Cmd + Minus
      if (modifier && (e.key === '-' || e.key === '_')) {
        e.preventDefault()
        config.onZoomOut?.()
      }

      // Undo: Ctrl/Cmd + Z
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        config.onUndo?.()
      }

      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      if ((modifier && e.key === 'y') || (modifier && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        config.onRedo?.()
      }

      // Save: Ctrl/Cmd + S
      if (modifier && e.key === 's') {
        e.preventDefault()
        config.onSave?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [config])
}