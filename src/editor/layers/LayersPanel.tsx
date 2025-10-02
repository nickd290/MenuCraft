/**
 * LayersPanel - Layer management with dnd-kit
 * Drag-and-drop reordering, visibility, and lock controls
 */

import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDocStore } from '@/state/doc'
import { Eye, EyeOff, Lock, Unlock, GripVertical, Type, Image, Square } from 'lucide-react'

interface LayerItem {
  id: string
  type: 'text' | 'image' | 'shape' | 'group'
  label: string
  zIndex: number
}

interface SortableLayerProps {
  layer: LayerItem
  isSelected: boolean
  isHidden: boolean
  isLocked: boolean
  onSelect: (id: string, additive: boolean) => void
  onToggleVisibility: (id: string) => void
  onToggleLock: (id: string) => void
}

function SortableLayer({
  layer,
  isSelected,
  isHidden,
  isLocked,
  onSelect,
  onToggleVisibility,
  onToggleLock,
}: SortableLayerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getIcon = () => {
    switch (layer.type) {
      case 'text':
        return <Type className="w-4 h-4 text-slate-600" />
      case 'image':
        return <Image className="w-4 h-4 text-slate-600" />
      case 'shape':
        return <Square className="w-4 h-4 text-slate-600" />
      case 'group':
        return <Square className="w-4 h-4 text-slate-600" />
      default:
        return <Square className="w-4 h-4 text-slate-600" />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md border transition-colors ${
        isSelected
          ? 'bg-blue-50 border-blue-300'
          : 'bg-white border-slate-200 hover:bg-slate-50'
      } ${isHidden ? 'opacity-50' : ''}`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-slate-200 rounded"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Layer Icon */}
      <div className="flex-shrink-0">{getIcon()}</div>

      {/* Layer Label */}
      <button
        onClick={(e) => onSelect(layer.id, e.metaKey || e.ctrlKey || e.shiftKey)}
        className="flex-1 text-left text-xs font-medium text-slate-700 truncate"
      >
        {layer.label}
      </button>

      {/* Visibility Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleVisibility(layer.id)
        }}
        className="p-0.5 hover:bg-slate-200 rounded"
        aria-label={isHidden ? 'Show' : 'Hide'}
      >
        {isHidden ? (
          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Eye className="w-3.5 h-3.5 text-slate-600" />
        )}
      </button>

      {/* Lock Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleLock(layer.id)
        }}
        className="p-0.5 hover:bg-slate-200 rounded"
        aria-label={isLocked ? 'Unlock' : 'Lock'}
      >
        {isLocked ? (
          <Lock className="w-3.5 h-3.5 text-slate-600" />
        ) : (
          <Unlock className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>
    </div>
  )
}

export default function LayersPanel() {
  const selectedIds = useDocStore((s) => s.selectedIds)
  const toggleSelected = useDocStore((s) => s.toggleSelected)
  const isHidden = useDocStore((s) => s.isHidden)
  const isLocked = useDocStore((s) => s.isLocked)
  const toggleVisibility = useDocStore((s) => s.toggleVisibility)
  const toggleLock = useDocStore((s) => s.toggleLock)
  const getTransform = useDocStore((s) => s.getTransform)
  const updateZIndex = useDocStore((s) => s.updateZIndex)

  const [layers, setLayers] = useState<LayerItem[]>([])

  // Extract layers from DOM
  useEffect(() => {
    const extractLayers = () => {
      const elements = document.querySelectorAll<HTMLElement>('[data-el]')
      const layerItems: LayerItem[] = []

      elements.forEach((el) => {
        const id = el.getAttribute('data-el')
        const type = (el.getAttribute('data-el-type') as LayerItem['type']) || 'text'

        if (!id) return

        // Get label from element content
        let label = id
        if (type === 'text') {
          const textContent = el.textContent?.trim() || ''
          label = textContent.substring(0, 30) + (textContent.length > 30 ? '...' : '')
        }

        const transform = getTransform(id)
        const zIndex = transform?.zIndex ?? 0

        layerItems.push({
          id,
          type,
          label: label || id,
          zIndex,
        })
      })

      // Sort by zIndex (highest first)
      layerItems.sort((a, b) => b.zIndex - a.zIndex)
      setLayers(layerItems)
    }

    extractLayers()

    // Re-extract when DOM changes
    const observer = new MutationObserver(extractLayers)
    const canvas = document.getElementById('menu-canvas')
    if (canvas) {
      observer.observe(canvas, { childList: true, subtree: true })
    }

    return () => observer.disconnect()
  }, [getTransform])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setLayers((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)

      // Update z-index based on new order (reverse order: top layer = highest index)
      newItems.forEach((item, idx) => {
        const newZIndex = newItems.length - idx - 1
        updateZIndex(item.id, newZIndex)
      })

      return newItems
    })
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm mb-3">Layers</h3>

      {layers.length === 0 ? (
        <p className="text-xs text-slate-500">No elements on canvas</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={layers.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {layers.map((layer) => (
                <SortableLayer
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedIds.includes(layer.id)}
                  isHidden={isHidden(layer.id)}
                  isLocked={isLocked(layer.id)}
                  onSelect={toggleSelected}
                  onToggleVisibility={toggleVisibility}
                  onToggleLock={toggleLock}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}