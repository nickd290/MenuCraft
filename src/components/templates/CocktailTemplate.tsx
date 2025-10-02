import { MenuTemplate } from '@/data/templates'
import { DessertLogo } from '../logos/DessertLogo'
import { TextStyle, ElementTransform } from '@/types/doc'
import { textStyleToCSS, transformToCSS } from '@/utils/styleHelpers'

interface TemplateProps {
  template: MenuTemplate
  styleOverrides?: Record<string, Partial<TextStyle>>
  roleStyles?: Record<string, Partial<TextStyle>>
  transforms?: Record<string, ElementTransform>
}

export const CocktailTemplate = ({
  template,
  styleOverrides = {},
  roleStyles = {},
  transforms = {}
}: TemplateProps) => {
  const { sections } = template

  const getStyle = (elementId: string, role?: string, baseStyle: React.CSSProperties = {}) => {
    const roleStyle = role && roleStyles[role] ? textStyleToCSS(roleStyles[role]) : {}
    const override = styleOverrides[elementId] ? textStyleToCSS(styleOverrides[elementId]) : {}
    const transform = transforms[elementId] ? transformToCSS(transforms[elementId]) : {}
    return { ...baseStyle, ...roleStyle, ...override, ...transform }
  }

  return (
    <div className="w-full h-full bg-[#f5ebe0] p-8 relative" style={{
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(197, 149, 116, 0.05) 0%, transparent 50%)'
    }}>
      {/* Elegant border */}
      <div className="absolute inset-6 border border-[#c59574]/30" />
      <div className="absolute inset-7 border border-[#c59574]/20" style={{
        borderRadius: '2px'
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="tracking-[0.3em] uppercase mb-2">
            Signature
          </div>
          <h1 className="mb-2" style={{
            fontFamily: 'Brush Script MT, cursive',
            fontStyle: 'italic'
          }}>
            Cocktails
          </h1>
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-6 h-px bg-[#c59574]" />
            <div>❋</div>
            <div className="w-6 h-px bg-[#c59574]" />
          </div>
        </div>

        {/* Menu sections */}
        <div className="flex-1 space-y-5">
          {sections.slice(0, 2).map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group">
              <div className="text-center mb-3" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <h2
                  className="tracking-[0.25em] uppercase"
                  style={getStyle(`section-${idx}-header`, 'header')}
                >
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.items.slice(0, 3).map((item, itemIdx) => (
                  <div key={itemIdx} className="px-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        data-el={`item-${idx}-${itemIdx}-name`}
                        data-el-type="text"
                        data-role="body"
                        style={getStyle(`item-${idx}-${itemIdx}-name`, 'body', {
                          fontFamily: 'Brush Script MT, cursive',
                          fontStyle: 'italic'
                        })}
                      >
                        {item.name}
                      </span>
                      <div className="flex-1 mx-2 mb-1" style={{
                        borderBottom: '1px dotted rgba(197, 149, 116, 0.4)'
                      }} />
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

        {/* Footer ornament */}
        <div className="text-center mt-4">
          <div>✦</div>
        </div>
      </div>
    </div>
  )
}