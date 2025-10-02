/**
 * Centralized document store - Single source of truth for all menu data
 * Consolidates: menu content, layout, styles, transforms, metadata
 */

import { create } from 'zustand'
import { ElementTransform, TextRole, TextStyle } from '@/types/doc'
import { LayoutSettings } from '@/types/layout'
import { MenuTemplate, MenuItem } from '@/data/templates'

interface DesignAnalysis {
  colors: {
    pageBackground: string
    sectionHeaderBackground: string
    sectionHeaderText: string
    bodyText: string
    priceText: string
    dividerColor: string
  }
  sectionHeaderStyle: {
    hasColoredBackground: boolean
    isFullWidth: boolean
    alignment: 'left' | 'center'
  }
  layout: {
    columns: number
    hasDividers: boolean
    sectionSpacing: 'tight' | 'normal' | 'loose'
  }
  fonts: {
    headerFont: 'serif' | 'sans-serif'
    bodyFont: 'serif' | 'sans-serif'
  }
}

type DocState = {
  // ========== MENU CONTENT ==========
  // Core menu data - sections, items, restaurant name
  menuData: MenuTemplate | null

  // ========== LAYOUT SETTINGS ==========
  layoutSettings: LayoutSettings

  // ========== LOGO ==========
  logoUrl: string | null
  logoFitMode: 'cover' | 'contain'

  // ========== CUSTOM DESIGN ==========
  customDesign: DesignAnalysis | null
  originalImage: string | null

  // ========== ELEMENT TRANSFORMS ==========
  // Position, size, rotation for each element
  transforms: Record<string, ElementTransform>

  // ========== STYLES ==========
  // Theme role styles (global defaults)
  roleStyles: Record<TextRole, TextStyle>
  // Per-element style overrides
  styleOverrides: Record<string, TextStyle>

  // ========== SELECTION & INTERACTION ==========
  selectedIds: string[]
  hoverId?: string
  editingId: string | null

  // ========== VISIBILITY & LOCKING ==========
  hiddenIds: Set<string>
  lockedIds: Set<string>

  // ========== TEXT EDITS ==========
  textEdits: Record<string, string>

  // ========== NAVIGATION ==========
  selectedSection: number
  currentPage: number

  // ========================================
  // MENU CONTENT ACTIONS
  // ========================================

  setMenuData: (template: MenuTemplate) => void
  updateSectionTitle: (sectionIdx: number, title: string) => void
  updateMenuItem: (sectionIdx: number, itemIdx: number, field: keyof MenuItem, value: string) => void
  addSection: () => void
  deleteSection: (sectionIdx: number) => void
  addMenuItem: (sectionIdx: number) => void
  deleteMenuItem: (sectionIdx: number, itemIdx: number) => void
  addSubitem: (sectionIdx: number, itemIdx: number, text: string) => void
  updateSubitem: (sectionIdx: number, itemIdx: number, subitemIdx: number, text: string) => void
  deleteSubitem: (sectionIdx: number, itemIdx: number, subitemIdx: number) => void

  // ========================================
  // LAYOUT ACTIONS
  // ========================================

  setLayoutSettings: (settings: LayoutSettings) => void
  updateLayout: (partial: Partial<LayoutSettings>) => void

  // ========================================
  // LOGO ACTIONS
  // ========================================

  setLogoUrl: (url: string | null) => void
  setLogoFitMode: (mode: 'cover' | 'contain') => void

  // ========================================
  // CUSTOM DESIGN ACTIONS
  // ========================================

  setCustomDesign: (design: DesignAnalysis | null) => void
  setOriginalImage: (url: string | null) => void

  // ========================================
  // TRANSFORM ACTIONS
  // ========================================

  updateTransform: (id: string, transform: Partial<ElementTransform>) => void
  setTransform: (id: string, transform: ElementTransform) => void
  getTransform: (id: string) => ElementTransform | undefined
  updateZIndex: (id: string, zIndex: number) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void

  // ========================================
  // STYLE ACTIONS
  // ========================================

  updateRoleStyle: (role: TextRole, style: Partial<TextStyle>) => void
  updateStyleOverride: (id: string, style: Partial<TextStyle>) => void
  clearStyleOverride: (id: string) => void
  getComputedStyle: (id: string, role?: TextRole) => TextStyle
  hasStyleOverride: (id: string) => boolean
  resetAllStyles: () => void

  // ========================================
  // SELECTION ACTIONS
  // ========================================

  setSelected: (ids: string[]) => void
  toggleSelected: (id: string, additive?: boolean) => void
  clearSelection: () => void
  setHover: (id?: string) => void

  // ========================================
  // TEXT EDITING ACTIONS
  // ========================================

  startEditing: (id: string) => void
  stopEditing: () => void
  updateText: (id: string, text: string) => void
  getText: (id: string) => string | undefined

  // ========================================
  // VISIBILITY & LOCK ACTIONS
  // ========================================

  toggleVisibility: (id: string) => void
  isHidden: (id: string) => boolean
  setVisibility: (id: string, hidden: boolean) => void
  toggleLock: (id: string) => void
  isLocked: (id: string) => boolean

  // ========================================
  // NAVIGATION ACTIONS
  // ========================================

  setSelectedSection: (idx: number) => void
  setCurrentPage: (page: number) => void

  // ========================================
  // RESET ACTIONS
  // ========================================

  resetDocument: () => void
}

