import { MenuTemplate } from '@/data/templates'
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

export const CocktailBarTemplate = ({
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
    <div className="w-full h-full bg-[#f5f1e8] relative">
      {/* Decorative rope/burlap band */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#c9a961] to-[#d4b896] opacity-40"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #c9a961 0px, #d4b896 2px, #c9a961 4px)',
          backgroundSize: '4px 100%'
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Logo/Header */}
        {!suppressHeader && (
          <div className="text-center mb-6 mt-4">
            <div className="relative inline-block">
              {/* Large outline "DRINK" text */}
              <div
                className="tracking-wider"
                style={{
                  fontFamily: 'Georgia, serif',
                  WebkitTextStroke: '2px #2d4f6d',
                  letterSpacing: '0.15em'
                }}
              >
                DRINK
              </div>
              {/* Script "menu" overlay */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                menu
              </div>
            </div>
            {/* Restaurant name */}
            <div className="mt-4 tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>
              {name}
            </div>
          </div>
        )}

        {/* Menu sections */}
        <div className="flex-1 space-y-8" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              {/* Section header - script font in purple/magenta */}
              <h2
                className="mb-4 lowercase"
                data-el={`section-${idx}-header`}
                data-el-type="text"
                data-role="header"
                style={getStyle(`section-${idx}-header`, 'header', { fontFamily: "'Pacifico', cursive" })}
              >
                {section.title.toLowerCase()}
              </h2>

              {/* Items */}
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      {/* Item name - bold teal */}
                      <div
                        className="uppercase tracking-wide mb-1"
                        data-el={`item-${idx}-${itemIdx}-name`}
                        data-el-type="text"
                        data-role="body"
                        style={getStyle(`item-${idx}-${itemIdx}-name`, 'body')}
                      >
                        {item.name}
                      </div>
                      {/* Description */}
                      {item.description && (
                        <div
                          className="leading-relaxed"
                          data-el={`item-${idx}-${itemIdx}-desc`}
                          data-el-type="text"
                          data-role="description"
                          style={getStyle(`item-${idx}-${itemIdx}-desc`, 'description')}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                    {/* Price */}
                    <div
                      className="whitespace-nowrap"
                      data-el={`item-${idx}-${itemIdx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-${idx}-${itemIdx}-price`, 'price')}
                    >
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-[#c9a961]/30">
          <div className="flex items-center justify-center gap-3">
            <span>★</span>
            <div
              className="tracking-widest uppercase"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}
            >
              THE CLUB AT GRANDÉZZA
            </div>
            <span>★</span>
          </div>
        </div>
      </div>
    </div>
  )
}