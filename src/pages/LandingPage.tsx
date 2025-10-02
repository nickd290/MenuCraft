import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { templates } from '@/data/templates'
import { TemplatePreview } from '@/components/TemplatePreview'
import { Upload, Grid3x3, Sparkles, Palette, Download, Flag } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header - Sticky with Dark Green */}
      <header className="sticky top-0 z-50 bg-[#1a3d35] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#d4f534] flex items-center justify-center border-2 border-white shadow-lg">
                <span className="text-[#1a3d35] font-bold text-xl">MC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#d4f534]" style={{ fontFamily: "'Pacifico', cursive" }}>
                  MenuCraft
                </span>
                <span className="text-[8px] tracking-[0.3em] text-[#d4f534] font-bold uppercase -mt-1">
                  STUDIOS
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-[#d4f534] hover:text-white font-medium transition-all uppercase text-sm tracking-wide relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4f534] transition-all group-hover:w-full"></span>
              </a>
              <a href="#templates" className="text-[#d4f534] hover:text-white font-medium transition-all uppercase text-sm tracking-wide relative group">
                Templates
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4f534] transition-all group-hover:w-full"></span>
              </a>
              <button
                onClick={() => navigate('/upload')}
                className="text-[#d4f534] hover:text-white font-medium transition-all uppercase text-sm tracking-wide relative group"
              >
                Upload
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4f534] transition-all group-hover:w-full"></span>
              </button>
            </nav>

            {/* Quick Create Button */}
            <Button
              onClick={() => navigate('/upload')}
              className="bg-[#d4f534] hover:bg-[#c4e524] text-[#1a3d35] font-bold shadow-lg"
            >
              Quick Create
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Cinematic Golf Course */}
      <section id="home" className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background - Lush Golf Course */}
        <div className="absolute inset-0">
          {/* Gradient Background simulating golden hour lighting */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a4d2e] via-[#1a5d3e] to-[#0f3d28]" />

          {/* Animated gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

          {/* Subtle animated light rays */}
          <div className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-b from-[#d4f534]/10 to-transparent opacity-30 blur-3xl animate-pulse"
               style={{ animationDuration: '4s' }} />
          <div className="absolute top-0 left-1/3 w-80 h-full bg-gradient-to-b from-white/5 to-transparent opacity-20 blur-2xl animate-pulse"
               style={{ animationDuration: '5s', animationDelay: '1s' }} />
        </div>

        {/* Golf Course Elements - Decorative */}
        {/* Flag on green - top right */}
        <div className="absolute top-24 right-12 opacity-40">
          <div className="relative">
            {/* Flag pole */}
            <div className="w-1 h-40 bg-gradient-to-b from-[#d4f534] to-[#d4f534]/60 mx-auto" />
            {/* Flag */}
            <div className="absolute top-0 -right-1 w-12 h-8 bg-[#d4f534] rounded-r-md shadow-lg"
                 style={{ clipPath: 'polygon(0 0, 100% 40%, 100% 60%, 0 100%)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
            </div>
            {/* Golf ball on tee */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <div className="w-4 h-4 rounded-full bg-white shadow-xl" />
              <div className="w-2 h-2 bg-[#8b6f47] mx-auto mt-0.5" />
            </div>
          </div>
        </div>

        {/* Golf ball texture - bottom left */}
        <div className="absolute bottom-32 left-16 opacity-20">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" fill="url(#golfBallGradient)" stroke="#d4f534" strokeWidth="2" opacity="0.6"/>
            <defs>
              <radialGradient id="golfBallGradient">
                <stop offset="0%" stopColor="#d4f534" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#d4f534" stopOpacity="0.1"/>
              </radialGradient>
            </defs>
            {/* Dimples */}
            {[...Array(20)].map((_, i) => {
              const angle = (i * 18) * Math.PI / 180
              const radius = 40
              const x = 60 + radius * Math.cos(angle)
              const y = 60 + radius * Math.sin(angle)
              return <circle key={i} cx={x} cy={y} r="3" fill="#d4f534" opacity="0.4"/>
            })}
          </svg>
        </div>

        {/* Fairway stripes - subtle pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <div className="flex h-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#d4f534]/20' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-white/10 backdrop-blur-md rounded-full border border-[#d4f534]/30 shadow-2xl">
            <Flag className="w-5 h-5 text-[#d4f534]" />
            <span className="text-sm font-semibold text-white tracking-wider uppercase">
              Trusted by Country Clubs & Fine Dining
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="block text-white drop-shadow-2xl">
              Elevate Your
            </span>
            <span className="block text-[#d4f534] drop-shadow-[0_0_30px_rgba(212,245,52,0.5)]"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
              Menu Experience
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
            Professional menu design as refined as your establishment
          </p>
          <p className="text-base md:text-lg text-[#d4f534]/80 mb-12 max-w-2xl mx-auto">
            From country club dining rooms to championship grillrooms • AI-powered design in minutes
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="group bg-[#d4f534] hover:bg-[#c4e524] text-[#1a3d35] text-lg px-16 py-8 rounded-full shadow-[0_0_40px_rgba(212,245,52,0.4)] hover:shadow-[0_0_60px_rgba(212,245,52,0.7)] transition-all hover:scale-110 font-bold relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Upload className="w-6 h-6 mr-3" />
              Start Your Design
            </Button>
            <Button
              size="lg"
              onClick={() => {
                document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group bg-white/5 hover:bg-white/15 text-white text-lg px-16 py-8 rounded-full backdrop-blur-xl border-2 border-white/40 shadow-2xl transition-all hover:scale-110 font-bold hover:border-[#d4f534]"
            >
              <Grid3x3 className="w-6 h-6 mr-3 group-hover:text-[#d4f534] transition-colors" />
              View Templates
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4f534]" />
              <span>AI-Powered</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#d4f534]" />
              <span>20+ Templates</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#d4f534]" />
              <span>Print-Ready PDF</span>
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </section>

      {/* Decorative Section Divider */}
      <div className="relative h-16 bg-gradient-to-b from-transparent to-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4f534]/50 to-transparent"></div>
      </div>

      {/* Feature Cards - Golf Country Club Style */}
      <section className="relative -mt-20 z-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100 hover:border-[#0f7c5a] hover:shadow-[0_10px_40px_rgba(15,124,90,0.15)] transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[#d4f534] rounded-full flex items-center justify-center mb-6 border-2 border-[#0f7c5a] shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-[#1a3d35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3d35] mb-3 group-hover:text-[#0f7c5a] transition-colors">Smart Parsing</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Upload any menu format and watch it transform into a beautiful, editable design with AI-powered parsing.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100 hover:border-[#0f7c5a] hover:shadow-[0_10px_40px_rgba(15,124,90,0.15)] transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[#d4f534] rounded-full flex items-center justify-center mb-6 border-2 border-[#0f7c5a] shadow-lg group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-[#1a3d35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3d35] mb-3 group-hover:text-[#0f7c5a] transition-colors">Your Branding</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Customize colors, fonts, and layouts to match your establishment's unique brand and style.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100 hover:border-[#0f7c5a] hover:shadow-[0_10px_40px_rgba(15,124,90,0.15)] transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[#d4f534] rounded-full flex items-center justify-center mb-6 border-2 border-[#0f7c5a] shadow-lg group-hover:scale-110 transition-transform">
                <Download className="w-8 h-8 text-[#1a3d35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3d35] mb-3 group-hover:text-[#0f7c5a] transition-colors">Print Ready</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Download high-quality PDFs ready for professional printing with proper bleed and margins.
              </p>
            </div>

            {/* Feature Card 4 - NEW */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100 hover:border-[#0f7c5a] hover:shadow-[0_10px_40px_rgba(15,124,90,0.15)] transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[#d4f534] rounded-full flex items-center justify-center mb-6 border-2 border-[#0f7c5a] shadow-lg group-hover:scale-110 transition-transform">
                <Flag className="w-8 h-8 text-[#1a3d35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3d35] mb-3 group-hover:text-[#0f7c5a] transition-colors">Country Club Ready</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Sophisticated designs perfect for upscale establishments and private clubs with premium aesthetics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section id="templates" className="container mx-auto px-4 py-24 mt-16">
        <div className="text-center mb-16">
          <h3 className="text-5xl md:text-6xl font-bold text-[#1a3d35] mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
            Choose Your Style
          </h3>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Select from 10 professionally designed templates, each crafted for upscale restaurants and country clubs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-2xl transition-all hover:scale-[1.02] group overflow-hidden border-2 border-[#0f7c5a]/30 hover:border-[#0f7c5a]"
              onClick={() => navigate(`/editor/${template.id}`)}
            >
              <CardContent className="p-0">
                <div className="aspect-[8.5/11] overflow-hidden border-b-2 border-[#0f7c5a]/30 bg-slate-50">
                  <TemplatePreview template={template} />
                </div>
                <div className="p-5 bg-white">
                  <h4 className="font-bold text-[#1a3d35] group-hover:text-[#0f7c5a] text-base mb-1 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">{template.category}</p>
                  <p className="text-xs text-slate-500 mb-3">{template.description}</p>
                  <Button size="sm" className="w-full bg-[#0f7c5a] hover:bg-[#0d6a4d] text-white">
                    Edit This Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer - Golf Club Inspired */}
      <footer className="bg-[#1a3d35] text-white py-16 mt-24 relative overflow-hidden">
        {/* Golf Course Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z" fill="#d4f534"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#d4f534] flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-[#1a3d35] font-bold text-2xl">MC</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-4xl font-bold text-[#d4f534]" style={{ fontFamily: "'Pacifico', cursive" }}>
                MenuCraft
              </span>
              <span className="text-[10px] tracking-[0.3em] text-[#d4f534] font-bold uppercase -mt-1">
                STUDIOS
              </span>
            </div>
          </div>

          <p className="text-[#d4f534]/80 mb-2 text-lg">Professional Menu Design</p>
          <p className="text-white/60 mb-8">For Restaurants & Country Clubs</p>

          {/* Decorative Golf Elements */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#d4f534]"></div>
            <div className="w-2 h-2 rounded-full bg-[#d4f534]"></div>
            <div className="w-2 h-2 rounded-full bg-[#d4f534]"></div>
          </div>

          <p className="text-white/40 text-sm">© 2024 MenuCraft Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage