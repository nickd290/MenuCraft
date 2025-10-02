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

export const GrandezzaWineListTemplate = ({
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
    <div className="w-full h-full bg-white relative overflow-hidden flex items-center justify-center p-8">
      {/* Rounded border frame */}
      <div
        className="w-full h-full rounded-[40px] border-8 p-12 flex flex-col"
        style={{ borderColor: '#1e3a5f' }}
      >
        {/* Header */}
        {!suppressHeader && (
          <div className="text-center mb-6">
            <p
              className="text-sm tracking-wider mb-3"
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
              className="text-9xl mb-4"
              data-el="header-wine-list"
              data-el-type="text"
              data-role="header"
              style={getStyle('header-wine-list', 'header', {
                fontSize: '108px',
                color: '#1e3a5f',
                fontFamily: 'Brush Script MT, cursive',
                fontStyle: 'italic',
                lineHeight: '1',
                fontWeight: 'normal'
              })}
            >
              Wine List
            </h1>

            {/* Underline decoration */}
            <div className="w-2/3 h-px bg-gray-400 mx-auto" />
          </div>
        )}

        {/* Wine sections - 2 column layout */}
        <div className="flex-1 grid grid-cols-2 gap-8 text-sm overflow-hidden" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {/* Left column */}
          <div className="space-y-5">
            {sections.slice(0, Math.ceil(sections.length / 2)).map((section, idx) => (
              <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
                <h2
                  className="text-lg mb-2"
                  data-el={`section-${idx}-header`}
                  data-el-type="text"
                  data-role="header"
                  style={getStyle(`section-${idx}-header`, 'header', {
                    fontSize: '18px',
                    color: '#1e3a5f',
                    fontFamily: 'Georgia, serif',
                    fontWeight: '600'
                  })}
                >
                  {section.title}
                </h2>

                <div className="space-y-1.5">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between items-baseline">
                      <div className="flex-1 pr-2">
                        <span
                          data-el={`item-${idx}-${itemIdx}-name`}
                          data-el-type="text"
                          data-role="body"
                          style={getStyle(`item-${idx}-${itemIdx}-name`, 'body', {
                            fontSize: '12px',
                            color: '#1e3a5f',
                            fontFamily: 'Georgia, serif',
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em'
                          })}
                        >
                          {item.name}
                        </span>
                        {item.description && (
                          <p
                            className="text-[10px] leading-tight"
                            data-el={`item-${idx}-${itemIdx}-desc`}
                            data-el-type="text"
                            data-role="description"
                            style={getStyle(`item-${idx}-${itemIdx}-desc`, 'description', {
                              fontSize: '10px',
                              color: '#4a5568',
                              fontFamily: 'Georgia, serif'
                            })}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-right whitespace-nowrap"
                        data-el={`item-${idx}-${itemIdx}-price`}
                        data-el-type="text"
                        data-role="price"
                        style={getStyle(`item-${idx}-${itemIdx}-price`, 'price', {
                          fontSize: '12px',
                          color: '#1e3a5f',
                          fontFamily: 'Georgia, serif'
                        })}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {sections.slice(Math.ceil(sections.length / 2)).map((section, idx) => {
              const actualIdx = idx + Math.ceil(sections.length / 2)
              return (
                <div key={actualIdx} data-el={`section-${actualIdx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
                  <h2
                    className="text-lg mb-2"
                    data-el={`section-${actualIdx}-header`}
                    data-el-type="text"
                    data-role="header"
                    style={getStyle(`section-${actualIdx}-header`, 'header', {
                      fontSize: '18px',
                      color: '#1e3a5f',
                      fontFamily: 'Georgia, serif',
                      fontWeight: '600'
                    })}
                  >
                    {section.title}
                  </h2>

                  <div className="space-y-1.5">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between items-baseline">
                        <div className="flex-1 pr-2">
                          <span
                            data-el={`item-${actualIdx}-${itemIdx}-name`}
                            data-el-type="text"
                            data-role="body"
                            style={getStyle(`item-${actualIdx}-${itemIdx}-name`, 'body', {
                              fontSize: '12px',
                              color: '#1e3a5f',
                              fontFamily: 'Georgia, serif',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em'
                            })}
                          >
                            {item.name}
                          </span>
                          {item.description && (
                            <p
                              className="text-[10px] leading-tight"
                              data-el={`item-${actualIdx}-${itemIdx}-desc`}
                              data-el-type="text"
                              data-role="description"
                              style={getStyle(`item-${actualIdx}-${itemIdx}-desc`, 'description', {
                                fontSize: '10px',
                                color: '#4a5568',
                                fontFamily: 'Georgia, serif'
                              })}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span
                          className="text-right whitespace-nowrap"
                          data-el={`item-${actualIdx}-${itemIdx}-price`}
                          data-el-type="text"
                          data-role="price"
                          style={getStyle(`item-${actualIdx}-${itemIdx}-price`, 'price', {
                            fontSize: '12px',
                            color: '#1e3a5f',
                            fontFamily: 'Georgia, serif'
                          })}
                        >
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
