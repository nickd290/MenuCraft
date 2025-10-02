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

export const PrivateClubTemplate = ({
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
    <div className="w-full h-full bg-white relative">
      {/* Subtle linen texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #e5e5e5 0px, transparent 1px, transparent 2px, #e5e5e5 3px)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Ornate corner flourishes */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#c9a961] opacity-40"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#c9a961] opacity-40"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#c9a961] opacity-40"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#c9a961] opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 p-12 flex flex-col h-full">
        {/* Crest/Shield Logo */}
        {!suppressHeader && (
          <div className="text-center mb-10">
            <div className="inline-flex flex-col items-center">
              {/* Shield crest */}
              <svg width="80" height="90" viewBox="0 0 80 90" className="mb-4">
                {/* Shield outline */}
                <path
                  d="M 40 10 L 10 20 L 10 45 Q 10 65, 40 85 Q 70 65, 70 45 L 70 20 Z"
                  fill="#0a1e2c"
                  stroke="#c9a961"
                  strokeWidth="2"
                />
                {/* Inner gold accent */}
                <path
                  d="M 40 18 L 18 25 L 18 45 Q 18 60, 40 75 Q 62 60, 62 45 L 62 25 Z"
                  fill="#c9a961"
                  opacity="0.2"
                />
                {/* Decorative elements */}
                <line x1="30" y1="40" x2="50" y2="40" stroke="#c9a961" strokeWidth="2"/>
                <line x1="40" y1="30" x2="40" y2="50" stroke="#c9a961" strokeWidth="2"/>
                {/* Crown detail */}
                <path d="M 30 25 L 35 30 L 40 20 L 45 30 L 50 25" stroke="#c9a961" strokeWidth="1.5" fill="none"/>
              </svg>

              {/* Restaurant name with elegant typography */}
              <div
                className="tracking-wider mb-2"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: '0.1em'
                }}
              >
                {name}
              </div>

              {/* Decorative divider */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a961]"></div>
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#c9a961" strokeWidth="1"/>
                  <circle cx="10" cy="10" r="2" fill="#6b1f3e"/>
                </svg>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a961]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Menu sections - centered single column */}
        <div className="flex-1 max-w-2xl mx-auto w-full space-y-8" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              {/* Section header with gold foil effect on navy */}
              <div className="mb-6 text-center" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <div className="inline-block bg-[#0a1e2c] px-8 py-3 relative">
                  {/* Gold foil shimmer effect */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(135deg, transparent 25%, #c9a961 25%, #c9a961 50%, transparent 50%, transparent 75%, #c9a961 75%)',
                      backgroundSize: '4px 4px'
                    }}
                  ></div>
                  <h2
                    className="uppercase tracking-widest relative z-10"
                    style={getStyle(`section-${idx}-header`, 'header', {
                      fontFamily: "'Playfair Display', Georgia, serif",
                      letterSpacing: '0.2em'
                    })}
                  >
                    {section.title}
                  </h2>
                </div>
                {/* Burgundy accent line */}
                <div className="w-32 h-0.5 bg-[#6b1f3e] mx-auto mt-3"></div>
              </div>

              {/* Items */}
              <div className="space-y-5">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="text-center">
                    {/* Item name */}
                    <div
                      className="tracking-wide mb-2"
                      data-el={`item-${idx}-${itemIdx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-${idx}-${itemIdx}-name`, 'body', { fontFamily: "'Playfair Display', Georgia, serif" })}
                    >
                      {item.name}
                    </div>
                    {/* Description */}
                    {item.description && (
                      <p
                        className="leading-relaxed mb-2 max-w-lg mx-auto"
                        data-el={`item-${idx}-${itemIdx}-desc`}
                        data-el-type="text"
                        data-role="description"
                        style={getStyle(`item-${idx}-${itemIdx}-desc`, 'description')}
                      >
                        {item.description}
                      </p>
                    )}
                    {/* Price with decorative elements */}
                    <div className="flex items-center justify-center gap-3">
                      <span>◆</span>
                      <span
                        data-el={`item-${idx}-${itemIdx}-price`}
                        data-el-type="text"
                        data-role="price"
                        style={getStyle(`item-${idx}-${itemIdx}-price`, 'price')}
                      >
                        ${item.price}
                      </span>
                      <span>◆</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pt-6 border-t border-[#c9a961]/30">
          <div
            className="tracking-widest uppercase"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.3em' }}
          >
            Private Members Only
          </div>
        </div>
      </div>
    </div>
  )
}