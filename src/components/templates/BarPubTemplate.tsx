import { MenuTemplate } from '@/data/templates'
import { BarPubLogo } from '../logos/BarPubLogo'
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

export const BarPubTemplate = ({
  template,
  styleOverrides = {},
  roleStyles = {},
  transforms = {},
  suppressHeader = false,
  columnCount = 1
}: TemplateProps) => {
  const { sections, name } = template

  const getStyle = (elementId: string, role?: string, baseStyle: React.CSSProperties = {}) => {
    const roleStyle = role && roleStyles[role] ? textStyleToCSS(roleStyles[role]) : {}
    const override = styleOverrides[elementId] ? textStyleToCSS(styleOverrides[elementId]) : {}
    const transform = transforms[elementId] ? transformToCSS(transforms[elementId]) : {}
    return { ...baseStyle, ...roleStyle, ...override, ...transform }
  }

  return (
    <div className="w-full h-full bg-[#1e3a5f] p-8 relative">
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[#ff8c42]" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-[#ff8c42]" />
      </div>
      <div className="absolute top-4 right-4 w-12 h-12">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-[#ff8c42]" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-[#ff8c42]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Logo */}
        {!suppressHeader && (
          <div className="text-center mb-3 pb-2 border-b-2 border-[#ff8c42]">
            <div className="flex justify-center" data-el="logo" data-el-type="image">
              <BarPubLogo restaurantName={name} />
            </div>
          </div>
        )}

        {/* Menu sections */}
        <div className="flex-1 space-y-5" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              <div className="mb-3 pb-1 border-b border-[#ff8c42]/50" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-wider uppercase"
                  style={getStyle(`section-${idx}-header`, 'header')}
                >
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx}>
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
                    {item.description && (
                      <p
                        className="leading-relaxed"
                        data-el={`item-${idx}-${itemIdx}-desc`}
                        data-el-type="text"
                        data-role="description"
                        style={getStyle(`item-${idx}-${itemIdx}-desc`, 'description')}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-3 border-t border-[#ff8c42]/50">
          <div className="tracking-widest">CHEERS!</div>
        </div>
      </div>
    </div>
  )
}