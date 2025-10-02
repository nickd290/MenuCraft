import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { templates } from '@/data/templates'
import { MenuTemplate } from '@/data/templates'
import { Button } from '@/components/ui/button'
import { MenuPreviewWithLayout } from '@/components/MenuPreviewWithLayout'
import { AppShell } from '@/layout/AppShell'
import { PAPER_SIZES, estimateContentFit, calculateContentMetrics, getFontScaleWithOverrides } from '@/types/layout'
import InteractionLayer from '@/editor/InteractionLayer'
import CommandPalette from '@/components/CommandPalette'
import CoachChips from '@/components/CoachChips'
import { ConsolidatedSidebar } from '@/components/ConsolidatedSidebar'
import { usePreferences } from '@/hooks/usePreferences'
import { useDocStore } from '@/state/doc'
import { TextRole } from '@/types/doc'
import { ArrowLeft, Download, Grid3x3, Sparkles, Loader2, CheckCircle2, AlertCircle, Lightbulb, Settings, Package } from 'lucide-react'

interface ExtractedMenuData {
  restaurantName?: string
  logo?: {
    present: boolean
    description: string
    position: string
    hasText: boolean
  }
  sections: Array<{
    title: string
    items: Array<{
      name: string
      description: string
      price: string
    }>
  }>
}

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

