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

export const KidsMenuTemplate = ({
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
    <div
      className="w-full h-full relative overflow-hidden flex flex-col items-center justify-between py-12 px-16"
      style={{ backgroundColor: '#fcf8e8', fontFamily: 'Georgia, serif' }}
    >
      {/* Title */}
      {!suppressHeader && (
        <div className="text-center">
          <h1
            className="text-8xl font-bold mb-4"
            data-el="header-title"
            data-el-type="text"
            data-role="header"
            style={getStyle('header-title', 'header', {
              fontSize: '96px',
              fontWeight: 'bold',
              color: '#2b4c7e',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.1'
            })}
          >
            Kids Menu
          </h1>

          {/* Wavy decoration */}
          <svg width="400" height="30" viewBox="0 0 400 30" className="mx-auto">
            <path
              d="M 0 15 Q 20 5, 40 15 T 80 15 T 120 15 T 160 15 T 200 15 T 240 15 T 280 15 T 320 15 T 360 15 T 400 15"
              fill="none"
              stroke="#e8b4b8"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-8 w-full max-w-2xl" style={{
        columnCount: columnCount,
        columnGap: '32px',
        columnFill: 'balance'
      }}>
        {sections[0]?.items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center"
            style={{ breakInside: 'avoid' }}
            data-el={`item-0-${idx}`}
            data-el-type="text"
            data-role="body"
          >
            <span
              className="text-5xl"
              data-el={`item-0-${idx}-name`}
              data-el-type="text"
              data-role="body"
              style={getStyle(`item-0-${idx}-name`, 'body', {
                fontSize: '48px',
                color: '#2b4c7e',
                fontFamily: 'Georgia, serif'
              })}
            >
              {item.name}
            </span>
            <span
              className="text-5xl font-bold"
              data-el={`item-0-${idx}-price`}
              data-el-type="text"
              data-role="price"
              style={getStyle(`item-0-${idx}-price`, 'price', {
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#2b4c7e',
                fontFamily: 'Georgia, serif'
              })}
            >
              ${item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="text-center max-w-3xl">
        <p
          className="text-2xl"
          data-el="footer-description"
          data-el-type="text"
          data-role="description"
          style={getStyle('footer-description', 'description', {
            fontSize: '24px',
            color: '#2b4c7e',
            fontFamily: 'Georgia, serif',
            lineHeight: '1.6'
          })}
        >
          Served with French Fries or Potato Chips, a Fountain Soda,
          <br />
          and Ice cream
        </p>
      </div>

      {/* Chef Illustrations */}
      <div className="flex justify-center gap-16 mt-8">
        {/* Girl Chef */}
        <svg width="120" height="150" viewBox="0 0 120 150">
          {/* Chef hat */}
          <ellipse cx="60" cy="35" rx="35" ry="25" fill="#e5e5e5" />
          <circle cx="60" cy="35" r="30" fill="#f0f0f0" />

          {/* Head */}
          <circle cx="60" cy="65" r="25" fill="#f4a582" />

          {/* Hair */}
          <path d="M 40 55 Q 35 50, 40 45 Q 45 40, 50 45 L 55 55" fill="#8B4513" />
          <path d="M 80 55 Q 85 50, 80 45 Q 75 40, 70 45 L 65 55" fill="#8B4513" />

          {/* Eyes - closed/happy */}
          <path d="M 50 62 Q 52 65, 54 62" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <path d="M 66 62 Q 68 65, 70 62" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />

          {/* Smile */}
          <path d="M 50 72 Q 60 78, 70 72" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />

          {/* Body - apron */}
          <rect x="40" y="85" width="40" height="50" fill="#e5e5e5" rx="5" />
          <rect x="42" y="87" width="36" height="46" fill="#8B008B" rx="4" />

          {/* Red bow */}
          <circle cx="60" cy="87" r="4" fill="#DC143C" />

          {/* Arms */}
          <rect x="25" y="95" width="12" height="30" fill="#DC143C" rx="6" />
          <rect x="83" y="95" width="12" height="30" fill="#DC143C" rx="6" />

          {/* Left hand - holding spoon */}
          <ellipse cx="31" cy="128" rx="6" ry="8" fill="#f4a582" />
          <rect x="26" y="115" width="3" height="15" fill="#666" rx="1.5" />
          <ellipse cx="27.5" cy="113" rx="5" ry="4" fill="#666" />

          {/* Right hand - holding fork */}
          <ellipse cx="89" cy="128" rx="6" ry="8" fill="#f4a582" />
          <g transform="translate(90, 115)">
            <rect x="-1.5" y="0" width="3" height="15" fill="#666" />
            <rect x="-4" y="-4" width="2" height="8" fill="#666" rx="1" />
            <rect x="-1" y="-4" width="2" height="8" fill="#666" rx="1" />
            <rect x="2" y="-4" width="2" height="8" fill="#666" rx="1" />
          </g>
        </svg>

        {/* Boy Chef */}
        <svg width="120" height="150" viewBox="0 0 120 150">
          {/* Chef hat */}
          <ellipse cx="60" cy="35" rx="35" ry="25" fill="#e5e5e5" />
          <circle cx="60" cy="35" r="30" fill="#f0f0f0" />

          {/* Head */}
          <circle cx="60" cy="65" r="25" fill="#f4a582" />

          {/* Hair */}
          <rect x="42" y="48" width="36" height="8" fill="#8B4513" rx="4" />

          {/* Glasses */}
          <circle cx="50" cy="65" r="8" fill="none" stroke="#FFB6C1" strokeWidth="2" />
          <circle cx="70" cy="65" r="8" fill="none" stroke="#FFB6C1" strokeWidth="2" />
          <line x1="58" y1="65" x2="62" y2="65" stroke="#FFB6C1" strokeWidth="2" />

          {/* Eyes */}
          <circle cx="50" cy="65" r="2" fill="#000" />
          <circle cx="70" cy="65" r="2" fill="#000" />

          {/* Smile */}
          <path d="M 50 75 Q 60 80, 70 75" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />

          {/* Body - apron */}
          <rect x="40" y="85" width="40" height="50" fill="#e5e5e5" rx="5" />
          <rect x="42" y="87" width="36" height="46" fill="#4169E1" rx="4" />

          {/* Straps */}
          <rect x="48" y="82" width="4" height="12" fill="#4169E1" />
          <rect x="68" y="82" width="4" height="12" fill="#4169E1" />

          {/* Arms */}
          <rect x="25" y="95" width="12" height="30" fill="#DC143C" rx="6" />
          <rect x="83" y="95" width="12" height="30" fill="#DC143C" rx="6" />

          {/* Hands - holding whisk */}
          <ellipse cx="31" cy="128" rx="6" ry="8" fill="#f4a582" />
          <ellipse cx="89" cy="128" rx="6" ry="8" fill="#f4a582" />

          {/* Whisk */}
          <rect x="86" y="115" width="3" height="18" fill="#666" rx="1.5" />
          <circle cx="87.5" cy="113" r="4" fill="none" stroke="#666" strokeWidth="2" />
          <line x1="87.5" y1="109" x2="87.5" y2="117" stroke="#666" strokeWidth="1" />
          <line x1="84" y1="110" x2="91" y2="116" stroke="#666" strokeWidth="1" />
          <line x1="91" y1="110" x2="84" y2="116" stroke="#666" strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}
