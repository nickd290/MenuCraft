import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, CreditCard, CheckCircle2, Printer, FileText } from 'lucide-react'
import { useDocStore } from '@/state/doc'

interface OrderDetails {
  quantity: number
  coverType: 'matte' | 'uncoated' | 'gloss' | 'non-tearable'
  roundedCorners: boolean
  lamination: boolean
}

interface ContactInfo {
  name: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  state: string
  zip: string
}

const PRICING = {
  coverType: {
    matte: 2.50,
    uncoated: 2.00,
    gloss: 2.75,
    'non-tearable': 4.00
  },
  roundedCorners: 0.25,
  lamination: 0.50
}

const QUANTITY_OPTIONS = [50, 100, 250, 500, 1000]

const COVER_TYPES = [
  { value: 'matte', label: 'Matte Cover', desc: 'Smooth, non-reflective finish', price: 2.50 },
  { value: 'uncoated', label: 'Uncoated Cover', desc: 'Natural paper texture', price: 2.00 },
  { value: 'gloss', label: 'Gloss Cover', desc: 'Shiny, vibrant finish', price: 2.75 },
  { value: 'non-tearable', label: 'Non-Tearable', desc: 'Waterproof & durable', price: 4.00 }
] as const

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'order' | 'contact' | 'payment' | 'confirmation'>('order')

  // Get menu data from store
  const menuData = useDocStore((s) => s.menuData)
  const layoutSettings = useDocStore((s) => s.layoutSettings)

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    quantity: 50,
    coverType: 'matte',
    roundedCorners: false,
    lamination: false
  })

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  })

  const calculateTotal = () => {
    const { quantity, coverType, roundedCorners, lamination } = orderDetails
    let pricePerMenu = PRICING.coverType[coverType]
    if (roundedCorners) pricePerMenu += PRICING.roundedCorners
    if (lamination) pricePerMenu += PRICING.lamination
    return (pricePerMenu * quantity).toFixed(2)
  }

  const calculatePerUnit = () => {
    const { coverType, roundedCorners, lamination } = orderDetails
    let pricePerMenu = PRICING.coverType[coverType]
    if (roundedCorners) pricePerMenu += PRICING.roundedCorners
    if (lamination) pricePerMenu += PRICING.lamination
    return pricePerMenu.toFixed(2)
  }

  if (!menuData) {
    navigate('/')
    return null
  }

  const handleOrderSubmit = () => {
    setStep('contact')
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePaymentSubmit = () => {
    setStep('confirmation')
  }

  // Calculate menu details
  const totalItems = menuData.sections.reduce((sum, section) => sum + section.items.length, 0)
  const totalSections = menuData.sections.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Editor</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Order Physical Menus
            </h1>
            <p className="text-sm text-gray-500 mt-1">by StarterBox Studios</p>
          </div>
          <div className="w-32" />
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Order Form (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 bg-white rounded-lg p-4 shadow-sm">
              {[
                { key: 'order', label: 'Order', icon: Package },
                { key: 'contact', label: 'Contact', icon: FileText },
                { key: 'payment', label: 'Payment', icon: CreditCard },
                { key: 'confirmation', label: 'Done', icon: CheckCircle2 }
              ].map((s, idx) => {
                const Icon = s.icon
                const isActive = step === s.key
                const isCompleted = ['order', 'contact', 'payment', 'confirmation'].indexOf(step) > idx

                return (
                  <div key={s.key} className="flex items-center flex-1">
                    <div className={`flex items-center gap-2 ${isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-green-600 text-white' :
                        isCompleted ? 'bg-green-600 text-white' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                    </div>
                    {idx < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              {step === 'order' && (
                <OrderDetailsStep
                  orderDetails={orderDetails}
                  setOrderDetails={setOrderDetails}
                  calculateTotal={calculateTotal}
                  calculatePerUnit={calculatePerUnit}
                  onNext={handleOrderSubmit}
                />
              )}

              {step === 'contact' && (
                <ContactInfoStep
                  contactInfo={contactInfo}
                  setContactInfo={setContactInfo}
                  onNext={handleContactSubmit}
                  onBack={() => setStep('order')}
                />
              )}

              {step === 'payment' && (
                <PaymentStep
                  total={calculateTotal()}
                  onNext={handlePaymentSubmit}
                  onBack={() => setStep('contact')}
                />
              )}

              {step === 'confirmation' && (
                <ConfirmationStep
                  orderDetails={orderDetails}
                  contactInfo={contactInfo}
                  total={calculateTotal()}
                  menuName={menuData.name}
                />
              )}
            </div>
          </div>

          {/* Right: Menu Preview & Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Menu Preview */}
              <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 text-center">Your Menu Preview</h3>
                <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-inner">
                  {/* High quality preview with proper scaling */}
                  <div className="p-6 space-y-4 text-xs" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {/* Restaurant Name */}
                    <div className="text-center pb-3 border-b-2 border-gray-800">
                      <h1 className="text-2xl font-bold tracking-wide">{menuData.name}</h1>
                    </div>

                    {/* All Sections */}
                    {menuData.sections.map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-400 pb-1">
                          {section.title}
                        </h2>
                        <div className="space-y-2">
                          {section.items.map((item, i) => (
                            <div key={i} className="space-y-0.5">
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-gray-900">{item.name}</span>
                                <div className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1"></div>
                                <span className="font-bold text-gray-900">${item.price}</span>
                              </div>
                              {item.description && (
                                <p className="text-gray-600 italic text-[10px] leading-relaxed pl-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Footer note */}
                    <div className="text-center pt-4 border-t border-gray-300 mt-4">
                      <p className="text-[9px] text-gray-500 italic">This is a preview of your menu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Details Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Menu Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Restaurant:</span>
                    <span className="font-semibold text-gray-900">{menuData.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Sections:</span>
                    <span className="font-medium text-gray-900">{totalSections}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Menu Items:</span>
                    <span className="font-medium text-gray-900">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Paper Size:</span>
                    <span className="font-medium text-gray-900">{layoutSettings.paperSize}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              {step !== 'confirmation' && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm p-6 border border-green-200">
                  <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Quantity:</span>
                      <span className="font-semibold text-gray-900">{orderDetails.quantity} menus</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Cover Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{orderDetails.coverType.replace('-', ' ')}</span>
                    </div>
                    {orderDetails.roundedCorners && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">✓ Rounded Corners</span>
                        <span className="text-gray-600">+${PRICING.roundedCorners.toFixed(2)}</span>
                      </div>
                    )}
                    {orderDetails.lamination && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">✓ Lamination</span>
                        <span className="text-gray-600">+${PRICING.lamination.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-600 pt-2 border-t border-green-100">
                      <span>Price per menu:</span>
                      <span>${calculatePerUnit()}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-green-200 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-green-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* StarterBox Studios Branding */}
              <div className="bg-gray-900 rounded-lg shadow-sm p-6 text-white">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">StarterBox Studios</h3>
                  <p className="text-sm text-gray-400 mb-4">Professional Menu Printing</p>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Premium quality paper</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Fast turnaround</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span>Free shipping on 250+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Order Details Step
function OrderDetailsStep({
  orderDetails,
  setOrderDetails,
  calculateTotal,
  calculatePerUnit,
  onNext
}: {
  orderDetails: OrderDetails
  setOrderDetails: (details: OrderDetails) => void
  calculateTotal: () => string
  calculatePerUnit: () => string
  onNext: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Options</h2>
        <p className="text-gray-600">Choose quantity and cover type for your menus</p>
      </div>

      {/* Quantity - Button Grid */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Quantity
        </label>
        <div className="grid grid-cols-5 gap-3">
          {QUANTITY_OPTIONS.map((qty) => (
            <button
              key={qty}
              onClick={() => setOrderDetails({ ...orderDetails, quantity: qty })}
              className={`py-4 rounded-lg border-2 font-semibold transition-all text-center ${
                orderDetails.quantity === qty
                  ? 'border-green-600 bg-green-50 text-green-700 shadow-md scale-105'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="text-2xl">{qty}</div>
              <div className="text-xs mt-1 opacity-75">menus</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cover Type - Card Grid */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Cover Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COVER_TYPES.map((cover) => (
            <button
              key={cover.value}
              onClick={() => setOrderDetails({ ...orderDetails, coverType: cover.value })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                orderDetails.coverType === cover.value
                  ? 'border-green-600 bg-green-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className={`font-semibold ${orderDetails.coverType === cover.value ? 'text-green-700' : 'text-gray-900'}`}>
                    {cover.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{cover.desc}</div>
                </div>
                {orderDetails.coverType === cover.value && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm font-medium text-gray-900">
                ${cover.price.toFixed(2)}/menu
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Finishing Options - Checkboxes */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Finishing Options
        </label>
        <div className="space-y-3">
          {/* Rounded Corners */}
          <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={orderDetails.roundedCorners}
                onChange={(e) => setOrderDetails({ ...orderDetails, roundedCorners: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-600"
              />
              <div>
                <div className="font-semibold text-gray-900">Rounded Corners</div>
                <div className="text-xs text-gray-500 mt-0.5">Smooth, professional edges</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              +${PRICING.roundedCorners.toFixed(2)}/menu
            </div>
          </label>

          {/* Lamination */}
          <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={orderDetails.lamination}
                onChange={(e) => setOrderDetails({ ...orderDetails, lamination: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-600"
              />
              <div>
                <div className="font-semibold text-gray-900">Lamination</div>
                <div className="text-xs text-gray-500 mt-0.5">Waterproof & easy to clean</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              +${PRICING.lamination.toFixed(2)}/menu
            </div>
          </label>
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-6">
        <Button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg shadow-lg"
        >
          Continue to Shipping Info
        </Button>
      </div>
    </div>
  )
}

// Contact Info Step
function ContactInfoStep({
  contactInfo,
  setContactInfo,
  onNext,
  onBack
}: {
  contactInfo: ContactInfo
  setContactInfo: (info: ContactInfo) => void
  onNext: (e: React.FormEvent) => void
  onBack: () => void
}) {
  return (
    <form onSubmit={onNext} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipping Information</h2>
        <p className="text-gray-600">Where should we ship your menus?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={contactInfo.name}
            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="john@restaurant.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            required
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={contactInfo.company}
            onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Your Restaurant"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <input
          type="text"
          required
          value={contactInfo.address}
          onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            required
            value={contactInfo.city}
            onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            required
            value={contactInfo.state}
            onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="NY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            required
            value={contactInfo.zip}
            onChange={(e) => setContactInfo({ ...contactInfo, zip: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="10001"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" onClick={onBack} variant="outline" className="flex-1 py-6">
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-6"
        >
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}

// Payment Step
function PaymentStep({
  total,
  onNext,
  onBack
}: {
  total: string
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
        <p className="text-gray-600">Secure payment processing</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Payment Integration Coming Soon</h3>
        </div>
        <p className="text-gray-700 mb-6 leading-relaxed">
          We're currently setting up secure payment processing through Stripe. For now, please contact us directly to complete your order and we'll provide a custom invoice.
        </p>
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            Total: ${total}
          </div>
          <p className="text-sm text-gray-600">
            Includes all menus with selected options
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-gray-900">Contact StarterBox Studios:</p>
          <p className="text-gray-700">📧 Email: orders@starterboxstudios.com</p>
          <p className="text-gray-700">📞 Phone: (555) 123-4567</p>
          <p className="text-gray-700">⏰ Mon-Fri 9am-6pm EST</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" onClick={onBack} variant="outline" className="flex-1 py-6">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-6"
        >
          Place Order (Demo)
        </Button>
      </div>
    </div>
  )
}

// Confirmation Step
function ConfirmationStep({
  orderDetails,
  contactInfo,
  total,
  menuName
}: {
  orderDetails: OrderDetails
  contactInfo: ContactInfo
  total: string
  menuName: string
}) {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 text-lg">
          Thank you for your order. We've sent a confirmation email to <span className="font-semibold">{contactInfo.email}</span>
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 text-left max-w-md mx-auto">
        <h3 className="font-bold text-gray-900 mb-6 text-lg">Order Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
            <span className="text-gray-600">Menu:</span>
            <span className="font-semibold text-gray-900">{menuName}</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-semibold text-gray-900">{orderDetails.quantity} menus</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
            <span className="text-gray-600">Cover Type:</span>
            <span className="font-semibold text-gray-900 capitalize">{orderDetails.coverType.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-green-600">${total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-w-md mx-auto pt-6">
        <Button onClick={() => navigate('/')} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-6">
          Create Another Menu
        </Button>
        <Button onClick={() => window.print()} variant="outline" className="w-full py-6">
          <Printer className="w-4 h-4 mr-2" />
          Print Order Details
        </Button>
      </div>
    </div>
  )
}