const EditorPage = () => {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { prefs, updatePref } = usePreferences()

  // Get state from doc store
  const menuData = useDocStore((s) => s.menuData)
  const selectedSection = useDocStore((s) => s.selectedSection)
  const currentPage = useDocStore((s) => s.currentPage)
  const layoutSettings = useDocStore((s) => s.layoutSettings)
  const logoUrl = useDocStore((s) => s.logoUrl)
  const logoFitMode = useDocStore((s) => s.logoFitMode)
  const customDesign = useDocStore((s) => s.customDesign)
  const originalImage = useDocStore((s) => s.originalImage)
  const selectedIds = useDocStore((s) => s.selectedIds)

  // Get actions from doc store
  const setMenuData = useDocStore((s) => s.setMenuData)
  const setSelectedSection = useDocStore((s) => s.setSelectedSection)
  const setCurrentPage = useDocStore((s) => s.setCurrentPage)
  const setLayoutSettings = useDocStore((s) => s.setLayoutSettings)
  const setLogoUrl = useDocStore((s) => s.setLogoUrl)
  const setCustomDesign = useDocStore((s) => s.setCustomDesign)
  const setOriginalImage = useDocStore((s) => s.setOriginalImage)
  const updateSectionTitle = useDocStore((s) => s.updateSectionTitle)
  const updateMenuItem = useDocStore((s) => s.updateMenuItem)
  const addSection = useDocStore((s) => s.addSection)
  const deleteSection = useDocStore((s) => s.deleteSection)
  const addMenuItem = useDocStore((s) => s.addMenuItem)
  const deleteMenuItem = useDocStore((s) => s.deleteMenuItem)

  // Local UI-only state
  const [showOptionScreen, setShowOptionScreen] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isAnalyzingDesign, setIsAnalyzingDesign] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedMenuData | null>(null)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showDocInfoPopover, setShowDocInfoPopover] = useState(false)

  // Reset all styles on mount to clear test data
  useEffect(() => {
    useDocStore.getState().resetAllStyles()
  }, [])

  // Command Palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // NOTE: Styles are now applied during render in template components, not via DOM manipulation
  // Templates receive styleOverrides and roleStyles as props and apply them inline
  useEffect(() => {
    // Check if this is an upload flow
    if (templateId === 'upload') {
      const uploadedData = sessionStorage.getItem('uploadedMenuData')
      const uploadedImage = sessionStorage.getItem('uploadedMenuImage')
      if (uploadedData) {
        const data: ExtractedMenuData = JSON.parse(uploadedData)
        setExtractedData(data)
        setOriginalImage(uploadedImage)
        setShowOptionScreen(true)
      } else {
        // No uploaded data found, redirect to upload page
        navigate('/upload')
      }
    } else {
      const template = templates.find(t => t.id === Number(templateId))
      if (template) {
        // Deep clone the template to avoid mutating original
        setMenuData(JSON.parse(JSON.stringify(template)))
      }
    }
  }, [templateId, navigate])

  const handleReplicateDesign = async () => {
    if (!originalImage || !extractedData) return

    setIsAnalyzingDesign(true)

    try {
      const response = await fetch('/api/analyze-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: originalImage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze design')
      }

      const designData: DesignAnalysis = await response.json()

      // Store the design analysis
      setCustomDesign(designData)

      // Create custom template with extracted content
      const customTemplate: MenuTemplate = {
        id: 999,
        name: extractedData.restaurantName || 'Your Menu',
        description: `Original design replicated`,
        category: 'Custom Replicated',
        sections: extractedData.sections,
        colorScheme: {
          primary: designData.colors.sectionHeaderBackground,
          secondary: designData.colors.bodyText,
          accent: designData.colors.dividerColor,
          background: designData.colors.pageBackground,
          text: designData.colors.bodyText,
        },
        fontFamily: designData.fonts.headerFont,
        // Store restaurant name and logo for CustomReplicatedTemplate
        restaurantName: extractedData.restaurantName,
        logo: extractedData.logo,
      } as any

      // Use recommended paper size from content metrics, or fall back to design analysis
      const recommendedPaperSize = (extractedData as any).contentMetrics?.recommendedPaperSize || '8.5x11'
      const recommendedColumns = (extractedData as any).contentMetrics?.recommendedColumns || designData.layout.columns

      // Set layout based on recommendations
      setLayoutSettings({
        paperSize: recommendedPaperSize as any,
        columns: recommendedColumns as 1 | 2,
        pageCount: 1
      })

      // Handle logo if detected
      if ((extractedData as any).logo?.present) {
        console.log('Logo detected:', (extractedData as any).logo.description)
        // Logo will be handled by user upload - show a message
      }

      setMenuData(customTemplate)
      setShowOptionScreen(false)
      sessionStorage.removeItem('uploadedMenuData')
      sessionStorage.removeItem('uploadedMenuImage')
      sessionStorage.removeItem('uploadedMenuDesign')
    } catch (error) {
      console.error('Design analysis error:', error)
      alert('Failed to analyze menu design. Please try using a pre-made template instead.')
    } finally {
      setIsAnalyzingDesign(false)
    }
  }

  const applyTemplateToExtractedData = (selectedTemplateId: number) => {
    const template = templates.find(t => t.id === selectedTemplateId)
    if (template && extractedData) {
      // Create a new template with extracted data
      const newTemplate: MenuTemplate = {
        ...template,
        name: extractedData.restaurantName || template.name,
        sections: extractedData.sections
      }
      setMenuData(newTemplate)
      setShowTemplateSelector(false)
      setShowOptionScreen(false)
      // Clear sessionStorage after applying
      sessionStorage.removeItem('uploadedMenuData')
      sessionStorage.removeItem('uploadedMenuImage')
    }
  }

  // Logo upload handler
  const handleLogoUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setLogoUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  // Option Screen - Choose between replicating design or using template
  if (showOptionScreen && extractedData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/upload')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-xl font-bold">Choose Your Approach</h1>
                <p className="text-sm text-slate-600">
                  How would you like to design your menu?
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Extracted Data Summary */}
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <h3 className="font-bold text-green-900 text-lg mb-1">
              {extractedData.restaurantName || 'Menu Extracted Successfully!'}
            </h3>
            <p className="text-sm text-green-700">
              {extractedData.sections.length} section{extractedData.sections.length !== 1 ? 's' : ''} •{' '}
              {extractedData.sections.reduce((sum, s) => sum + s.items.length, 0)} items extracted
            </p>
          </div>

          {/* Two Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: Replicate Design */}
            <button
              onClick={handleReplicateDesign}
              disabled={isAnalyzingDesign}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:shadow-2xl transition-all p-8 text-left relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />

              <div className="relative">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  {isAnalyzingDesign ? (
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Replicate My Menu Design
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  AI will analyze your menu's visual style and recreate it with your content
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span>Matches your original fonts & colors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span>Preserves your layout style</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span>Keeps your brand aesthetic</span>
                  </div>
                </div>

                <div className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-center group-hover:bg-purple-700 transition-colors">
                  {isAnalyzingDesign ? 'Analyzing Design...' : 'Match My Original Design'}
                </div>
              </div>
            </button>

            {/* Option 2: Use Template */}
            <button
              onClick={() => setShowTemplateSelector(true)}
              disabled={isAnalyzingDesign}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all p-8 text-left relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />

              <div className="relative">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <Grid3x3 className="w-8 h-8 text-blue-600" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Use a Pre-Made Template
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Apply your menu content to a professional template designed by experts
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>10+ professionally designed styles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Instant preview & customization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Print-optimized layouts</span>
                  </div>
                </div>

                <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-center group-hover:bg-blue-700 transition-colors">
                  Choose from Our Templates
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Template Selection Modal for Uploaded Data
  if (showTemplateSelector && extractedData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTemplateSelector(false)
                  setShowOptionScreen(true)
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Options
              </Button>
              <div>
                <h1 className="text-xl font-bold">Choose a Template</h1>
                <p className="text-sm text-slate-600">
                  Select a professional template to apply your menu content
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-1">Extracted Menu Data</h3>
            <p className="text-sm text-blue-700">
              {extractedData.restaurantName && <><strong>{extractedData.restaurantName}</strong> • </>}
              {extractedData.sections.length} section{extractedData.sections.length !== 1 ? 's' : ''} •{' '}
              {extractedData.sections.reduce((sum, s) => sum + s.items.length, 0)} items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplateToExtractedData(template.id)}
                className="bg-white rounded-lg border-2 border-slate-200 hover:border-slate-900 transition-all overflow-hidden group text-left"
              >
                <div className="aspect-[8.5/11] bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
                  <Grid3x3 className="w-16 h-16 text-slate-300 group-hover:text-slate-400 transition-colors" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                  <span className="inline-block px-2 py-1 bg-slate-100 text-xs font-medium rounded">
                    {template.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Template not found</h2>
          <Button onClick={() => navigate('/')}>Back to Templates</Button>
        </div>
      </div>
    )
  }

  // Handle inline text edits from canvas
  const handleTextCommit = (elementId: string, text: string) => {
    // Parse element ID to extract section and item indices
    // Format: "item-{sectionIdx}-{itemIdx}" or "section-{sectionIdx}-header"
    const itemMatch = elementId.match(/^item-(\d+)-(\d+)$/)
    const sectionMatch = elementId.match(/^section-(\d+)-header$/)

    if (itemMatch) {
      const [, sectionIdx, itemIdx] = itemMatch
      // For items, update the name field
      updateMenuItem(Number(sectionIdx), Number(itemIdx), 'name', text)
    } else if (sectionMatch) {
      const [, sectionIdx] = sectionMatch
      // For section headers, update the section title
      updateSectionTitle(Number(sectionIdx), text)
    }
  }

  // Calculate content recommendations
  const getContentRecommendation = () => {
    if (!menuData) return null

    const sectionCount = menuData.sections.length
    const itemCount = menuData.sections.reduce((sum, s) => sum + s.items.length, 0)
    const avgDescLength = menuData.sections.reduce((sum, s) =>
      sum + s.items.reduce((itemSum, i) => itemSum + (i.description?.length || 0), 0), 0
    ) / itemCount

    // Determine recommended size based on content
    let recommendedSize: '8.5x11' | '8.5x14' | '11x17' | '5.5x8.5' = '8.5x11'
    let recommendedPages: 1 | 2 = 1
    let reason = ''
    let warning = null

    if (itemCount > 50 || sectionCount > 8) {
      recommendedSize = '11x17'
      recommendedPages = 2
      reason = `Your menu has ${sectionCount} sections with ${itemCount} items - larger format recommended for readability`
    } else if (itemCount > 30 || sectionCount > 6) {
      recommendedSize = '11x17'
      reason = `${itemCount} items across ${sectionCount} sections will fit better on a larger menu`
    } else if (itemCount > 20 || sectionCount > 4) {
      recommendedSize = '8.5x14'
      reason = `${sectionCount} sections with ${itemCount} items - legal size provides good balance`
    } else if (itemCount <= 12 && sectionCount <= 3) {
      recommendedSize = '5.5x8.5'
      reason = `Compact menu size perfect for ${itemCount} items`
    }

    // Check if current settings might be too small
    if (layoutSettings.paperSize === '8.5x11' && itemCount > 35) {
      warning = '⚠️ This much content on 8.5×11" may result in very small text'
    } else if (layoutSettings.paperSize === '5.5x8.5' && itemCount > 15) {
      warning = '⚠️ Too much content for this small format - text will be difficult to read'
    }

    return {
      recommendedSize,
      recommendedPages,
      reason,
      warning,
      isDifferent: recommendedSize !== layoutSettings.paperSize || recommendedPages !== layoutSettings.pageCount
    }
  }

  const recommendation = getContentRecommendation()

  // Calculate content fit for status pill
  const contentMetrics = calculateContentMetrics(menuData?.sections || [])
  const fontScale = getFontScaleWithOverrides(
    layoutSettings.paperSize,
    {
      itemCount: contentMetrics.totalItems,
      columnCount: layoutSettings.columns,
      avgDescLength: contentMetrics.avgDescLength
    },
    layoutSettings.fontSizeOverride,
    layoutSettings.autoFit
  )
  const contentFit = estimateContentFit(menuData?.sections || [], layoutSettings.paperSize, layoutSettings.columns, fontScale)
  const fitsOnOnePage = contentFit.fits

  // TOP BAR COMPONENT
  const topBar = (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="text-slate-700 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#d4f534] flex items-center justify-center border-2 border-[#1a3d35]">
          <span className="text-[#1a3d35] font-bold text-sm">MC</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900">{menuData.name}</h1>
        </div>
      </div>

      {/* Simple/Pro Mode Toggle */}
      <div className="ml-auto flex items-center gap-2 border rounded-lg p-1">
        <button
          onClick={() => updatePref('editorMode', 'simple')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            prefs.editorMode === 'simple'
              ? 'bg-[#0f7c5a] text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Simple
        </button>
        <button
          onClick={() => updatePref('editorMode', 'pro')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
            prefs.editorMode === 'pro'
              ? 'bg-[#0f7c5a] text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3 h-3" />
          Pro
        </button>
      </div>

      {/* Temporarily removed - implementing soon
      <Button
        variant="outline"
        size="sm"
        onClick={() => alert('Save functionality coming soon!')}
      >
        Save Draft
      </Button>
      <Button
        onClick={() => alert('Export functionality coming soon!')}
        variant="outline"
        size="sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
      */}
      <Button
        onClick={() => navigate('/checkout')}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all"
        size="sm"
      >
        <Package className="w-4 h-4 mr-2" />
        Order Physical Menus
      </Button>
    </div>
  )

  // STATUS PILL COMPONENT
  const statusPill = (
    <div className="relative">
      {/* Clickable Document Info Badge */}
      <button
        onClick={() => setShowDocInfoPopover(!showDocInfoPopover)}
        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg transition-all hover:shadow-xl ${
          fitsOnOnePage
            ? 'bg-white border-2 border-green-500 text-slate-900'
            : 'bg-white border-2 border-orange-500 text-slate-900'
        }`}
      >
        {fitsOnOnePage ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{PAPER_SIZES[layoutSettings.paperSize].name} • {layoutSettings.columns} col • Fits</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span>{PAPER_SIZES[layoutSettings.paperSize].name} • {layoutSettings.columns} col • Overflow</span>
          </>
        )}
      </button>

      {/* Popover */}
      {showDocInfoPopover && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDocInfoPopover(false)}
          />

          {/* Popover Content */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-white rounded-lg shadow-2xl border-2 border-slate-200 z-50 p-4">
            <h3 className="font-bold text-sm mb-3 text-slate-900">Document Info</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Paper Size:</span>
                <span className="font-medium">{PAPER_SIZES[layoutSettings.paperSize].name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Dimensions:</span>
                <span className="font-medium">{PAPER_SIZES[layoutSettings.paperSize].width}" × {PAPER_SIZES[layoutSettings.paperSize].height}"</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Columns:</span>
                <span className="font-medium">{layoutSettings.columns}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Sections:</span>
                <span className="font-medium">{menuData?.sections.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Total Items:</span>
                <span className="font-medium">{menuData?.sections.reduce((sum, s) => sum + s.items.length, 0) || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Content Status:</span>
                <span className={`font-medium ${fitsOnOnePage ? 'text-green-600' : 'text-orange-600'}`}>
                  {fitsOnOnePage ? 'Fits on page' : 'Content overflow'}
                </span>
              </div>
            </div>

            {/* Recommendation */}
            {recommendation && recommendation.isDifferent && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-blue-900 font-medium mb-1">Recommendation</p>
                    <p className="text-xs text-blue-700 mb-2">{recommendation.reason}</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setLayoutSettings({
                          paperSize: recommendation.recommendedSize,
                          columns: layoutSettings.columns,
                          pageCount: recommendation.recommendedPages
                        })
                        setShowDocInfoPopover(false)
                      }}
                      className="w-full text-xs"
                    >
                      Apply: {PAPER_SIZES[recommendation.recommendedSize].name}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  // CANVAS COMPONENT (receives canvasRef and scale from AppShell)
  const CanvasComponent = ({ canvasRef, scale }: { canvasRef?: React.RefObject<HTMLDivElement>, scale?: number }) => (
    <div className="relative w-full h-full">
      {/* Page Navigation for 2-page layouts */}
      {layoutSettings.pageCount === 2 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 border rounded-lg overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              currentPage === 1
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Page 1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              currentPage === 2
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Page 2
          </button>
        </div>
      )}

      {/* Menu Preview */}
      <MenuPreviewWithLayout
        template={menuData}
        layout={layoutSettings}
        currentPage={currentPage}
        customDesign={customDesign}
        logoUrl={logoUrl}
        logoFitMode={logoFitMode}
        onLogoUpload={handleLogoUpload}
      />

      {/* Interaction Layer for selection and transforms */}
      {canvasRef && <InteractionLayer canvasRef={canvasRef} scale={scale} onTextCommit={handleTextCommit} />}
    </div>
  )

  // Get selected element metadata for sidebar
  const getSelectedElementMetadata = () => {
    if (selectedIds.length === 0) return null

    const element = document.querySelector<HTMLElement>(`[data-el="${selectedIds[0]}"]`)
    if (!element) return null

    const type = element.getAttribute('data-el-type') as 'text' | 'image' | 'shape' | 'group' | null
    const role = element.getAttribute('data-role') as TextRole | null

    return { id: selectedIds[0], type, role }
  }

  const selectedElement = getSelectedElementMetadata()

  // SIDEBAR COMPONENT - Using ConsolidatedSidebar
  const sidebar = (
    <ConsolidatedSidebar
      mode={prefs.editorMode}
      layout={layoutSettings}
      onLayoutChange={setLayoutSettings}
      menuSections={menuData.sections}
      activeSection={String(selectedSection)}
      onSectionChange={(id) => setSelectedSection(parseInt(id))}
      onAddSection={addSection}
      onRemoveSection={(id) => {
        const idx = parseInt(id)
        if (menuData && menuData.sections.length <= 1) {
          alert('Menu must have at least one section')
          return
        }
        deleteSection(idx)
      }}
      onAddItem={(sectionIdx) => addMenuItem(sectionIdx)}
      onRemoveItem={(sectionIdx, itemIdx) => deleteMenuItem(sectionIdx, itemIdx)}
      selectedElementId={selectedElement?.type === 'text' && selectedElement?.role ? selectedElement.id : undefined}
      selectedRole={selectedElement?.type === 'text' && selectedElement?.role ? selectedElement.role : undefined}
    />
  )

  return (
    <>
      <AppShell
        topBar={topBar}
        canvas={<CanvasComponent />}
        sidebar={sidebar}
        statusPill={statusPill}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onAddSection={addSection}
        onAddItem={() => addMenuItem(selectedSection)}
        onReplaceLogo={handleLogoUpload}
        onFitToWidth={() => alert('Fit to width!')}
        onExportPDF={() => alert('Export PDF coming soon!')}
      />

      {/* Coach Chips */}
      <CoachChips />
    </>
  )
}

export default EditorPage