import * as React from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: React.ReactNode
  className?: string
}

export const Accordion = ({ type = 'multiple', defaultValue, children, className = '' }: AccordionProps) => {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }
    return []
  })

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value]
      }
      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    })
  }, [type])

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const AccordionItem = ({ value, children, className = '' }: AccordionItemProps) => {
  return (
    <div className={`border-b ${className}`} data-value={value}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export const AccordionTrigger = ({ children, className = '' }: AccordionTriggerProps) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionTrigger must be used within Accordion')

  const parent = React.useContext(AccordionItemContext)
  if (!parent) throw new Error('AccordionTrigger must be used within AccordionItem')

  const { openItems, toggleItem } = context
  const { value } = parent
  const isOpen = openItems.includes(value)

  return (
    <button
      onClick={() => toggleItem(value)}
      className={`flex w-full items-center justify-between py-4 px-4 font-medium transition-all hover:bg-slate-50 text-left ${className}`}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export const AccordionContent = ({ children, className = '' }: AccordionContentProps) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionContent must be used within Accordion')

  const parent = React.useContext(AccordionItemContext)
  if (!parent) throw new Error('AccordionContent must be used within AccordionItem')

  const { openItems } = context
  const { value } = parent
  const isOpen = openItems.includes(value)

  return (
    <div
      className={`overflow-hidden transition-all duration-200 ${
        isOpen ? 'max-h-[2000px]' : 'max-h-0'
      }`}
    >
      <div className={`px-4 pb-4 pt-0 ${className}`}>{children}</div>
    </div>
  )
}

// Context for AccordionItem to pass value to children
const AccordionItemContext = React.createContext<{ value: string } | undefined>(undefined)

// Wrapper to provide value context
export const AccordionItemWrapper = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      {children}
    </AccordionItemContext.Provider>
  )
}

// Update AccordionItem to use wrapper
const OriginalAccordionItem = AccordionItem
export { OriginalAccordionItem as AccordionItemRaw }

export const AccordionItemWithContext = ({ value, children, className = '' }: AccordionItemProps) => {
  return (
    <AccordionItemWrapper value={value}>
      <OriginalAccordionItem value={value} className={className}>
        {children}
      </OriginalAccordionItem>
    </AccordionItemWrapper>
  )
}

// Override default export
export { AccordionItemWithContext as AccordionItem }