import { MenuTemplate } from '@/data/templates'
import { SteakhouseLogo } from '../logos/SteakhouseLogo'
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

export const SteakhouseTemplate = ({
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
    <div className="w-full h-full bg-[#1a1614] p-8 relative">
      {/* Gold corner accents */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Logo */}
        {!suppressHeader && (
          <div className="text-center mb-3 pb-2 border-b border-[#d4af37]/30">
            <div className="flex justify-center" data-el="logo" data-el-type="image">
              <SteakhouseLogo />
            </div>
          </div>
        )}

        {/* Menu sections */}
        <div className="flex-1 space-y-6" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.slice(0, 2).map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              <div className="mb-4 pb-2 border-b-2 border-[#8b0000]" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-[0.15em] uppercase"
                  style={getStyle(`section-${idx}-header`, 'header')}
                >
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.items.slice(0, 3).map((item, itemIdx) => (
                  <div key={itemIdx} className="group">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        className="uppercase tracking-wide"
                        data-el={`item-${idx}-${itemIdx}-name`}
                        data-el-type="text"
                        data-role="body"
                        style={getStyle(`item-${idx}-${itemIdx}-name`, 'body')}
                      >
                        {item.name}
                      </span>
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
        <div className="text-center mt-6 pt-4 border-t border-[#d4af37]/30">
          <div className="tracking-widest">★ ★ ★</div>
        </div>
      </div>
    </div>
  )
}