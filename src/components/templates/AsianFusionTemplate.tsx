import { MenuTemplate } from '@/data/templates'
import { AsianFusionLogo } from '../logos/AsianFusionLogo'
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

export const AsianFusionTemplate = ({
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
    <div className="w-full h-full bg-[#f8f8f8] p-8 relative">
      {/* Red accent stripe */}
      <div className="absolute top-0 left-0 w-2 h-full bg-[#c41e3a]" />

      {/* Minimalist border */}
      <div className="absolute inset-6 border border-[#1c1c1c]/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full pl-2">
        {/* Header with Logo */}
        {!suppressHeader && (
          <div className="mb-3 pb-2 border-b-2 border-[#c41e3a]">
            <div className="flex justify-center" data-el="logo" data-el-type="image">
              <AsianFusionLogo />
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
              <div className="mb-3 pb-1 border-b border-[#c41e3a]/30" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-[0.2em] uppercase"
                  style={getStyle(`section-${idx}-header`, 'header')}
                >
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.items.slice(0, 3).map((item, itemIdx) => (
                  <div key={itemIdx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        className="tracking-wide"
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
                        {item.price}
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

        {/* Footer - minimalist */}
        <div className="mt-6 pt-2 border-t border-[#1c1c1c]/10">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-[#c41e3a]" />
            <div className="flex-1 h-px bg-[#c41e3a]/30" />
          </div>
        </div>
      </div>
    </div>
  )
}