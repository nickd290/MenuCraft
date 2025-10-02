import { MenuTemplate } from '@/data/templates'
import { TextStyle, ElementTransform } from '@/types/doc'
import { textStyleToCSS, transformToCSS } from '@/utils/styleHelpers'

interface DesignAnalysis {
  colors: {
    pageBackground: string
    sectionHeaderBackground: string
    sectionHeaderText: string
    bodyText: string
    priceText: string
    dividerColor: string
  }
  sectionHeaderStyle: {
    hasColoredBackground: boolean
    isFullWidth: boolean
    alignment: 'left' | 'center'
  }
  layout: {
    columns: number
    hasDividers: boolean
    sectionSpacing: 'tight' | 'normal' | 'loose'
    layoutType?: 'single-column' | 'two-column' | 'mixed'
  }
  fonts: {
    headerFont: 'serif' | 'sans-serif'
    bodyFont: 'serif' | 'sans-serif'
  }
}

interface LogoInfo {
  present: boolean
  description: string
  position: string
  hasText: boolean
}

interface CustomReplicatedTemplateProps {
  template: MenuTemplate & {
    sections: Array<{
      title: string
      items: Array<{
        name: string
        description: string
        price: string
      }>
      column?: 'left' | 'right' | 'full'
      hasBox?: boolean
      boxColor?: string | null
    }>
  }
  design: DesignAnalysis
  restaurantName?: string
  logo?: LogoInfo
  styleOverrides?: Record<string, Partial<TextStyle>>
  roleStyles?: Record<string, Partial<TextStyle>>
  transforms?: Record<string, ElementTransform>
}

const getSpacingValue = (spacing: string): string => {
  switch (spacing) {
    case 'tight': return '1rem'
    case 'normal': return '1.5rem'
    case 'loose': return '2.5rem'
    default: return '1.5rem'
  }
}

