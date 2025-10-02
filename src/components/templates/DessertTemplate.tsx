import { MenuTemplate } from '@/data/templates'
import { DessertLogo } from '../logos/DessertLogo'
import { TextStyle, ElementTransform } from '@/types/doc'
import { textStyleToCSS, transformToCSS } from '@/utils/styleHelpers'

interface TemplateProps {
  template: MenuTemplate
  styleOverrides?: Record<string, Partial<TextStyle>>
  roleStyles?: Record<string, Partial<TextStyle>>
  transforms?: Record<string, ElementTransform>
  suppressHeader?: boolean
  columnCount?: number
}

export const DessertTemplate = ({
  template,
  styleOverrides = {},
  roleStyles = {},
  transforms = {},
  suppressHeader = false,
  columnCount = 1
}: TemplateProps) => {
  const { sections } = template

  const getStyle = (elementId: string, role?: string, baseStyle: React.CSSProperties = {}) => {
    const roleStyle = role && roleStyles[role] ? textStyleToCSS(roleStyles[role]) : {}
    const override = styleOverrides[elementId] ? textStyleToCSS(styleOverrides[elementId]) : {}
    const transform = transforms[elementId] ? transformToCSS(transforms[elementId]) : {}
    return { ...baseStyle, ...roleStyle, ...override, ...transform }
  }

  return (
    <div className="w-full h-full bg-[#fff5f7] p-8 relative" style={{
      backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(212, 165, 165, 0.1) 0%, transparent 50%)'
    }}>
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 text-[#d4a5a5] text-2xl opacity-30">❀</div>
      <div className="absolute top-4 right-4 text-[#9b59b6] text-2xl opacity-30">❀</div>
      <div className="absolute bottom-4 left-4 text-[#9b59b6] text-2xl opacity-30">❀</div>
      <div className="absolute bottom-4 right-4 text-[#d4a5a5] text-2xl opacity-30">❀</div>

      {/* Elegant border */}
      <div className="absolute inset-6 border-2 border-[#d4a5a5]/40 rounded-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Logo */}
        {!suppressHeader && (
          <div className="text-center mb-2">
            <div className="flex justify-center" data-el="logo" data-el-type="image">
              <DessertLogo />
            </div>
          </div>
        )}

        {/* Menu sections */}
        <div className="flex-1 space-y-5" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.slice(0, 2).map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              <div className="text-center mb-3" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-[0.2em] uppercase"
                  style={getStyle(`section-${idx}-header`, 'header')}
                >
                  {section.title}
                </h2>
                <div className="w-10 h-px bg-[#d4a5a5] mx-auto mt-1" />
              </div>

              <div className="space-y-3">
                {section.items.slice(0, 3).map((item, itemIdx) => (
                  <div key={itemIdx} className="px-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        data-el={`item-${idx}-${itemIdx}-name`}
                        data-el-type="text"
                        data-role="body"
                        style={getStyle(`item-${idx}-${itemIdx}-name`, 'body')}
                      >
                        {item.name}
                      </span>
                      <div className="flex-1 mx-2 mb-1" style={{
                        borderBottom: '1px dotted rgba(155, 89, 182, 0.3)'
                      }} />
                      <span
                        data-el={`item-${idx}-${itemIdx}-price`}
                        data-el-type="text"
                        data-role="price"
                        style={getStyle(`item-${idx}-${itemIdx}-price`, 'price')}
                      >
                        ${item.price}
                      </span>
                    </div>
                    <p
                      className="leading-relaxed"
                      data-el={`item-${idx}-${itemIdx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-${idx}-${itemIdx}-desc`, 'description')}
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <div>Indulge yourself ✨</div>
        </div>
      </div>
    </div>
  )
}