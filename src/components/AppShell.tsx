import { ReactNode, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface AppShellProps {
  topBar: ReactNode
  canvas: ReactNode
  propertiesPanel: ReactNode
  toolRail?: ReactNode
}

export const AppShell = ({ topBar, canvas, propertiesPanel, toolRail }: AppShellProps) => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 border-b bg-white z-50">
        {topBar}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Optional Tool Rail (left side) */}
        {toolRail && (
          <div className="flex-shrink-0 border-r bg-slate-50 w-12">
            {toolRail}
          </div>
        )}

        {/* Desktop Layout: Canvas + Resizable Sidebar */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Canvas Area */}
            <Panel defaultSize={70} minSize={40}>
              <div id="menu-canvas" className="h-full overflow-auto bg-slate-100">
                {canvas}
              </div>
            </Panel>

            {/* Resize Handle */}
            <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-slate-400 transition-colors cursor-col-resize relative group">
              <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
                <div className="w-1 h-12 bg-slate-300 rounded-full group-hover:bg-slate-500 transition-colors" />
              </div>
            </PanelResizeHandle>

            {/* Properties Panel (Right Sidebar) */}
            <Panel
              defaultSize={30}
              minSize={20}
              maxSize={40}
              collapsible
              onCollapse={() => setIsPanelCollapsed(true)}
              onExpand={() => setIsPanelCollapsed(false)}
            >
              <div id="properties-panel" className="h-full overflow-y-auto bg-white border-l">
                {isPanelCollapsed ? (
                  <button
                    onClick={() => setIsPanelCollapsed(false)}
                    className="p-2 hover:bg-slate-100 transition-colors"
                    aria-label="Expand properties panel"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                ) : (
                  propertiesPanel
                )}
              </div>
            </Panel>
          </PanelGroup>
        </div>

        {/* Mobile/Tablet Layout: Canvas + Drawer */}
        <div className="flex lg:hidden flex-1 overflow-hidden relative">
          {/* Canvas Area (full width on mobile) */}
          <div id="menu-canvas" className="flex-1 overflow-auto bg-slate-100">
            {canvas}
          </div>

          {/* Floating Properties Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="fixed bottom-6 right-6 z-40 bg-[#1a3d35] text-white p-4 rounded-full shadow-lg hover:bg-[#0f7c5a] transition-colors"
            aria-label="Toggle properties panel"
          >
            {isMobileDrawerOpen ? (
              <ChevronRight className="w-6 h-6" />
            ) : (
              <ChevronLeft className="w-6 h-6" />
            )}
          </button>

          {/* Mobile Drawer Overlay */}
          {isMobileDrawerOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileDrawerOpen(false)}
              />
              <div
                id="properties-panel"
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform"
                style={{
                  transform: isMobileDrawerOpen ? 'translateX(0)' : 'translateX(100%)'
                }}
              >
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
                  <h2 className="font-semibold text-lg">Properties</h2>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                {propertiesPanel}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}