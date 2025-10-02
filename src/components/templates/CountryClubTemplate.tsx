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

export const CountryClubTemplate = ({
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
    <div className="w-full h-full bg-[#d4b896] p-8 relative">
      {/* Logo badge at top */}
      {!suppressHeader && (
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center">
            {/* Circular badge */}
            <div className="w-24 h-24 rounded-full bg-[#2d4f6d] border-4 border-[#f5f1e8] flex items-center justify-center mb-3 shadow-lg">
              {/* Golf ball icon */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#f5f1e8" stroke="#2d4f6d" strokeWidth="1"/>
                {/* Dimples */}
                <circle cx="14" cy="14" r="1.5" fill="#c9b896"/>
                <circle cx="20" cy="12" r="1.5" fill="#c9b896"/>
                <circle cx="26" cy="14" r="1.5" fill="#c9b896"/>
                <circle cx="12" cy="20" r="1.5" fill="#c9b896"/>
                <circle cx="20" cy="20" r="1.5" fill="#c9b896"/>
                <circle cx="28" cy="20" r="1.5" fill="#c9b896"/>
                <circle cx="14" cy="26" r="1.5" fill="#c9b896"/>
                <circle cx="20" cy="28" r="1.5" fill="#c9b896"/>
                <circle cx="26" cy="26" r="1.5" fill="#c9b896"/>
              </svg>
            </div>
            {/* Club name */}
            <div
              className="tracking-widest uppercase text-center"
              style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.15em', lineHeight: '1.4' }}
            >
              {name.split(' ').map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu sections */}
      <div className="space-y-6" style={{
        columnCount: columnCount,
        columnGap: '32px',
        columnFill: 'balance'
      }}>
        {sections.map((section, idx) => (
          <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
            {/* Section header - navy block with rounded corners */}
            <div className="bg-[#2d4f6d] rounded-lg px-4 py-2 mb-3" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
              <h2
                className="tracking-wider uppercase"
                style={getStyle(`section-${idx}-header`, 'header')}
              >
                {section.title}
              </h2>
            </div>

            {/* Items */}
            <div className="space-y-3 px-2">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx}>
                  <div className="flex justify-between items-baseline gap-3 mb-1">
                    {/* Item name - bold navy */}
                    <span
                      className="uppercase tracking-wide"
                      data-el={`item-${idx}-${itemIdx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-${idx}-${itemIdx}-name`, 'body')}
                    >
                      {item.name}
                    </span>
                    {/* Price */}
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
    </div>
  )
}