/**
 * CommandPalette - Quick actions (Cmd/Ctrl+K)
 * Provides keyboard-driven access to common editor actions
 */

import { useState, useEffect, useRef } from 'react'
import { Search, Plus, FileImage, Maximize2, Download, Grid3x3 } from 'lucide-react'

interface Command {
  id: string
  label: string
  icon: React.ReactNode
  keywords: string[]
  action: () => void
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onAddSection?: () => void
  onAddItem?: () => void
  onReplaceLogo?: () => void
  onFitToWidth?: () => void
  onExportPDF?: () => void
}

export default function CommandPalette({
  isOpen,
  onClose,
  onAddSection,
  onAddItem,
  onReplaceLogo,
  onFitToWidth,
  onExportPDF,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    {
      id: 'add-section',
      label: 'Add Section',
      icon: <Grid3x3 className="w-4 h-4" />,
      keywords: ['add', 'section', 'new', 'create'],
      action: () => {
        onAddSection?.()
        onClose()
      },
    },
    {
      id: 'add-item',
      label: 'Add Menu Item',
      icon: <Plus className="w-4 h-4" />,
      keywords: ['add', 'item', 'menu', 'dish', 'new'],
      action: () => {
        onAddItem?.()
        onClose()
      },
    },
    {
      id: 'replace-logo',
      label: 'Replace Logo',
      icon: <FileImage className="w-4 h-4" />,
      keywords: ['logo', 'image', 'replace', 'upload'],
      action: () => {
        onReplaceLogo?.()
        onClose()
      },
    },
    {
      id: 'fit-to-width',
      label: 'Fit to Width',
      icon: <Maximize2 className="w-4 h-4" />,
      keywords: ['fit', 'zoom', 'width', 'view'],
      action: () => {
        onFitToWidth?.()
        onClose()
      },
    },
    {
      id: 'export-pdf',
      label: 'Export PDF',
      icon: <Download className="w-4 h-4" />,
      keywords: ['export', 'pdf', 'download', 'save'],
      action: () => {
        onExportPDF?.()
        onClose()
      },
    },
  ]

  const filteredCommands = query
    ? commands.filter((cmd) =>
        cmd.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase())) ||
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    : commands

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault()
      filteredCommands[selectedIndex].action()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Palette */}
      <div
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
              className="flex-1 text-base outline-none"
            />
            <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 rounded">
              ESC
            </kbd>
          </div>

          {/* Commands list */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No commands found
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    idx === selectedIndex
                      ? 'bg-slate-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`text-slate-600 ${idx === selectedIndex ? 'text-slate-900' : ''}`}>
                    {cmd.icon}
                  </div>
                  <span className="text-sm font-medium">{cmd.label}</span>
                </button>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 bg-slate-50 border-t text-xs text-slate-500 flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">ESC</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
