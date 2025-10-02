/**
 * InlineContentEditor - Overlay buttons for adding sections/items on the canvas
 * Shows "+" buttons when hovering over sections to add items inline
 */

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useDocStore } from '@/state/doc'

export function InlineContentEditor() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const addSection = useDocStore((s) => s.addSection)
  const addMenuItem = useDocStore((s) => s.addMenuItem)
  const menuData = useDocStore((s) => s.menuData)

  // Track hover state for sections
  useEffect(() => {
    const canvas = document.getElementById('menu-canvas')
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-el]')

      if (!target) {
        setHoveredSection(null)
        return
      }

      const elId = target.getAttribute('data-el')
      const elType = target.getAttribute('data-el-type')

      // Check if hovering over a section
      if (elType === 'group' && elId?.startsWith('section-')) {
        const sectionIdx = parseInt(elId.replace('section-', ''))
        setHoveredSection(sectionIdx)
      } else {
        setHoveredSection(null)
      }
    }

    const handleMouseLeave = () => {
      setHoveredSection(null)
      setShowAddSection(false)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Show "Add Section" button when hovering near bottom of menu
  useEffect(() => {
    const canvas = document.getElementById('menu-canvas')
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const y = e.clientY - rect.top
      const height = rect.height

      // Show add section button in bottom 20% of canvas
      setShowAddSection(y > height * 0.8)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    return () => canvas.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!menuData) return null

  return (
    <>
      {/* Add Item buttons for each hovered section */}
      {hoveredSection !== null && (
        <AddItemButton
          sectionIdx={hoveredSection}
          onAdd={() => addMenuItem(hoveredSection)}
        />
      )}

      {/* Add Section button at bottom */}
      {showAddSection && (
        <AddSectionButton onAdd={addSection} />
      )}
    </>
  )
}

interface AddItemButtonProps {
  sectionIdx: number
  onAdd: () => void
}

function AddItemButton({ sectionIdx, onAdd }: AddItemButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const sectionEl = document.querySelector<HTMLElement>(`[data-el="section-${sectionIdx}"]`)
    if (!sectionEl) return

    const rect = sectionEl.getBoundingClientRect()
    const canvas = document.getElementById('menu-canvas')?.getBoundingClientRect()

    if (canvas) {
      // Position at bottom-right of section
      setPosition({
        x: rect.right - canvas.left - 100,
        y: rect.bottom - canvas.top - 40
      })
    }
  }, [sectionIdx])

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onAdd()
      }}
      className="absolute z-50 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Plus className="w-3 h-3" />
      <span>Add Item</span>
    </button>
  )
}

interface AddSectionButtonProps {
  onAdd: () => void
}

function AddSectionButton({ onAdd }: AddSectionButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = document.getElementById('menu-canvas')
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    // Position at center-bottom of canvas
    setPosition({
      x: rect.width / 2 - 60,
      y: rect.height - 60
    })
  }, [])

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onAdd()
      }}
      className="absolute z-50 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-full shadow-lg transition-all"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Plus className="w-4 h-4" />
      <span>Add Section</span>
    </button>
  )
}
