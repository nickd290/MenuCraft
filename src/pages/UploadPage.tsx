import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Image as ImageIcon, ArrowLeft, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

interface ExtractedMenuData {
  restaurantName?: string
  logo?: {
    present: boolean
    description: string
    position: string
    hasText: boolean
  }
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
  contentMetrics?: {
    totalItems: number
    totalCharacters: number
    averageDescriptionLength: number
    recommendedPaperSize: '8.5x11' | '11x17'
    recommendedColumns: 1 | 2
    reasoning: string
  }
  design?: {
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
}

const UploadPage = () => {
  const navigate = useNavigate()
  const [uploadMode, setUploadMode] = useState<'image' | 'word'>('image')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedMenuData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setError(null)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const extractMenuData = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)

      reader.onload = async () => {
        const imageData = reader.result as string
        setBase64Image(imageData)

        // Call our backend API
        const response = await fetch('/api/extract-menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageData,
            imageType: selectedFile.type
          })
        })

        if (!response.ok) {
          throw new Error('Failed to extract menu data')
        }

        const data = await response.json()
        setExtractedData(data)
        setIsProcessing(false)
      }

      reader.onerror = () => {
        setError('Failed to read image file')
        setIsProcessing(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsProcessing(false)
    }
  }

  const extractWordDocument = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('document', selectedFile)

      const response = await fetch('/api/extract-word', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to extract Word document')
      }

      const data = await response.json()
      setExtractedData(data)
      setIsProcessing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsProcessing(false)
    }
  }

  const handleConfirmAndEdit = () => {
    if (extractedData && base64Image) {
      // Store extracted data (content + design) and original image in sessionStorage
      sessionStorage.setItem('uploadedMenuData', JSON.stringify(extractedData))
      sessionStorage.setItem('uploadedMenuImage', base64Image)

      // Store design separately if available
      if (extractedData.design) {
        sessionStorage.setItem('uploadedMenuDesign', JSON.stringify(extractedData.design))
      }

      // Navigate to editor with a special flag
      navigate('/editor/upload')
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header - Golf Club Theme */}
      <header className="bg-[#1a3d35] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-[#d4f534] hover:text-white hover:bg-[#0f7c5a]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d4f534] flex items-center justify-center border-2 border-white shadow-lg">
                <span className="text-[#1a3d35] font-bold text-lg">MC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#d4f534]" style={{ fontFamily: "'Pacifico', cursive" }}>
                  Upload Menu
                </h1>
                <p className="text-xs text-[#d4f534]/70">AI will extract all your menu items</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload & Preview */}
          <div className="space-y-6">
            {/* Upload Mode Tabs */}
            {!previewUrl && !selectedFile && (
              <div className="flex gap-2 border-b border-slate-200">
                <button
                  onClick={() => setUploadMode('image')}
                  className={`px-4 py-2 font-medium transition-colors relative ${
                    uploadMode === 'image'
                      ? 'text-[#0f7c5a] border-b-2 border-[#0f7c5a]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image Upload
                  </div>
                </button>
                <button
                  onClick={() => setUploadMode('word')}
                  className={`px-4 py-2 font-medium transition-colors relative ${
                    uploadMode === 'word'
                      ? 'text-[#0f7c5a] border-b-2 border-[#0f7c5a]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Word Document
                  </div>
                </button>
              </div>
            )}

            {/* Upload Area */}
            {!previewUrl && !selectedFile && uploadMode === 'image' && (
              <Card>
                <CardContent className="p-0">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-slate-400 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-semibold mb-2">Upload Menu Photo</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Drag and drop or click to browse
                      </p>
                      <div className="inline-block">
                        <div className="px-4 py-2 bg-[#0f7c5a] text-white rounded-lg hover:bg-[#0d6a4d] transition-colors inline-flex items-center gap-2 font-medium">
                          <ImageIcon className="w-4 h-4" />
                          Choose Photo
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-4">
                        Supports JPG, PNG, HEIC • Max 10MB
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Word Upload Area */}
            {!previewUrl && !selectedFile && uploadMode === 'word' && (
              <Card>
                <CardContent className="p-0">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-slate-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="word-upload"
                    />
                    <label htmlFor="word-upload" className="cursor-pointer block">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-semibold mb-2">Upload Word Document</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Click to browse for your menu document
                      </p>
                      <div className="inline-block">
                        <div className="px-4 py-2 bg-[#0f7c5a] text-white rounded-lg hover:bg-[#0d6a4d] transition-colors inline-flex items-center gap-2 font-medium">
                          <FileText className="w-4 h-4" />
                          Choose Document
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-4">
                        Supports .docx format • Max 10MB
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Selected Preview */}
            {selectedFile && !previewUrl && !extractedData && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#0f7c5a]" />
                        {selectedFile.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to extract
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null)
                        setError(null)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <Button
                    className="w-full bg-[#0f7c5a] hover:bg-[#0d6a4d] text-white"
                    size="lg"
                    onClick={uploadMode === 'word' ? extractWordDocument : extractMenuData}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadMode === 'word' ? 'Extract from Word' : 'Extract with AI'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Image Preview */}
            {previewUrl && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Menu Photo</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        setExtractedData(null)
                        setError(null)
                      }}
                    >
                      Change Photo
                    </Button>
                  </div>
                  <img
                    src={previewUrl}
                    alt="Menu preview"
                    className="w-full rounded-lg border"
                  />
                  {!extractedData && !isProcessing && (
                    <Button
                      className="w-full mt-4 bg-[#0f7c5a] hover:bg-[#0d6a4d] text-white"
                      size="lg"
                      onClick={extractMenuData}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Extract Menu with AI
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* How it works */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">How it works</h3>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="font-semibold text-slate-900">1.</span>
                    Upload a photo or Word document (.docx) of your menu
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-slate-900">2.</span>
                    AI extracts all sections, items, descriptions, and prices
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-slate-900">3.</span>
                    Review and edit the extracted content
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-slate-900">4.</span>
                    Choose a professional template and customize
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-slate-900">5.</span>
                    Export print-ready PDF or order prints
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Right: Extraction Results */}
          <div>
            {/* Processing State */}
            {isProcessing && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 text-slate-400 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Extracting Menu Data...</h3>
                  <p className="text-sm text-slate-600">
                    AI is analyzing your menu photo and extracting all items, descriptions, and prices.
                    This may take 15-30 seconds.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">Extraction Failed</h3>
                      <p className="text-sm text-red-700">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={extractMenuData}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success State */}
            {extractedData && !isProcessing && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">Extraction Complete!</h3>
                      <p className="text-sm text-green-700">
                        Found {extractedData.sections.length} section{extractedData.sections.length !== 1 ? 's' : ''} with{' '}
                        {extractedData.sections.reduce((sum, s) => sum + s.items.length, 0)} total items
                      </p>
                    </div>
                  </div>

                  {/* Show logo detection */}
                  {extractedData.logo?.present && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-purple-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">Logo detected!</span>
                      </p>
                      <p className="text-xs text-purple-700 mt-1">{extractedData.logo.description}</p>
                    </div>
                  )}

                  {/* Show paper size recommendation */}
                  {extractedData.contentMetrics && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-green-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">Recommended: {extractedData.contentMetrics.recommendedPaperSize}</span>
                        <span className="text-green-700">• {extractedData.contentMetrics.recommendedColumns} column{extractedData.contentMetrics.recommendedColumns > 1 ? 's' : ''}</span>
                      </p>
                      <p className="text-xs text-green-700 mt-1">{extractedData.contentMetrics.reasoning}</p>
                    </div>
                  )}

                  {/* Show design extraction success */}
                  {extractedData.design && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">Design replicated!</span>
                        <span className="text-blue-700">Colors, layout, and styling extracted</span>
                      </p>
                    </div>
                  )}

                  {/* Preview extracted data */}
                  <div className="bg-white rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                    {extractedData.restaurantName && (
                      <h4 className="font-bold text-lg mb-3">{extractedData.restaurantName}</h4>
                    )}
                    {extractedData.sections.map((section, idx) => (
                      <div key={idx} className="mb-4">
                        <h5 className="font-semibold text-slate-900 mb-2">{section.title}</h5>
                        <div className="space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="text-sm">
                              <div className="flex justify-between items-baseline">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-slate-600">${item.price}</span>
                              </div>
                              {item.description && (
                                <p className="text-xs text-slate-500">{item.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-[#d4f534] hover:bg-[#c4e524] text-[#1a3d35] font-bold"
                    size="lg"
                    onClick={handleConfirmAndEdit}
                  >
                    Continue to Editor
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            {!extractedData && !isProcessing && previewUrl && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Tips for Best Results</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Use good lighting - avoid shadows and glare</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Take photo straight-on, not at an angle</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Ensure all text is in focus and readable</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Include one page at a time for best accuracy</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage