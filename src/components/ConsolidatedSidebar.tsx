import { useState, useEffect } from 'react'
import * as React from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react'
import { useDocStore } from '@/state/doc'
import { LayoutSettings } from '@/types/layout'
import { MenuSection } from '@/data/templates'
import { SimpleLayoutControls } from './SimpleLayoutControls'
import { SmartLayoutControls } from './SmartLayoutControls'
import SimpleStylePanel from './SimpleStylePanel'

interface ConsolidatedSidebarProps {
  mode: 'simple' | 'pro'
  layout: LayoutSettings
  onLayoutChange: (settings: LayoutSettings) => void
  menuSections: MenuSection[]
  activeSection: string
  onSectionChange: (id: string) => void
  onAddSection: () => void
  onRemoveSection: (id: string) => void
  onAddItem?: (sectionIdx: number) => void
  onRemoveItem?: (sectionIdx: number, itemIdx: number) => void
  selectedElementId?: string
  selectedRole?: string
}

interface AccordionSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

const AccordionSection = ({ title, isOpen, onToggle, children }: AccordionSectionProps) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-sm text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-4 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}

export const ConsolidatedSidebar = ({
  mode,
  layout,
  onLayoutChange,
  menuSections,
  activeSection,
  onSectionChange,
  onAddSection,
  onRemoveSection,
  onAddItem,
  onRemoveItem,
  selectedElementId,
  selectedRole,
}: ConsolidatedSidebarProps) => {
  const { updateMenuItem, addSubitem, updateSubitem, deleteSubitem } = useDocStore()
  const [editingItem, setEditingItem] = useState<{ sectionIdx: number; itemIdx: number; field: 'name' | 'description' | 'price' } | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Accordion state management - all closed by default so user sees all options
  const [openAccordions, setOpenAccordions] = useState({
    layout: false,
    textStyle: false,
    menuSections: false,
    spacing: false
  })

  // Update accordion state when text selection changes
  React.useEffect(() => {
    if (selectedElementId && selectedRole) {
      // Text selected - open Text Style
      setOpenAccordions(prev => ({
        ...prev,
        textStyle: true
      }))
    } else {
      // No text selected - close Text Style
      setOpenAccordions(prev => ({
        ...prev,
        textStyle: false
      }))
    }
  }, [selectedElementId, selectedRole])

  const toggleItemExpanded = (sectionIdx: number, itemIdx: number) => {
    const key = `${sectionIdx}-${itemIdx}`
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const isItemExpanded = (sectionIdx: number, itemIdx: number) => {
    return expandedItems.has(`${sectionIdx}-${itemIdx}`)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-900">Editor Controls</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Layout Section */}
        <AccordionSection
          title="Layout"
          isOpen={openAccordions.layout}
          onToggle={() => setOpenAccordions(prev => ({ ...prev, layout: !prev.layout }))}
        >
          {mode === 'simple' ? (
            <SimpleLayoutControls
              layout={layout}
              onLayoutChange={onLayoutChange}
            />
          ) : (
            <SmartLayoutControls
              layout={layout}
              onLayoutChange={onLayoutChange}
              menuSections={menuSections}
            />
          )}
        </AccordionSection>

        {/* Text Style Section - Opens when text is selected */}
        <AccordionSection
          title="Text Style"
          isOpen={openAccordions.textStyle}
          onToggle={() => setOpenAccordions(prev => ({ ...prev, textStyle: !prev.textStyle }))}
        >
          {selectedElementId && selectedRole ? (
            <SimpleStylePanel
              selectedElementId={selectedElementId}
              selectedRole={selectedRole}
              embedded={true}
            />
          ) : (
            <div className="text-sm text-slate-500 text-center py-4 px-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-medium text-slate-700 mb-1.5 text-xs">✏️ How to Edit Text</p>
              <p className="text-xs leading-relaxed text-slate-600">
                <strong>1.</strong> Click any text<br/>
                <strong>2.</strong> Double-click to edit<br/>
                <strong>3.</strong> Style it here
              </p>
            </div>
          )}
        </AccordionSection>

        {/* Menu Sections - Auto-closes when text is selected */}
        <AccordionSection
          title="Menu Sections"
          isOpen={openAccordions.menuSections}
          onToggle={() => setOpenAccordions(prev => ({ ...prev, menuSections: !prev.menuSections }))}
        >
          <div className="space-y-2">
            {menuSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                {/* Section Header */}
                <div
                  className={`flex items-center justify-between px-2.5 py-2 cursor-pointer transition-colors ${
                    activeSection === String(sectionIdx)
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                  onClick={() => onSectionChange(String(sectionIdx))}
                >
                  <span className="text-xs font-semibold truncate flex-1">{section.title || `Section ${sectionIdx + 1}`}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveSection(String(sectionIdx))
                    }}
                    className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                    title="Delete section"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>

                {/* Section Items - Collapsible */}
                {activeSection === String(sectionIdx) && (
                  <div className="px-2.5 py-2 space-y-1.5 bg-gray-50 border-t border-gray-100">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-white rounded border border-gray-200">
                        {/* Item Header - Click to Expand */}
                        <div className="flex items-center gap-1 p-1.5">
                          <button
                            onClick={() => toggleItemExpanded(sectionIdx, itemIdx)}
                            className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded"
                          >
                            {isItemExpanded(sectionIdx, itemIdx) ? (
                              <ChevronDown className="w-3 h-3 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-gray-600" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            {editingItem?.sectionIdx === sectionIdx && editingItem?.itemIdx === itemIdx && editingItem?.field === 'name' ? (
                              <input
                                type="text"
                                defaultValue={item.name}
                                autoFocus
                                onBlur={(e) => {
                                  updateMenuItem(sectionIdx, itemIdx, 'name', e.target.value)
                                  setEditingItem(null)
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateMenuItem(sectionIdx, itemIdx, 'name', e.currentTarget.value)
                                    setEditingItem(null)
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingItem(null)
                                  }
                                }}
                                className="w-full text-xs px-1 py-0.5 border border-blue-400 rounded"
                              />
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-gray-800 truncate">{item.name}</span>
                                <button
                                  onClick={() => setEditingItem({ sectionIdx, itemIdx, field: 'name' })}
                                  className="flex-shrink-0 p-0.5 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Edit name"
                                >
                                  <Edit2 className="w-2.5 h-2.5 text-blue-600" />
                                </button>
                              </div>
                            )}
                          </div>

                          <span className="text-xs text-gray-600 flex-shrink-0">${item.price}</span>

                          {onRemoveItem && (
                            <button
                              onClick={() => onRemoveItem(sectionIdx, itemIdx)}
                              className="flex-shrink-0 p-0.5 hover:bg-red-100 rounded transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-2.5 h-2.5 text-red-600" />
                            </button>
                          )}
                        </div>

                        {/* Expanded Item Details */}
                        {isItemExpanded(sectionIdx, itemIdx) && (
                          <div className="px-2 pb-2 space-y-2 border-t border-gray-100">
                            {/* Description */}
                            <div>
                              <label className="text-[10px] font-semibold text-gray-600 uppercase">Description</label>
                              {editingItem?.sectionIdx === sectionIdx && editingItem?.itemIdx === itemIdx && editingItem?.field === 'description' ? (
                                <textarea
                                  defaultValue={item.description}
                                  autoFocus
                                  rows={2}
                                  onBlur={(e) => {
                                    updateMenuItem(sectionIdx, itemIdx, 'description', e.target.value)
                                    setEditingItem(null)
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      setEditingItem(null)
                                    }
                                  }}
                                  className="w-full text-xs px-2 py-1 border border-blue-400 rounded mt-1"
                                />
                              ) : (
                                <div
                                  onClick={() => setEditingItem({ sectionIdx, itemIdx, field: 'description' })}
                                  className="text-xs text-gray-600 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded mt-1"
                                >
                                  {item.description || 'Click to add description...'}
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div>
                              <label className="text-[10px] font-semibold text-gray-600 uppercase">Price</label>
                              {editingItem?.sectionIdx === sectionIdx && editingItem?.itemIdx === itemIdx && editingItem?.field === 'price' ? (
                                <input
                                  type="text"
                                  defaultValue={item.price}
                                  autoFocus
                                  onBlur={(e) => {
                                    updateMenuItem(sectionIdx, itemIdx, 'price', e.target.value)
                                    setEditingItem(null)
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateMenuItem(sectionIdx, itemIdx, 'price', e.currentTarget.value)
                                      setEditingItem(null)
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingItem(null)
                                    }
                                  }}
                                  className="w-full text-xs px-2 py-1 border border-blue-400 rounded mt-1"
                                />
                              ) : (
                                <div
                                  onClick={() => setEditingItem({ sectionIdx, itemIdx, field: 'price' })}
                                  className="text-xs text-gray-800 font-medium cursor-pointer hover:bg-gray-50 px-2 py-1 rounded mt-1"
                                >
                                  ${item.price}
                                </div>
                              )}
                            </div>

                            {/* Subitems */}
                            <div>
                              <label className="text-[10px] font-semibold text-gray-600 uppercase">Subitems</label>
                              <div className="space-y-1 mt-1">
                                {item.subitems?.map((subitem, subitemIdx) => (
                                  <div key={subitemIdx} className="flex items-center gap-1 text-xs">
                                    <span className="text-gray-500">•</span>
                                    <input
                                      type="text"
                                      defaultValue={subitem}
                                      onBlur={(e) => updateSubitem(sectionIdx, itemIdx, subitemIdx, e.target.value)}
                                      className="flex-1 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs"
                                    />
                                    <button
                                      onClick={() => deleteSubitem(sectionIdx, itemIdx, subitemIdx)}
                                      className="p-0.5 hover:bg-red-100 rounded"
                                      title="Delete subitem"
                                    >
                                      <Trash2 className="w-2.5 h-2.5 text-red-600" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addSubitem(sectionIdx, itemIdx, 'New detail')}
                                  className="w-full text-xs text-blue-600 hover:bg-blue-50 py-1 rounded flex items-center justify-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Subitem
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Item Button */}
                    {onAddItem && (
                      <button
                        onClick={() => onAddItem(sectionIdx)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors mt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Item</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add Section Button */}
            <button
              onClick={onAddSection}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-md hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>
        </AccordionSection>

        {/* Spacing Section - Placeholder for future */}
        <AccordionSection
          title="Spacing"
          isOpen={openAccordions.spacing}
          onToggle={() => setOpenAccordions(prev => ({ ...prev, spacing: !prev.spacing }))}
        >
          <div className="text-xs text-gray-500">
            Spacing controls coming soon
          </div>
        </AccordionSection>
      </div>
    </div>
  )
}
