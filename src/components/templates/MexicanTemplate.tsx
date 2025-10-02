import { MenuTemplate } from '@/data/templates'
import { MexicanLogo } from '../logos/MexicanLogo'
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

export const MexicanTemplate = ({
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
    <div className="w-full h-full bg-[#fff8dc] p-7 relative" style={{
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(210, 105, 30, 0.03) 35px, rgba(210, 105, 30, 0.03) 70px)'
    }}>
      {/* Decorative pattern border */}
      <div className="absolute top-3 left-3 right-3 h-8 flex gap-1 items-center justify-center">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#ff6347] rotate-45" />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full pt-4">
        {/* Header with Logo */}
        {!suppressHeader && (
          <div className="text-center mb-2">
            <div className="flex justify-center" data-el="logo" data-el-type="image">
              <MexicanLogo />
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
              <div className="text-center mb-3 bg-[#ff6347] py-1" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-wider uppercase"
                  style={getStyle(`section-${idx}-header`, 'header')}
                >
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.items.slice(0, 3).map((item, itemIdx) => (
                  <div key={itemIdx} className="px-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        className="uppercase"
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
        <div className="text-center mt-4">
          <div>¡Buen Provecho!</div>
        </div>
      </div>
    </div>
  )
}