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

export const MinimalistBrunchTemplate = ({
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
    <div className="w-full h-full bg-white relative overflow-hidden flex items-center justify-center">
      {/* Vertical black border on right side */}
      <div className="absolute top-0 bottom-0 right-0 w-px bg-black" />

      {/* Content */}
      <div className="w-full h-full flex flex-col justify-between py-16 px-20">
        {/* Header */}
        {!suppressHeader && (
          <div className="text-right">
            <h1
              className="text-7xl mb-2 tracking-wide"
              data-el="header-sunday-brunch"
              data-el-type="text"
              data-role="header"
              style={getStyle('header-sunday-brunch', 'header', {
                fontSize: '84px',
                color: '#000',
                fontFamily: 'Playfair Display, Georgia, serif',
                letterSpacing: '0.15em',
                fontWeight: '400',
                lineHeight: '1'
              })}
            >
              SUNDAY BRUNCH
            </h1>

            <h2
              className="text-9xl tracking-[0.2em] -mt-4"
              data-el="header-menu"
              data-el-type="text"
              data-role="header"
              style={getStyle('header-menu', 'header', {
                fontSize: '120px',
                color: '#000',
                fontFamily: 'Playfair Display, Georgia, serif',
                letterSpacing: '0.2em',
                fontWeight: '400',
                lineHeight: '1'
              })}
            >
              MENU
            </h2>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 flex items-center">
          <div className="w-full space-y-8" style={{
            columnCount: columnCount,
            columnGap: '32px',
            columnFill: 'balance'
          }}>
            {sections[0]?.items.map((item, idx) => (
              <div key={idx} className="text-right border-b border-black pb-2" style={{ breakInside: 'avoid' }}>
                <h3
                  className="text-4xl tracking-[0.15em] mb-1"
                  data-el={`item-0-${idx}-name`}
                  data-el-type="text"
                  data-role="body"
                  style={getStyle(`item-0-${idx}-name`, 'body', {
                    fontSize: '36px',
                    color: '#000',
                    fontFamily: 'Playfair Display, Georgia, serif',
                    letterSpacing: '0.15em',
                    fontWeight: '400'
                  })}
                >
                  {item.name}
                </h3>
                {item.description && (
                  <p
                    className="text-base tracking-wide leading-relaxed"
                    data-el={`item-0-${idx}-desc`}
                    data-el-type="text"
                    data-role="description"
                    style={getStyle(`item-0-${idx}-desc`, 'description', {
                      fontSize: '16px',
                      color: '#4a5568',
                      fontFamily: 'Playfair Display, Georgia, serif',
                      letterSpacing: '0.05em',
                      lineHeight: '1.6'
                    })}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Price */}
        <div className="text-right">
          <p
            className="text-5xl tracking-widest"
            data-el="footer-price"
            data-el-type="text"
            data-role="price"
            style={getStyle('footer-price', 'price', {
              fontSize: '48px',
              color: '#000',
              fontFamily: 'Playfair Display, Georgia, serif',
              letterSpacing: '0.2em',
              fontWeight: '400'
            })}
          >
            $26++
          </p>
        </div>
      </div>
    </div>
  )
}
