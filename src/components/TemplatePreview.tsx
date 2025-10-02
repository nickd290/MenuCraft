import { MenuTemplate } from '@/data/templates'
import { FineDiningTemplate } from './templates/FineDiningTemplate'
import { SteakhouseTemplate } from './templates/SteakhouseTemplate'
import { ItalianTemplate } from './templates/ItalianTemplate'
import { BarPubTemplate } from './templates/BarPubTemplate'
import { CocktailTemplate } from './templates/CocktailTemplate'
import { BistroTemplate } from './templates/BistroTemplate'
import { MexicanTemplate } from './templates/MexicanTemplate'
import { AsianFusionTemplate } from './templates/AsianFusionTemplate'
import { CafeTemplate } from './templates/CafeTemplate'
import { BreakfastTemplate } from './templates/BreakfastTemplate'
import { DessertTemplate } from './templates/DessertTemplate'
import { CocktailBarTemplate } from './templates/CocktailBarTemplate'
import { CountryClubTemplate } from './templates/CountryClubTemplate'
import { LakesideTemplate } from './templates/LakesideTemplate'
import { MountainLodgeTemplate } from './templates/MountainLodgeTemplate'
import { PrivateClubTemplate } from './templates/PrivateClubTemplate'
import { CustomReplicatedTemplate } from './templates/CustomReplicatedTemplate'
import { BocaPointeDinnerTemplate } from './templates/BocaPointeDinnerTemplate'
import { KidsMenuTemplate } from './templates/KidsMenuTemplate'
import { GrandezzaBrunchTemplate } from './templates/GrandezzaBrunchTemplate'
import { GrandezzaWineListTemplate } from './templates/GrandezzaWineListTemplate'
import { MinimalistBrunchTemplate } from './templates/MinimalistBrunchTemplate'

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
  }
  fonts: {
    headerFont: 'serif' | 'sans-serif'
    bodyFont: 'serif' | 'sans-serif'
  }
}

import { TextStyle, ElementTransform } from '@/types/doc'

interface TemplatePreviewProps {
  template: MenuTemplate
  customDesign?: DesignAnalysis | null
  styleOverrides?: Record<string, Partial<TextStyle>>
  roleStyles?: Record<string, Partial<TextStyle>>
  transforms?: Record<string, ElementTransform>
  suppressHeader?: boolean
  suppressBorder?: boolean
  columnCount?: number
}

export const TemplatePreview = ({
  template,
  customDesign,
  styleOverrides = {},
  roleStyles = {},
  transforms = {},
  suppressHeader = false,
  suppressBorder = false,
  columnCount = 1
}: TemplatePreviewProps) => {
  // If this is a custom replicated design, use the custom template
  if (template.id === 999 && customDesign) {
    return (
      <CustomReplicatedTemplate
        template={template}
        design={customDesign}
        restaurantName={(template as any).restaurantName}
        logo={(template as any).logo}
        styleOverrides={styleOverrides}
        roleStyles={roleStyles}
        transforms={transforms}
      />
    )
  }
  // Route to the correct template based on ID
  switch (template.id) {
    case 1: // Fine Dining
      return <FineDiningTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 2: // Bistro
      return <BistroTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 3: // Steakhouse
      return <SteakhouseTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 4: // Italian
      return <ItalianTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 5: // Mexican
      return <MexicanTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 6: // Asian Fusion
      return <AsianFusionTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 7: // Cafe
      return <CafeTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 8: // Bar/Pub
      return <BarPubTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 9: // Breakfast
      return <BreakfastTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 10: // Dessert
      return <DessertTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 11: // Elegant Cocktail Bar
      return <CocktailBarTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 12: // Country Club Classic
      return <CountryClubTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 13: // Lakeside Club
      return <LakesideTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 14: // Mountain Lodge
      return <MountainLodgeTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 15: // Private Club Formal
      return <PrivateClubTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 18: // Boca Pointe Dinner
      return <BocaPointeDinnerTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 19: // Kids Menu
      return <KidsMenuTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 20: // Grandezza Spring Brunch
      return <GrandezzaBrunchTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} suppressBorder={suppressBorder} columnCount={columnCount} />
    case 21: // Grandezza Wine List
      return <GrandezzaWineListTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    case 22: // Minimalist Brunch
      return <MinimalistBrunchTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
    default:
      return <FineDiningTemplate template={template} styleOverrides={styleOverrides} roleStyles={roleStyles} transforms={transforms} suppressHeader={suppressHeader} columnCount={columnCount} />
  }
}