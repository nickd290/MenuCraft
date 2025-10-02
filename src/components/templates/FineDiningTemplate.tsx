import { MenuTemplate } from '@/data/templates'
import { FineDiningLogo } from '../logos/FineDiningLogo'
import { TextStyle, ElementTransform } from '@/types/doc'
import { mergeStyles, textStyleToCSS, transformToCSS } from '@/utils/styleHelpers'

interface TemplateProps {
  template: MenuTemplate
  styleOverrides?: Record<string, Partial<TextStyle>>
  roleStyles?: Record<string, Partial<TextStyle>>
  transforms?: Record<string, ElementTransform>
  suppressHeader?: boolean
  columnCount?: number
}

export const FineDiningTemplate = ({
  template,
  styleOverrides = {},
  roleStyles = {},
  transforms = {},
  suppressHeader = false,
  columnCount = 1
}: TemplateProps) => {
  const { sections } = template

  // Helper to get computed style for an element
  const getStyle = (elementId: string, role?: string, baseStyle: React.CSSProperties = {}) => {
    const roleStyle = role && roleStyles[role] ? textStyleToCSS(roleStyles[role]) : {}
    const override = styleOverrides[elementId] ? textStyleToCSS(styleOverrides[elementId]) : {}
    const transform = transforms[elementId] ? transformToCSS(transforms[elementId]) : {}
    return { ...baseStyle, ...roleStyle, ...override, ...transform }
  }

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Menu sections */}
        <div className="flex-1 space-y-6" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              <div className="text-center mb-4" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-[0.2em] uppercase mb-1"
                  style={getStyle(`section-${idx}-header`, 'header', { fontFamily: 'Playfair Display, Georgia, serif' })}
                >
                  {section.title}
                </h2>
                <div className="w-16 h-px bg-[#d4af37] mx-auto" />
              </div>

              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} data-el={`item-${idx}-${itemIdx}`} data-el-type="text" data-role="body" className="px-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        data-el={`item-${idx}-${itemIdx}-name`}
                        data-el-type="text"
                        data-role="body"
                        style={getStyle(`item-${idx}-${itemIdx}-name`, 'body', { fontFamily: 'Playfair Display, Georgia, serif' })}
                      >
                        {item.name}
                      </span>
                      <div className="flex-1 border-b border-dotted border-[#d4af37] mx-2 mb-1" />
                      <span
                        data-el={`item-${idx}-${itemIdx}-price`}
                        data-el-type="text"
                        data-role="price"
                        style={getStyle(`item-${idx}-${itemIdx}-price`, 'price', { fontFamily: 'Playfair Display, Georgia, serif' })}
                      >
                        ${item.price}
                      </span>
                    </div>
                    <p
                      className="pl-0 leading-relaxed"
                      data-el={`item-${idx}-${itemIdx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-${idx}-${itemIdx}-desc`, 'description', { fontFamily: 'Playfair Display, Georgia, serif' })}
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}