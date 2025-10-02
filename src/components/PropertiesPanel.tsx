import { ReactNode } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Settings, Layout, Type, AlignVerticalSpaceAround, FileText, List } from 'lucide-react'

interface PropertiesPanelProps {
  paperSizeControls: ReactNode
  columnControls: ReactNode
  fontSizeControls: ReactNode
  spacingControls: ReactNode
  pagesControls: ReactNode
  menuSectionsControls: ReactNode
  autoFitControl?: ReactNode
}

export const PropertiesPanel = ({
  paperSizeControls,
  columnControls,
  fontSizeControls,
  spacingControls,
  pagesControls,
  menuSectionsControls,
  autoFitControl
}: PropertiesPanelProps) => {
  return (
    <div className="h-full">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 z-10">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600" />
          <h2 className="font-semibold text-lg">Properties</h2>
        </div>
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={['layout', 'typography', 'sections']}
        className="divide-y"
      >
        {/* Layout Section */}
        <AccordionItem value="layout">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-slate-600" />
              <span>Layout Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Paper Size */}
              <div>
                {paperSizeControls}
              </div>

              {/* Columns */}
              <div>
                {columnControls}
              </div>

              {/* Pages */}
              <div>
                {pagesControls}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Typography Section */}
        <AccordionItem value="typography">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-600" />
              <span>Typography</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Font Size */}
              <div>
                {fontSizeControls}
              </div>

              {/* Spacing */}
              <div>
                {spacingControls}
              </div>

              {/* Auto-fit if provided */}
              {autoFitControl && (
                <div>
                  {autoFitControl}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Menu Sections */}
        <AccordionItem value="sections">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-slate-600" />
              <span>Menu Sections</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {menuSectionsControls}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}