export const CustomReplicatedTemplate = ({
  template,
  design,
  restaurantName,
  logo,
  styleOverrides = {},
  roleStyles = {},
  transforms = {}
}: CustomReplicatedTemplateProps) => {
  // Debug logging
  console.log('\n=== CustomReplicatedTemplate DEBUG ===')
  console.log('Design received:', design)
  console.log('Layout type:', design.layout.layoutType)
  console.log('Columns:', design.layout.columns)
  console.log('Template sections:', template.sections.length)
  console.log('Sections with column property:', template.sections.filter(s => s.column).length)
  console.log('Sections with hasBox property:', template.sections.filter(s => s.hasBox).length)
  console.log('\nSection breakdown:')
  template.sections.forEach((s, idx) => {
    console.log(`  ${idx + 1}. ${s.title}: column=${s.column || 'NONE'}, hasBox=${s.hasBox || false}, boxColor=${s.boxColor || 'none'}`)
  })
  console.log('=== END DEBUG ===\n')

  const headerFont = design.fonts.headerFont === 'serif' ? "'Playfair Display', serif" : "'Inter', sans-serif"
  const bodyFont = design.fonts.bodyFont === 'serif' ? "'Crimson Text', serif" : "'Open Sans', sans-serif"
  const sectionSpacing = getSpacingValue(design.layout.sectionSpacing)
  const layoutType = design.layout.layoutType || (design.layout.columns === 2 ? 'two-column' : 'single-column')

  const getStyle = (elementId: string, role?: string, baseStyle: React.CSSProperties = {}) => {
    const roleStyle = role && roleStyles[role] ? textStyleToCSS(roleStyles[role]) : {}
    const override = styleOverrides[elementId] ? textStyleToCSS(styleOverrides[elementId]) : {}
    const transform = transforms[elementId] ? transformToCSS(transforms[elementId]) : {}
    return { ...baseStyle, ...roleStyle, ...override, ...transform }
  }

  // Group sections by column
  const leftSections = template.sections.filter(s => s.column === 'left')
  const rightSections = template.sections.filter(s => s.column === 'right')
  const fullWidthSections = template.sections.filter(s => !s.column || s.column === 'full')

  // Render a single section
  const renderSection = (section: typeof template.sections[0], sectionIdx: number) => {
    const hasBox = section.hasBox ?? false
    const boxColor = section.boxColor || 'transparent'

    return (
      <div
        key={sectionIdx}
        data-el={`section-${sectionIdx}`}
        data-el-type="group"
        style={{
          backgroundColor: hasBox ? boxColor : 'transparent',
          padding: hasBox ? '1rem' : '0',
          borderRadius: hasBox ? '8px' : '0',
          marginBottom: sectionSpacing,
        }}
      >
        {/* Section Header */}
        <div
          data-el={`section-${sectionIdx}-header`}
          data-el-type="text"
          data-role="header"
          style={{
            backgroundColor: hasBox
              ? 'transparent' // No separate header bg when section has box
              : design.sectionHeaderStyle.hasColoredBackground
                ? design.colors.sectionHeaderBackground
                : 'transparent',
            color: hasBox
              ? '#ffffff' // White text for boxed sections
              : design.sectionHeaderStyle.hasColoredBackground
                ? design.colors.sectionHeaderText
                : design.colors.bodyText,
            padding: hasBox
              ? '0.5rem 0' // Less padding for boxed sections (box provides padding)
              : design.sectionHeaderStyle.hasColoredBackground
                ? '0.75rem 1rem'
                : '0.5rem 0',
            marginBottom: '0.75rem',
            width: design.sectionHeaderStyle.isFullWidth ? '100%' : 'auto',
            textAlign: design.sectionHeaderStyle.alignment,
            display: design.sectionHeaderStyle.isFullWidth ? 'block' : 'inline-block',
          }}
        >
          <h2
            style={getStyle(`section-${sectionIdx}-header`, 'header', {
              fontFamily: headerFont,
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            })}
          >
            {section.title}
          </h2>
        </div>

        {/* Menu Items */}
        <div style={{ marginLeft: design.sectionHeaderStyle.alignment === 'left' ? '0' : '1rem' }}>
          {section.items.map((item, itemIdx) => (
            <div
              key={itemIdx}
              style={{
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: design.layout.hasDividers && itemIdx < section.items.length - 1
                  ? `1px solid ${hasBox ? 'rgba(255, 255, 255, 0.2)' : design.colors.dividerColor}`
                  : 'none',
              }}
            >
              {/* Item Name and Price Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: item.description ? '0.25rem' : '0',
                }}
              >
                <span
                  data-el={`item-${sectionIdx}-${itemIdx}-name`}
                  data-el-type="text"
                  data-role="body"
                  style={getStyle(`item-${sectionIdx}-${itemIdx}-name`, 'body', {
                    fontFamily: bodyFont,
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: hasBox ? '#ffffff' : design.colors.bodyText,
                    flex: 1,
                  })}
                >
                  {item.name}
                </span>
                <span
                  data-el={`item-${sectionIdx}-${itemIdx}-price`}
                  data-el-type="text"
                  data-role="price"
                  style={getStyle(`item-${sectionIdx}-${itemIdx}-price`, 'price', {
                    fontFamily: bodyFont,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: hasBox ? '#ffffff' : design.colors.priceText,
                    whiteSpace: 'nowrap',
                  })}
                >
                  ${item.price}
                </span>
              </div>

              {/* Item Description */}
              {item.description && (
                <p
                  data-el={`item-${sectionIdx}-${itemIdx}-desc`}
                  data-el-type="text"
                  data-role="description"
                  style={getStyle(`item-${sectionIdx}-${itemIdx}-desc`, 'description', {
                    fontSize: '0.875rem',
                    color: hasBox ? '#ffffff' : design.colors.bodyText,
                    opacity: hasBox ? 0.85 : 0.75,
                    lineHeight: '1.4',
                    margin: 0,
                  })}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render logo/header if present
  const renderLogoHeader = () => {
    if (!logo?.present && !restaurantName) return null

    return (
      <div
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: `2px solid ${design.colors.dividerColor}`,
        }}
      >
        {restaurantName && (
          <h1
            style={{
              fontFamily: headerFont,
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: design.colors.bodyText,
              margin: 0,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {restaurantName}
          </h1>
        )}
        {logo?.present && logo.description && (
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: '0.875rem',
              color: design.colors.bodyText,
              opacity: 0.7,
              margin: '0.5rem 0 0 0',
              fontStyle: 'italic',
            }}
          >
            {logo.description}
          </p>
        )}
      </div>
    )
  }

  // Render based on layout type
  if (layoutType === 'two-column' && (leftSections.length > 0 || rightSections.length > 0)) {
    return (
      <div
        className="w-full h-full p-6 overflow-auto"
        style={{
          backgroundColor: design.colors.pageBackground,
          fontFamily: bodyFont,
          color: design.colors.bodyText,
        }}
      >
        {/* Logo/Header */}
        {renderLogoHeader()}

        {/* Full-width sections at top */}
        {fullWidthSections.map((section, idx) => renderSection(section, idx))}

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left column */}
          <div>
            {leftSections.map((section, idx) =>
              renderSection(section, fullWidthSections.length + idx)
            )}
          </div>

          {/* Right column */}
          <div>
            {rightSections.map((section, idx) =>
              renderSection(section, fullWidthSections.length + leftSections.length + idx)
            )}
          </div>
        </div>
      </div>
    )
  }

  // Single column or fallback
  return (
    <div
      className="w-full h-full p-6 overflow-auto"
      style={{
        backgroundColor: design.colors.pageBackground,
        fontFamily: bodyFont,
        color: design.colors.bodyText,
      }}
    >
      {/* Logo/Header */}
      {renderLogoHeader()}

      {template.sections.map((section, idx) => renderSection(section, idx))}
    </div>
  )
}
