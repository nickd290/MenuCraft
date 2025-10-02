import { MenuTemplate } from '@/data/templates'
import { BreakfastLogo } from '../logos/BreakfastLogo'
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

export const BreakfastTemplate = ({
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
    <div className="w-full h-full bg-[#fffaeb] p-8 relative" style={{
      backgroundImage: 'linear-gradient(135deg, rgba(255, 149, 0, 0.05) 0%, transparent 50%)'
    }}>
      {/* Sunny border accent */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#ff9500] via-[#ffd60a] to-[#ff9500]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Logo */}
        {!suppressHeader && (
          <div className="text-center mb-2">
            <div className="flex justify-center" data-el="logo" data-el-type="image">
              <BreakfastLogo />
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
              <div className="mb-3 pb-2 border-b-2 border-[#ff9500]" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-wider uppercase"
                  style={getStyle(`section-${idx}-header`, 'header')}
                >
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.items.slice(0, 3).map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-white/60 p-2 rounded-lg">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
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
          <div>Rise & Shine! ☕</div>
        </div>
      </div>
    </div>
  )
}