// Default layout settings
const defaultLayout: LayoutSettings = {
  paperSize: '8.5x11',
  columns: 1,
  pageCount: 1,
  fontSizeOverride: 'medium',
  spacingPreset: 'normal',
  autoFit: false
}

// Default role styles
const defaultRoleStyles: Record<TextRole, TextStyle> = {
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#333333',
  },
  body: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#1a1a1a',
  },
  price: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'right',
    color: '#1a1a1a',
    showLeaders: true,
    currency: '$',
  },
  description: {
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'italic',
    textAlign: 'left',
    color: '#666666',
  },
}

export const useDocStore = create<DocState>((set, get) => ({
  // Initial state
  menuData: null,
  layoutSettings: defaultLayout,
  logoUrl: null,
  logoFitMode: 'contain',
  customDesign: null,
  originalImage: null,
  transforms: {},
  roleStyles: defaultRoleStyles,
  styleOverrides: {},
  selectedIds: [],
  hoverId: undefined,
  editingId: null,
  hiddenIds: new Set(),
  lockedIds: new Set(),
  textEdits: {},
  selectedSection: 0,
  currentPage: 1,

  // ========== MENU CONTENT ACTIONS ==========

  setMenuData: (template) => set({ menuData: template }),

  updateSectionTitle: (sectionIdx, title) => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    updated.sections[sectionIdx].title = title
    set({ menuData: updated })
  },

  updateMenuItem: (sectionIdx, itemIdx, field, value) => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    updated.sections[sectionIdx].items[itemIdx][field] = value
    set({ menuData: updated })
  },

  addSection: () => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    updated.sections.push({
      title: `Section ${updated.sections.length + 1}`,
      items: []
    })
    set({ menuData: updated })
  },

  deleteSection: (sectionIdx) => {
    const menuData = get().menuData
    if (!menuData || menuData.sections.length <= 1) return

    const updated = { ...menuData }
    updated.sections.splice(sectionIdx, 1)
    set({ menuData: updated, selectedSection: Math.max(0, get().selectedSection - 1) })
  },

  addMenuItem: (sectionIdx) => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    updated.sections[sectionIdx].items.push({
      name: 'New Item',
      description: '',
      price: '0.00'
    })
    set({ menuData: updated })
  },

  deleteMenuItem: (sectionIdx, itemIdx) => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    updated.sections[sectionIdx].items.splice(itemIdx, 1)
    set({ menuData: updated })
  },

  addSubitem: (sectionIdx, itemIdx, text) => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    const item = updated.sections[sectionIdx].items[itemIdx]
    if (!item.subitems) {
      item.subitems = []
    }
    item.subitems.push(text)
    set({ menuData: updated })
  },

  updateSubitem: (sectionIdx, itemIdx, subitemIdx, text) => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    const item = updated.sections[sectionIdx].items[itemIdx]
    if (item.subitems && item.subitems[subitemIdx] !== undefined) {
      item.subitems[subitemIdx] = text
      set({ menuData: updated })
    }
  },

  deleteSubitem: (sectionIdx, itemIdx, subitemIdx) => {
    const menuData = get().menuData
    if (!menuData) return

    const updated = { ...menuData }
    const item = updated.sections[sectionIdx].items[itemIdx]
    if (item.subitems) {
      item.subitems.splice(subitemIdx, 1)
      set({ menuData: updated })
    }
  },

  // ========== LAYOUT ACTIONS ==========

  setLayoutSettings: (settings) => set({ layoutSettings: settings }),

  updateLayout: (partial) => {
    set({ layoutSettings: { ...get().layoutSettings, ...partial } })
  },

  // ========== LOGO ACTIONS ==========

  setLogoUrl: (url) => set({ logoUrl: url }),

  setLogoFitMode: (mode) => set({ logoFitMode: mode }),

  // ========== CUSTOM DESIGN ACTIONS ==========

  setCustomDesign: (design) => set({ customDesign: design }),

  setOriginalImage: (url) => set({ originalImage: url }),

  // ========== TRANSFORM ACTIONS ==========

  updateTransform: (id, partial) => {
    set((state) => ({
      transforms: {
        ...state.transforms,
        [id]: { ...state.transforms[id], ...partial }
      }
    }))
  },

  setTransform: (id, transform) => {
    set((state) => ({
      transforms: { ...state.transforms, [id]: transform }
    }))
  },

  getTransform: (id) => get().transforms[id],

  updateZIndex: (id, zIndex) => {
    get().updateTransform(id, { zIndex })
  },

  bringForward: (id) => {
    const transform = get().transforms[id]
    if (transform) {
      get().updateTransform(id, {
        zIndex: (transform.zIndex ?? 0) + 1
      })
    }
  },

  sendBackward: (id) => {
    const transform = get().transforms[id]
    if (transform) {
      get().updateTransform(id, {
        zIndex: Math.max(0, (transform.zIndex ?? 0) - 1)
      })
    }
  },

  // ========== STYLE ACTIONS ==========

  updateRoleStyle: (role, style) => {
    set((state) => ({
      roleStyles: {
        ...state.roleStyles,
        [role]: { ...state.roleStyles[role], ...style }
      }
    }))
  },

  updateStyleOverride: (id, style) => {
    set((state) => ({
      styleOverrides: {
        ...state.styleOverrides,
        [id]: { ...state.styleOverrides[id], ...style }
      }
    }))
  },

  clearStyleOverride: (id) => {
    set((state) => {
      const newOverrides = { ...state.styleOverrides }
      delete newOverrides[id]
      return { styleOverrides: newOverrides }
    })
  },

  getComputedStyle: (id, role) => {
    const override = get().styleOverrides[id]
    const roleStyle = role ? get().roleStyles[role] : {}

    // Try to read actual DOM styles if element exists
    const element = document.querySelector<HTMLElement>(`[data-el="${id}"]`)
    const domStyles: Partial<TextStyle> = {}

    if (element) {
      const computed = window.getComputedStyle(element)
      domStyles.fontSize = parseInt(computed.fontSize) || undefined
      domStyles.fontWeight = (computed.fontWeight === 'bold' || parseInt(computed.fontWeight) >= 600) ? 'bold' : 'normal'
      domStyles.color = computed.color || undefined
      domStyles.textAlign = computed.textAlign as any
      domStyles.fontStyle = computed.fontStyle as any
      domStyles.textDecoration = computed.textDecoration as any
    }

    // Priority: override > roleStyle > domStyles
    return { ...domStyles, ...roleStyle, ...override }
  },

  hasStyleOverride: (id) => {
    return !!get().styleOverrides[id]
  },

  resetAllStyles: () => {
    set({
      styleOverrides: {},
      roleStyles: defaultRoleStyles
    })
  },

  // ========== SELECTION ACTIONS ==========

  setSelected: (ids) => set({ selectedIds: [...new Set(ids)] }),

  toggleSelected: (id, additive = false) => {
    const cur = get().selectedIds
    if (additive) {
      set({
        selectedIds: cur.includes(id)
          ? cur.filter(x => x !== id)
          : [...cur, id]
      })
    } else {
      set({ selectedIds: [id] })
    }
  },

  clearSelection: () => set({ selectedIds: [], hoverId: undefined }),

  setHover: (id) => set({ hoverId: id }),

  // ========== TEXT EDITING ACTIONS ==========

  startEditing: (id) => set({ editingId: id }),

  stopEditing: () => set({ editingId: null }),

  updateText: (id, text) => {
    set((state) => ({
      textEdits: { ...state.textEdits, [id]: text }
    }))
  },

  getText: (id) => get().textEdits[id],

  // ========== VISIBILITY & LOCK ACTIONS ==========

  toggleVisibility: (id) => {
    set((state) => {
      const newHidden = new Set(state.hiddenIds)
      if (newHidden.has(id)) {
        newHidden.delete(id)
      } else {
        newHidden.add(id)
      }
      return { hiddenIds: newHidden }
    })
  },

  isHidden: (id) => get().hiddenIds.has(id),

  setVisibility: (id, hidden) => {
    set((state) => {
      const newHidden = new Set(state.hiddenIds)
      if (hidden) {
        newHidden.add(id)
      } else {
        newHidden.delete(id)
      }
      return { hiddenIds: newHidden }
    })
  },

  toggleLock: (id) => {
    set((state) => {
      const newLocked = new Set(state.lockedIds)
      if (newLocked.has(id)) {
        newLocked.delete(id)
      } else {
        newLocked.add(id)
      }
      return { lockedIds: newLocked }
    })
  },

  isLocked: (id) => get().lockedIds.has(id),

  // ========== NAVIGATION ACTIONS ==========

  setSelectedSection: (idx) => set({ selectedSection: idx }),

  setCurrentPage: (page) => set({ currentPage: page }),

  // ========== RESET ACTIONS ==========

  resetDocument: () => {
    set({
      menuData: null,
      layoutSettings: defaultLayout,
      logoUrl: null,
      logoFitMode: 'contain',
      customDesign: null,
      originalImage: null,
      transforms: {},
      roleStyles: defaultRoleStyles,
      styleOverrides: {},
      selectedIds: [],
      hoverId: undefined,
      editingId: null,
      hiddenIds: new Set(),
      lockedIds: new Set(),
      textEdits: {},
      selectedSection: 0,
      currentPage: 1,
    })
  },
}))
