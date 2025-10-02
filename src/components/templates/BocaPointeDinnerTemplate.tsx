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

export const BocaPointeDinnerTemplate = ({
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
    <div className="w-full h-full bg-white relative overflow-hidden" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header - Logo */}
      {!suppressHeader && (
        <div className="text-center pt-8 pb-6">
          <div className="flex flex-col items-center">
            <p
              className="text-sm tracking-[0.3em] mb-1"
              data-el="header-dinner-at"
              data-el-type="text"
              data-role="header"
              style={getStyle('header-dinner-at', 'header', { fontSize: '14px', letterSpacing: '0.3em' })}
            >
              DINNER AT
            </p>
            <div className="relative">
              <p
                className="text-2xl italic mb-0 pb-0 leading-none"
                data-el="header-the"
                data-el-type="text"
                data-role="header"
                style={getStyle('header-the', 'header', {
                  fontSize: '40px',
                  fontStyle: 'italic',
                  fontFamily: 'Brush Script MT, cursive',
                  lineHeight: '1'
                })}
              >
                the
              </p>
              <p
                className="text-6xl font-bold tracking-wider -mt-2"
                data-el="header-pointe"
                data-el-type="text"
                data-role="header"
                style={getStyle('header-pointe', 'header', {
                  fontSize: '72px',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  fontFamily: 'Georgia, serif'
                })}
              >
                POINTE
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - 3 Column Layout */}
      <div className="px-6 grid grid-cols-3 gap-4 text-[9px]">
        {/* Left Column */}
        <div className="space-y-4">
          {/* SMALL PLATES */}
          <div data-el="section-0" data-el-type="group">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-2 pb-1 border-b border-black"
              data-el="section-0-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-0-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              SMALL PLATES
            </h2>
            <div className="space-y-2">
              {sections[0]?.items.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span
                      className="font-semibold flex-1"
                      data-el={`item-0-${idx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-0-${idx}-name`, 'body', { fontWeight: '600' })}
                    >
                      {item.name}
                    </span>
                    <span
                      className="font-bold ml-2"
                      data-el={`item-0-${idx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-0-${idx}-price`, 'price', { fontWeight: 'bold' })}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="text-[8px] leading-tight"
                      data-el={`item-0-${idx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-0-${idx}-desc`, 'description', { fontSize: '8px' })}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SHARABLES */}
          <div data-el="section-1" data-el-type="group" className="border-2 border-black p-2">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-2"
              data-el="section-1-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-1-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              SHARABLES
            </h2>
            <div className="space-y-2">
              {sections[1]?.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span
                      className="font-semibold flex-1"
                      data-el={`item-1-${idx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-1-${idx}-name`, 'body', { fontWeight: '600' })}
                    >
                      {item.name}
                    </span>
                    <span
                      className="font-bold ml-2"
                      data-el={`item-1-${idx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-1-${idx}-price`, 'price', { fontWeight: 'bold' })}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="text-[8px] leading-tight"
                      data-el={`item-1-${idx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-1-${idx}-desc`, 'description', { fontSize: '8px' })}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BIG PLATES */}
          <div data-el="section-2" data-el-type="group">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-2 pb-1 border-b border-black"
              data-el="section-2-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-2-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              BIG PLATES
            </h2>
            <div className="space-y-2">
              {sections[2]?.items.slice(0, 6).map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span
                      className="font-semibold flex-1"
                      data-el={`item-2-${idx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-2-${idx}-name`, 'body', { fontWeight: '600' })}
                    >
                      {item.name}
                    </span>
                    <span
                      className="font-bold ml-2"
                      data-el={`item-2-${idx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-2-${idx}-price`, 'price', { fontWeight: 'bold' })}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="text-[8px] leading-tight"
                      data-el={`item-2-${idx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-2-${idx}-desc`, 'description', { fontSize: '8px' })}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HOUSE SIDES */}
          <div data-el="section-3" data-el-type="group" className="border-2 border-black p-2">
            <h2
              className="text-xs font-bold tracking-[0.2em] mb-1"
              data-el="section-3-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-3-header', 'header', { fontSize: '11px', letterSpacing: '0.2em' })}
            >
              HOUSE SIDES 6
            </h2>
            <div className="grid grid-cols-1 gap-0.5">
              {sections[3]?.items.slice(0, 8).map((item, idx) => (
                <p
                  key={idx}
                  data-el={`item-3-${idx}-name`}
                  data-el-type="text"
                  data-role="body"
                  style={getStyle(`item-3-${idx}-name`, 'body')}
                >
                  {item.name}
                </p>
              ))}
            </div>
          </div>

          {/* SOUP */}
          <div data-el="section-4" data-el-type="group" className="border-2 border-black p-2">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-1"
              data-el="section-4-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-4-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              SOUP
            </h2>
            <div className="space-y-0.5">
              {sections[4]?.items.map((item, idx) => (
                <p
                  key={idx}
                  data-el={`item-4-${idx}-name`}
                  data-el-type="text"
                  data-role="body"
                  style={getStyle(`item-4-${idx}-name`, 'body')}
                >
                  {item.name} {item.price && `${item.price}`}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          {/* GREENS */}
          <div data-el="section-5" data-el-type="group">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-2 pb-1 border-b border-black"
              data-el="section-5-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-5-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              GREENS
            </h2>
            <div className="space-y-2">
              {sections[5]?.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span
                      className="font-semibold flex-1"
                      data-el={`item-5-${idx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-5-${idx}-name`, 'body', { fontWeight: '600' })}
                    >
                      {item.name}
                    </span>
                    <span
                      className="font-bold ml-2"
                      data-el={`item-5-${idx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-5-${idx}-price`, 'price', { fontWeight: 'bold' })}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="text-[8px] leading-tight"
                      data-el={`item-5-${idx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-5-${idx}-desc`, 'description', { fontSize: '8px' })}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HANDHELDS */}
          <div data-el="section-6" data-el-type="group">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-2 pb-1 border-b border-black"
              data-el="section-6-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-6-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              HANDHELDS
            </h2>
            <div className="space-y-2">
              {sections[6]?.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span
                      className="font-semibold flex-1"
                      data-el={`item-6-${idx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-6-${idx}-name`, 'body', { fontWeight: '600' })}
                    >
                      {item.name}
                    </span>
                    <span
                      className="font-bold ml-2"
                      data-el={`item-6-${idx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-6-${idx}-price`, 'price', { fontWeight: 'bold' })}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="text-[8px] leading-tight"
                      data-el={`item-6-${idx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-6-${idx}-desc`, 'description', { fontSize: '8px' })}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CHOPHOUSE */}
          <div data-el="section-7" data-el-type="group" className="border-2 border-black p-2">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-2"
              data-el="section-7-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-7-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              CHOPHOUSE
            </h2>
            <div className="space-y-2">
              {sections[7]?.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span
                      className="font-semibold flex-1"
                      data-el={`item-7-${idx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-7-${idx}-name`, 'body', { fontWeight: '600' })}
                    >
                      {item.name}
                    </span>
                    <span
                      className="font-bold ml-2"
                      data-el={`item-7-${idx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-7-${idx}-price`, 'price', { fontWeight: 'bold' })}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="text-[8px] leading-tight"
                      data-el={`item-7-${idx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-7-${idx}-desc`, 'description', { fontSize: '8px' })}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* WHEN IN ROME */}
          <div data-el="section-8" data-el-type="group">
            <h2
              className="text-xs font-bold tracking-[0.3em] mb-2 pb-1 border-b border-black"
              data-el="section-8-header"
              data-el-type="text"
              data-role="header"
              style={getStyle('section-8-header', 'header', { fontSize: '11px', letterSpacing: '0.3em' })}
            >
              WHEN IN ROME
            </h2>
            <div className="space-y-2">
              {sections[8]?.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span
                      className="font-semibold flex-1"
                      data-el={`item-8-${idx}-name`}
                      data-el-type="text"
                      data-role="body"
                      style={getStyle(`item-8-${idx}-name`, 'body', { fontWeight: '600' })}
                    >
                      {item.name}
                    </span>
                    <span
                      className="font-bold ml-2"
                      data-el={`item-8-${idx}-price`}
                      data-el-type="text"
                      data-role="price"
                      style={getStyle(`item-8-${idx}-price`, 'price', { fontWeight: 'bold' })}
                    >
                      {item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p
                      className="text-[8px] leading-tight"
                      data-el={`item-8-${idx}-desc`}
                      data-el-type="text"
                      data-role="description"
                      style={getStyle(`item-8-${idx}-desc`, 'description', { fontSize: '8px' })}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-6 right-6">
        <div className="flex items-center justify-between text-[7px]">
          <div className="flex-1">
            <p
              data-el="footer-legend"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-legend', 'description', { fontSize: '7px' })}
            >
              v Vegan | gf Gluten Free | veg Vegetarian | agf Available Gluten Free
            </p>
            <p
              className="mt-1"
              data-el="footer-disclaimer"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-disclaimer', 'description', { fontSize: '7px' })}
            >
              AN $8 SHARE CHARGE WILL BE APPLIED TO ALL SHARED PLATES
            </p>
            <p
              className="mt-0.5"
              data-el="footer-warning"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-warning', 'description', { fontSize: '7px' })}
            >
              Consuming raw or undercooked animal products could increase your risk of food borne illness.
            </p>
          </div>
          <div className="text-right">
            <p
              className="italic"
              data-el="footer-club"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-club', 'description', { fontSize: '10px', fontStyle: 'italic', fontFamily: 'Brush Script MT, cursive' })}
            >
              the Club at
            </p>
            <p
              className="font-bold text-sm"
              data-el="footer-boca-pointe"
              data-el-type="text"
              data-role="description"
              style={getStyle('footer-boca-pointe', 'description', { fontSize: '14px', fontWeight: 'bold' })}
            >
              Boca Pointe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
