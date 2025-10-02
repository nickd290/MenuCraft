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

export const MountainLodgeTemplate = ({
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
    <div className="w-full h-full bg-[#f5ede0] relative overflow-hidden">
      {/* Wood grain texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #8b7355 0px, #a0826d 1px, #8b7355 2px)',
          backgroundSize: '20px 100%'
        }}
      />

      {/* Pine tree silhouettes in corners */}
      <div className="absolute top-4 left-4 opacity-10">
        <svg width="40" height="60" viewBox="0 0 40 60">
          <polygon points="20,5 10,25 15,25 5,40 12,40 0,60 40,60 28,40 35,40 25,25 30,25" fill="#2d5016"/>
        </svg>
      </div>
      <div className="absolute top-4 right-4 opacity-10">
        <svg width="40" height="60" viewBox="0 0 40 60">
          <polygon points="20,5 10,25 15,25 5,40 12,40 0,60 40,60 28,40 35,40 25,25 30,25" fill="#2d5016"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Logo/Header */}
        {!suppressHeader && (
          <div className="text-center mb-8">
            {/* Rustic badge with mountain peaks */}
            <div className="inline-flex flex-col items-center">
              <div className="relative w-24 h-24 mb-3">
                {/* Badge background */}
                <div className="absolute inset-0 rounded-full bg-[#2d5016] border-4 border-[#d4621f] shadow-lg"></div>
                {/* Mountain peaks */}
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                  <polygon points="30,60 50,30 70,60" fill="#f5ede0"/>
                  <polygon points="40,70 60,40 80,70" fill="#f5ede0" opacity="0.8"/>
                  {/* Pine trees */}
                  <polygon points="50,55 47,60 53,60" fill="#2d5016"/>
                  <polygon points="50,52 46,58 54,58" fill="#2d5016"/>
                </svg>
              </div>
              {/* Restaurant name */}
              <div
                className="tracking-wide uppercase"
                style={{
                  fontFamily: 'Georgia, serif',
                  textShadow: '1px 1px 0px rgba(212, 98, 31, 0.3)'
                }}
              >
                {name}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-0.5 bg-[#d4621f]"></div>
                <span>❋</span>
                <div className="w-8 h-0.5 bg-[#d4621f]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Menu sections */}
        <div className="flex-1 space-y-6" style={{
          columnCount: columnCount,
          columnGap: '32px',
          columnFill: 'balance'
        }}>
          {sections.map((section, idx) => (
            <div key={idx} data-el={`section-${idx}`} data-el-type="group" style={{ breakInside: 'avoid' }}>
              {/* Section header - forest green with rustic divider */}
              <div className="mb-4" data-el={`section-${idx}-header`} data-el-type="text" data-role="header">
                <div className="bg-[#2d5016] px-4 py-2 inline-block shadow-md">
                  <h2
                    className="uppercase tracking-wider"
                    style={getStyle(`section-${idx}-header`, 'header')}
                  >
                    {section.title}
                  </h2>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-[#d4621f] via-[#d4621f]/50 to-transparent mt-2"></div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-l-2 border-[#d4621f]/30 pl-3">
                    <div className="flex justify-between items-baseline gap-3 mb-1">
                      {/* Item name */}
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

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t-2 border-[#2d5016]/20">
          <div className="tracking-wider uppercase">
            Mountain Fresh Cuisine
          </div>
        </div>
      </div>
    </div>
  )
}