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

export const LakesideTemplate = ({
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
    <div className="w-full h-full bg-[#e8f4f8] relative overflow-hidden">
      {/* Wave pattern decoration */}
      <div className="absolute top-0 left-0 right-0 h-20 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,30 Q300,50 600,30 T1200,30 L1200,0 L0,0 Z" fill="#1e3a5f"/>
          <path d="M0,50 Q300,70 600,50 T1200,50 L1200,0 L0,0 Z" fill="#1e3a5f" opacity="0.5"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Logo/Header */}
        {!suppressHeader && (
          <div className="text-center mb-8">
            {/* Circular logo with anchor */}
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white border-3 border-[#1e3a5f] flex items-center justify-center mb-3 shadow-md">
                {/* Anchor icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="8" r="3" stroke="#ff7f6f" strokeWidth="2" fill="none"/>
                  <line x1="16" y1="11" x2="16" y2="28" stroke="#1e3a5f" strokeWidth="2"/>
                  <path d="M 8 20 Q 8 28, 16 28 Q 24 28, 24 20" stroke="#1e3a5f" strokeWidth="2" fill="none"/>
                  <line x1="10" y1="14" x2="22" y2="14" stroke="#1e3a5f" strokeWidth="2"/>
                </svg>
              </div>
              {/* Restaurant name */}
              <div
                className="tracking-wide"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                {name}
              </div>
              <div className="w-16 h-0.5 bg-[#ff7f6f] mt-2"></div>
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
              {/* Section header with coral underline */}
              <div className="mb-4" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="uppercase tracking-wide inline-block"
                  style={getStyle(`section-${idx}-header`, 'header', { fontFamily: 'Montserrat, sans-serif' })}
                >
                  {section.title}
                </h2>
                <div className="w-full h-1 bg-gradient-to-r from-[#ff7f6f] via-[#ff7f6f]/50 to-transparent mt-1"></div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    <div className="flex justify-between items-baseline gap-3 mb-1">
                      {/* Item name */}
                      <span
                        className="capitalize"
                        data-el={`item-${idx}-${itemIdx}-name`}
                        data-el-type="text"
                        data-role="body"
                        style={getStyle(`item-${idx}-${itemIdx}-name`, 'body', { fontFamily: "'Pacifico', cursive" })}
                      >
                        {item.name}
                      </span>
                      {/* Price with coral dot */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-[#ff7f6f]/30 min-w-[20px]"></div>
                        <span
                          className="whitespace-nowrap"
                          data-el={`item-${idx}-${itemIdx}-price`}
                          data-el-type="text"
                          data-role="price"
                          style={getStyle(`item-${idx}-${itemIdx}-price`, 'price')}
                        >
                          ${item.price}
                        </span>
                      </div>
                    </div>
                    {/* Description */}
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

        {/* Footer wave */}
        <div className="text-center mt-6 pt-4">
          <div className="tracking-wider uppercase">
            Waterfront Dining
          </div>
        </div>
      </div>
    </div>
  )
}