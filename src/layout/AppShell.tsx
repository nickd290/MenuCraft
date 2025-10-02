import { ReactNode, useRef, useState, useEffect, cloneElement, isValidElement } from 'react'
import { usePanZoom } from '@/editor/panzoom/usePanZoom'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Magnet } from 'lucide-react'
import { useSnapEnabled } from '@/hooks/usePreferences'

interface AppShellProps {
  topBar: ReactNode
  canvas: ReactNode
  sidebar: ReactNode
  statusPill?: ReactNode
  toolRail?: ReactNode
}

export const AppShell = ({ topBar, canvas, sidebar, statusPill, toolRail }: AppShellProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const docRef = useRef<HTMLDivElement>(null)

  const { scale, pan, fit, setFit, zoomIn, zoomOut, resetZoom, fitToWidth } = usePanZoom({
    canvasRef,
    docRef
  })

  // Snap state with localStorage persistence
  const [snapEnabled, setSnapEnabled] = useSnapEnabled()

  // Sidebar state with localStorage persistence
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('ui.sidebar')
    return saved !== null ? saved === 'true' : true
  })

  useEffect(() => {
    localStorage.setItem('ui.sidebar', String(sidebarOpen))
  }, [sidebarOpen])

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false)
      }
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  return (
    <div className="h-screen grid grid-rows-[48px_1fr] overflow-hidden">
      {/* Top Bar */}
      <div className="border-b bg-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          {topBar}
        </div>

        <div className="flex items-center gap-3">
          {/* Snap Toggle */}
          <button
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`btn ${snapEnabled ? 'bg-purple-50 border-purple-300 text-purple-700' : ''}`}
            title="Snap to Guides (Hold Alt to disable)"
            aria-label="Toggle snap to guides"
            aria-pressed={snapEnabled}
          >
            <Magnet className="w-3.5 h-3.5 mr-1.5" />
            Snap
          </button>

          {/* Fit to Width Toggle */}
          <button
            onClick={() => setFit(!fit)}
            className={`btn ${fit ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            title="Fit to Width (Cmd/Ctrl+1)"
            aria-label="Toggle fit to width"
            aria-pressed={fit}
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
            {fit ? 'Fit' : 'Manual'}
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border rounded-lg px-2 py-1 bg-white" role="group" aria-label="Zoom controls">
            <button
              onClick={zoomOut}
              className="btn-ghost"
              title="Zoom Out (Cmd/Ctrl+-)"
              aria-label="Zoom out"
              disabled={scale <= 0.1}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="px-2 text-xs font-medium hover:bg-neutral-100 rounded min-w-[3rem] text-center"
              title="Reset Zoom (Cmd/Ctrl+0)"
              aria-label={`Current zoom: ${Math.round(scale * 100)}%. Click to reset`}
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={zoomIn}
              className="btn-ghost"
              title="Zoom In (Cmd/Ctrl++)"
              aria-label="Zoom in"
              disabled={scale >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-[auto_1fr_auto] overflow-hidden">
        {/* Left Icon Rail */}
        {toolRail ? (
          <div className="border-r bg-neutral-50 flex flex-col items-center py-2 w-12">
            {toolRail}
          </div>
        ) : (
          <div className="border-r bg-neutral-50 w-12" />
        )}

        {/* Center Canvas - DOMINANT ELEMENT */}
        <div id="menu-canvas" ref={canvasRef} className="app-canvas relative min-w-0">
          <div ref={docRef} className="doc-frame" style={{ transform: `scale(${scale})` }}>
            {isValidElement(canvas) && typeof canvas.type !== 'string'
              ? cloneElement(canvas as React.ReactElement<any>, { canvasRef, scale })
              : canvas
            }
          </div>

          {/* Bottom-Center Status Badge */}
          {statusPill && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
              {statusPill}
            </div>
          )}
        </div>

        {/* Right Sidebar - SECONDARY PANEL */}
        <div
          className={`border-l bg-white transition-all duration-300 overflow-hidden flex-shrink-0 ${
            sidebarOpen ? 'w-[280px]' : 'w-0'
          }`}
        >
          <div className="w-[280px] h-full overflow-y-auto">
            {sidebar}
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-r-0 rounded-l-lg p-2 shadow-lg hover:bg-neutral-50 z-40"
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarOpen ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile/Tablet Overlay Drawer */}
        {!sidebarOpen && window.innerWidth <= 1280 && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto lg:hidden">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="font-semibold">Properties</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="btn-ghost"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {sidebar}
            </div>
          </>
        )}
      </div>
    </div>
  )
}