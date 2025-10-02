import { MenuTemplate } from '@/data/templates'
import { ItalianLogo } from '../logos/ItalianLogo'
import { TextStyle, ElementTransform } from '@/types/doc'
import { textStyleToCSS, transformToCSS } from '@/utils/styleHelpers'

interface TemplateProps {
  template: MenuTemplate
  styleOverrides?: Record<string, Partial<TextStyle>>
  roleStyles?: Record<string, Partial<TextStyle>>
  transforms?: Record<string, ElementTransform>
  suppressHeader?: boolean
  suppressBorder?: boolean
  columnCount?: number
}

export const ItalianTemplate = ({
  template,
  styleOverrides = {},
  roleStyles = {},
  transforms = {},
  suppressHeader = false,
  suppressBorder = false,
  columnCount = 1
}: TemplateProps) => {
  const { sections } = template

  const getStyle = (elementId: string, role?: string, baseStyle: React.CSSProperties = {}) => {
    const roleStyle = role && roleStyles[role] ? textStyleToCSS(roleStyles[role]) : {}
    const override = styleOverrides[elementId] ? textStyleToCSS(styleOverrides[elementId]) : {}
    const transform = transforms[elementId] ? transformToCSS(transforms[elementId]) : {}
    return { ...baseStyle, ...roleStyle, ...override, ...transform }
  }

  // When in column mode (suppressHeader=true), render only content without decorations/footer
  if (suppressHeader) {
    return (
      <div className="h-full space-y-5">
        {sections.map((section, idx) => (
          <div key={idx} data-el={`section-${idx}`} data-el-type="group">
            <div className="text-center mb-3" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
              <h2
                className="mb-1"
                style={getStyle(`section-${idx}-header`, 'header', {
                  fontFamily: 'Brush Script MT, cursive',
                  fontStyle: 'italic'
                })}
              >
                {section.title}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-px bg-[#8b4513]" />
                <div className="w-1 h-1 bg-[#cd212a] rounded-full" />
                <div className="w-8 h-px bg-[#8b4513]" />
              </div>
            </div>

            <div className="space-y-3">
              {section.items.map((item, itemIdx) => (
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
    )
  }

  // Full template with decorations, header, and footer
  return (
    <div className="w-full h-full bg-[#fffef7] p-8 relative" style={{
      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(139, 69, 19, 0.02) 50px, rgba(139, 69, 19, 0.02) 51px)'
    }}>
      {/* Decorative border */}
      {!suppressBorder && <div className="absolute inset-5 border border-[#8b4513]/20" />}

      {/* Italian flag colors accent */}
      {!suppressBorder && (
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#008c45]" />
          <div className="flex-1 bg-[#f5f5f5]" />
          <div className="flex-1 bg-[#cd212a]" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full pt-2">
        {/* Header with Logo */}
        <div className="text-center mb-2">
          <div className="flex justify-center" data-el="logo" data-el-type="image">
            <ItalianLogo />
          </div>
        </div>

        {/* Menu sections */}
        <div
          className="flex-1 space-y-5"
          style={{
            columnCount: columnCount,
            columnGap: '32px',
            columnFill: 'balance'
          }}
        >
          {sections.slice(0, 2).map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              <div className="text-center mb-3" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="mb-1"
                  style={getStyle(`section-${idx}-header`, 'header', {
                    fontFamily: 'Brush Script MT, cursive',
                    fontStyle: 'italic'
                  })}
                >
                  {section.title}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-px bg-[#8b4513]" />
                  <div className="w-1 h-1 bg-[#cd212a] rounded-full" />
                  <div className="w-8 h-px bg-[#8b4513]" />
                </div>
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
          <div>Buon Appetito!</div>
        </div>
      </div>
    </div>
  )
}