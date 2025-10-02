import { MenuTemplate } from '@/data/templates'
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

export const GrandezzaBrunchTemplate = ({
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

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      {/* Colorful painted border */}
      {!suppressBorder && (
      <div className="absolute inset-0 pointer-events-none">
        {/* Top border - colorful paint strokes */}
        <div className="absolute top-0 left-0 right-0 h-8" style={{
          background: 'linear-gradient(to right, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
          opacity: 0.7
        }} />

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{
          background: 'linear-gradient(to left, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
          opacity: 0.7
        }} />

        {/* Left border */}
        <div className="absolute top-0 bottom-0 left-0 w-8" style={{
          background: 'linear-gradient(to bottom, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
          opacity: 0.7
        }} />

        {/* Right border */}
        <div className="absolute top-0 bottom-0 right-0 w-8" style={{
          background: 'linear-gradient(to top, #dc2626 0%, #dc2626 5%, #ea580c 5%, #ea580c 10%, #ca8a04 10%, #ca8a04 15%, #65a30d 15%, #65a30d 20%, #0891b2 20%, #0891b2 25%, #3b82f6 25%, #3b82f6 30%, #7c3aed 30%, #7c3aed 35%, #dc2626 35%, #dc2626 40%, #ea580c 40%, #ea580c 45%, #ca8a04 45%, #ca8a04 50%, #65a30d 50%, #65a30d 55%, #0891b2 55%, #0891b2 60%, #3b82f6 60%, #3b82f6 65%, #7c3aed 65%, #7c3aed 70%, #dc2626 70%, #dc2626 75%, #ea580c 75%, #ea580c 80%, #ca8a04 80%, #ca8a04 85%, #65a30d 85%, #65a30d 90%, #0891b2 90%, #0891b2 95%, #3b82f6 95%, #3b82f6 100%)',
          opacity: 0.7
        }} />
      </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-8 py-8">
        {/* Header */}
        {!suppressHeader && (
        <div className="text-center mb-8">
          <p
            className="text-sm tracking-wider mb-2"
            data-el="header-club"
            data-el-type="text"
            data-role="header"
            style={getStyle('header-club', 'header', {
              fontSize: '14px',
              letterSpacing: '0.2em',
              color: '#1e3a5f',
              fontFamily: 'Georgia, serif'
            })}
          >
            THE CLUB AT GRANDÉZZA
          </p>

          <h1
            className="text-8xl mb-2"
            data-el="header-sunday"
            data-el-type="text"
            data-role="header"
            style={getStyle('header-sunday', 'header', {
              fontSize: '96px',
              color: '#4a7c9e',
              fontFamily: 'Brush Script MT, cursive',
              fontStyle: 'italic',
              lineHeight: '1'
            })}
          >
            Sunday
          </h1>

          <h2
            className="text-8xl mb-1"
            data-el="header-brunch"
            data-el-type="text"
            data-role="header"
            style={getStyle('header-brunch', 'header', {
              fontSize: '96px',
              color: '#4a7c9e',
              fontFamily: 'Brush Script MT, cursive',
              fontStyle: 'italic',
              lineHeight: '1'
            })}
          >
            Brunch
          </h2>

          <p
            className="text-xl font-semibold tracking-wider"
            data-el="header-location"
            data-el-type="text"
            data-role="header"
            style={getStyle('header-location', 'header', {
              fontSize: '20px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: '#1e3a5f',
              fontFamily: 'Georgia, serif'
            })}
          >
            AT GRANDEZZA
          </p>

          {/* "the juice bar" script */}
          <p
            className="text-3xl mt-2 mb-1"
            data-el="header-juice-bar"
            data-el-type="text"
            data-role="header"
            style={getStyle('header-juice-bar', 'header', {
              fontSize: '32px',
              color: '#e91e63',
              fontFamily: 'Brush Script MT, cursive',
              fontStyle: 'italic'
            })}
          >
            - the juice bar -
          </p>
        </div>
        )}

        {/* Menu Sections */}
        <div className="space-y-4 text-sm" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              <div className="mb-2">
                <h3
                  className="text-base font-bold tracking-wide inline-block mr-3"
                  data-el={`section-${idx}-header`}
                  data-el-type="text"
                  data-role="header"
                  style={getStyle(`section-${idx}-header`, 'header', {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    color: '#1e3a5f',
                    fontFamily: 'Georgia, serif'
                  })}
                >
                  {section.title}
                </h3>
              </div>

              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    <div className="flex justify-between items-baseline">
                      <span
                        className="font-semibold uppercase tracking-wide flex-1"
                        data-el={`item-${idx}-${itemIdx}-name`}
                        data-el-type="text"
                        data-role="body"
                        style={getStyle(`item-${idx}-${itemIdx}-name`, 'body', {
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: '#1e3a5f',
                          fontFamily: 'Georgia, serif',
                          fontSize: '13px'
                        })}
                      >
                        {item.name}
                      </span>
                      {item.price && (
                        <span
                          className="font-bold ml-3"
                          data-el={`item-${idx}-${itemIdx}-price`}
                          data-el-type="text"
                          data-role="price"
                          style={getStyle(`item-${idx}-${itemIdx}-price`, 'price', {
                            fontWeight: 'bold',
                            color: '#1e3a5f',
                            fontFamily: 'Georgia, serif'
                          })}
                        >
                          ${item.price}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p
                        className="text-xs leading-relaxed uppercase tracking-wide"
                        data-el={`item-${idx}-${itemIdx}-desc`}
                        data-el-type="text"
                        data-role="description"
                        style={getStyle(`item-${idx}-${itemIdx}-desc`, 'description', {
                          fontSize: '11px',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          lineHeight: '1.6',
                          fontFamily: 'Georgia, serif'
                        })}
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
        <div className="mt-8 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span
              data-el="footer-vegetarian"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-vegetarian', 'description', { fontSize: '11px', fontFamily: 'Georgia, serif' })}
            >
              🌱 VEGETARIAN
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              data-el="footer-gf"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-gf', 'description', { fontSize: '11px', fontFamily: 'Georgia, serif' })}
            >
              ⓖ GLUTEN-FREE
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              data-el="footer-vegan"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-vegan', 'description', { fontSize: '11px', fontFamily: 'Georgia, serif' })}
            >
              Ⓥ VEGAN
            </span>
          </div>
        </div>

        <p
          className="text-center text-xs mt-4"
          data-el="footer-warning"
          data-el-type="text"
          data-role="description"
          style={getStyle('footer-warning', 'description', {
            fontSize: '10px',
            color: '#4a5568',
            fontFamily: 'Georgia, serif'
          })}
        >
          *Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase your risk of foodborne illness*.
        </p>
      </div>
    </div>
  )
}
