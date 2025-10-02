import 'dotenv/config'
import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import multer from 'multer'
import mammoth from 'mammoth'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Increase JSON payload limit for base64 images
app.use(express.json({ limit: '50mb' }))
app.use(express.static(join(__dirname, '../dist')))

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// AI Design Analysis endpoint
app.post('/api/analyze-design', async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Extract base64 data from data URL
    const base64Data = image.split(',')[1]
    const mediaType = image.split(';')[0].split(':')[1] || 'image/jpeg'

    // Call Claude API with vision
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: `Analyze ONLY the VISUAL DESIGN of this menu (NOT the content). I need to recreate its exact visual appearance.

Focus on these specific design elements:

1. COLORS - Extract exact hex codes:
   - What is the main background color? (e.g., white #FFFFFF, cream, etc.)
   - What color are the section headers? (e.g., navy blue boxes, colored backgrounds)
   - What color is the text on section headers?
   - What color is the body text for item names?
   - What color are the prices?
   - What color are borders/lines/dividers?

2. SECTION HEADER STYLE:
   - Are section headers in colored boxes/backgrounds or just text?
   - If colored boxes, what's the exact color?
   - Is the text white, black, or another color on those headers?
   - Are headers centered, left-aligned, or full-width blocks?

3. LAYOUT STRUCTURE:
   - How many columns? (1, 2, or 3)
   - How are menu items arranged?
   - What's the spacing between sections?
   - Are there horizontal lines/dividers between items or sections?

4. TEXT STYLING:
   - Are headers serif or sans-serif?
   - Is body text serif or sans-serif?
   - What's the visual hierarchy (which elements are largest/boldest)?

Return ONLY this JSON (no markdown, no explanation):
{
  "colors": {
    "pageBackground": "#hexcode",
    "sectionHeaderBackground": "#hexcode (color of section title boxes/backgrounds)",
    "sectionHeaderText": "#hexcode (text color on section headers)",
    "bodyText": "#hexcode",
    "priceText": "#hexcode",
    "dividerColor": "#hexcode"
  },
  "sectionHeaderStyle": {
    "hasColoredBackground": true or false,
    "isFullWidth": true or false,
    "alignment": "left" or "center"
  },
  "layout": {
    "columns": 1 or 2,
    "hasDividers": true or false,
    "sectionSpacing": "tight" or "normal" or "loose"
  },
  "fonts": {
    "headerFont": "serif" or "sans-serif",
    "bodyFont": "serif" or "sans-serif"
  }
}`
            }
          ]
        }
      ]
    })

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    let jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : responseText

    const designData = JSON.parse(jsonString)

    res.json(designData)
  } catch (error) {
    console.error('Design analysis error:', error)
    res.status(500).json({
      error: 'Failed to analyze design',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// AI Menu Extraction endpoint - Extracts BOTH content AND design
app.post('/api/extract-menu', async (req, res) => {
  try {
    const { image, imageType } = req.body

    if (!image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Extract base64 data from data URL
    const base64Data = image.split(',')[1]
    const mediaType = imageType || 'image/jpeg'

    // Call Claude API with vision - EXTRACT BOTH CONTENT AND DESIGN
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: `Extract BOTH the menu content AND visual design from this image, including layout structure analysis.

CRITICAL: Extract ALL sections visible in the menu - count them carefully and ensure none are missed.

Return this EXACT JSON structure (with concrete examples):
{
  "restaurantName": "Name of restaurant if visible",
  "logo": {
    "present": true or false,
    "description": "Description of logo style, colors, and any text",
    "position": "top-center" | "top-left" | "top-right" | "header",
    "hasText": true or false
  },
  "sections": [
    {
      "title": "APPETIZERS",
      "column": "left",
      "hasBox": true,
      "boxColor": "#2d4a5e",
      "items": [
        {
          "name": "Item name",
          "description": "Item description",
          "price": "12.99"
        }
      ]
    },
    {
      "title": "ENTREES",
      "column": "right",
      "hasBox": false,
      "boxColor": null,
      "items": [...]
    },
    {
      "title": "DESSERTS",
      "column": "full",
      "hasBox": true,
      "boxColor": "#c4a574",
      "items": [...]
    }
  ],
  "contentMetrics": {
    "totalItems": number,
    "totalCharacters": number,
    "averageDescriptionLength": number,
    "recommendedPaperSize": "8.5x11" | "11x17",
    "recommendedColumns": 1 or 2,
    "reasoning": "Brief explanation of recommendation"
  },
  "design": {
    "colors": {
      "pageBackground": "#hexcode",
      "sectionHeaderBackground": "#hexcode (color of section title boxes/backgrounds)",
      "sectionHeaderText": "#hexcode (text color on section headers)",
      "bodyText": "#hexcode",
      "priceText": "#hexcode",
      "dividerColor": "#hexcode"
    },
    "sectionHeaderStyle": {
      "hasColoredBackground": true or false,
      "isFullWidth": true or false,
      "alignment": "left" or "center"
    },
    "layout": {
      "columns": 1 or 2,
      "hasDividers": true or false,
      "sectionSpacing": "tight" or "normal" or "loose",
      "layoutType": "single-column" | "two-column" | "mixed"
    },
    "fonts": {
      "headerFont": "serif" or "sans-serif",
      "bodyFont": "serif" or "sans-serif"
    }
  }
}

CRITICAL FIELD ORDER FOR SECTIONS:
Each section object MUST have fields in this order:
1. "title": "Section Name"
2. "column": "left" | "right" | "full"  ← REQUIRED, NEVER OMIT
3. "hasBox": true | false                ← REQUIRED, NEVER OMIT
4. "boxColor": "#hexcode" | null         ← REQUIRED, NEVER OMIT
5. "items": [...]

Example of CORRECT section structure:
{
  "title": "SHAREABLES",
  "column": "left",
  "hasBox": true,
  "boxColor": "#2d4a5e",
  "items": [
    {"name": "Wings", "description": "Buffalo sauce", "price": "14"}
  ]
}

CONTENT EXTRACTION:
- Extract ALL menu items verbatim
- Keep section names as they appear
- Extract descriptions word-for-word
- For prices, extract only the number (remove $ and currency)
- Maintain original order
- Count total items and calculate metrics

LOGO DETECTION:
- Look for restaurant logo, emblem, or branding at top of menu
- Note if logo contains text (restaurant name in stylized font)
- Describe logo style (modern, classic, elegant, casual, etc.)
- Note logo position relative to menu content

PAPER SIZE RECOMMENDATION:
- <20 items: recommend 8.5x11" single column
- 20-40 items: recommend 11x17" with 2 columns OR 8.5x11" with 2 columns
- >40 items: recommend 11x17" with 2 columns
- Consider description length (longer = need more space)

LAYOUT STRUCTURE ANALYSIS (CRITICAL - MUST BE INCLUDED FOR EVERY SECTION):

**IMPORTANT:** Every section object MUST include "column", "hasBox", and "boxColor" fields. Do NOT omit these!

1. COLUMN DISTRIBUTION (REQUIRED FOR EACH SECTION):
   - Analyze the x-coordinate position of EACH section header
   - Sections in left half of page → "column": "left"
   - Sections in right half of page → "column": "right"
   - Sections spanning full width → "column": "full"
   - If single-column menu → ALL sections get "column": "full"
   - EVERY section MUST have a "column" field - NO EXCEPTIONS

2. BOXED vs NON-BOXED SECTIONS (REQUIRED FOR EACH SECTION):

   **CRITICAL:** Ignore the header - focus ONLY on the CONTENT AREA where menu items sit.

   **THE ONLY RULE THAT MATTERS:**
   → Look at where the MENU ITEMS are (not the section title)
   → What is the background color BEHIND the item names and prices?
   → If DARK (navy, tan, any dark color) → hasBox=true, boxColor=#that_dark_color
   → If LIGHT (white, cream, light gray) → hasBox=false, boxColor=null

   **VISUAL DISTINCTION:**

   hasBox=FALSE (Header-only style):
   - Section title on colored bar/box at top
   - THEN menu items on WHITE/CREAM/LIGHT background below
   - Item text is DARK colored (black, dark gray, navy)
   - Visual: [COLORED HEADER] then [WHITE AREA with dark text items]
   - Example: Navy header bar, then white space with "Buffalo Wings $12" in black text

   hasBox=TRUE (Full box style):
   - ENTIRE section in one continuous colored rectangle
   - Menu items sit INSIDE the colored box
   - Item text is LIGHT/WHITE colored
   - Visual: [ONE BIG COLORED BOX containing header + all items]
   - Example: Navy box with "Wings $12" in white text inside the box

   **STEP-BY-STEP TEST FOR EACH SECTION:**
   1. Find the section title (usually on colored background)
   2. Look BELOW the title at the first menu item name and price
   3. **CRITICAL:** Compare the background color of the HEADER vs the ITEMS:
      - If header is dark BUT items sit on white/light → hasBox=false (header-only style)
      - If header AND items are BOTH on same dark color → hasBox=true (full box style)
   4. Sample the background color at multiple points in the item area (not just near header)
   5. Repeat for ALL sections - don't assume left/right column patterns

   **COLOR MEASUREMENT TEST:**
   For EACH section, check the background color values:
   - Header background: (measure RGB)
   - First menu item background: (measure RGB BELOW the header, not touching it)
   - If item background RGB values are > 200 (light/white) → hasBox=false
   - If item background RGB values are < 100 (dark) → hasBox=true
   - The key: Header and items must MATCH for hasBox=true

   **TEXT COLOR IS THE GIVEAWAY:**
   - White/light text on items (RGB > 200) → hasBox=true (items are on dark background)
   - Dark/black text on items (RGB < 100) → hasBox=false (items are on light background)

   **COMMON MISTAKE TO AVOID:**
   ❌ WRONG: "Header is colored, so hasBox=true"
   ✓ CORRECT: "Items are on white background below colored header, so hasBox=false"

   **REAL-WORLD EXAMPLE:**
   Imagine a menu section called "APPETIZERS":

   Pattern A (hasBox=FALSE) - HEADER-ONLY STYLE:
   ╔════════════════════╗
   ║ APPETIZERS (navy) ║ ← Navy colored header bar (RGB: 45, 74, 94)
   ╚════════════════════╝
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ← VISIBLE SEPARATION - background changes!
   Wings.........$12      ← BLACK text (RGB: 0,0,0) on WHITE/CREAM (RGB: 255,250,245)
   Nachos........$10      ← BLACK text (RGB: 0,0,0) on WHITE/CREAM (RGB: 255,250,245)
   → Notice: Header is navy, items are on white = hasBox:FALSE

   Pattern B (hasBox=TRUE) - FULL BOX STYLE:
   ╔══════════════════════════════╗
   ║ APPETIZERS (white text)      ║ ← Navy background (RGB: 45, 74, 94)
   ║ Wings.........$12 (white)    ║ ← WHITE text (RGB: 255,255,255) on NAVY (RGB: 45, 74, 94)
   ║ Nachos........$10 (white)    ║ ← WHITE text (RGB: 255,255,255) on NAVY (RGB: 45, 74, 94)
   ╚══════════════════════════════╝
   → Notice: Everything in one navy box = hasBox:TRUE

   **CRITICAL DISTINCTION:**
   - Pattern A: Two different backgrounds (navy header + white items)
   - Pattern B: One continuous background (all navy)

   **DETECTION ALGORITHM:**
   For EACH section:
   1. Locate the section title
   2. Move your eyes DOWN to the first menu item name
   3. Look at the space BETWEEN the title and the item
   4. Ask: "Did the background color CHANGE from dark to light?"
      - YES, it changed → hasBox=false (header-only)
      - NO, still same dark color → hasBox=true (full box)
   5. Confirm by checking item text color:
      - Light/white text → hasBox=true
      - Dark/black text → hasBox=false

   **FINAL CHECK:**
   If you marked a section hasBox=true, verify you can see WHITE/LIGHT text for the menu items.
   If the items are in DARK/BLACK text, change it to hasBox=false!

   - EVERY section MUST have "hasBox" and "boxColor" fields - NO EXCEPTIONS

3. LAYOUT TYPE DETECTION (REQUIRED IN design.layout):
   - "single-column": All sections stacked vertically
   - "two-column": Sections distributed left/right evenly
   - "mixed": Some full-width sections, others in columns
   - MUST set "layoutType" field in design.layout object

4. SECTION COMPLETENESS (CRITICAL):
   - **BEFORE YOU START:** Count ALL section headers visible in the image
   - Write down that number
   - Extract EVERY SINGLE section you counted
   - **AFTER EXTRACTION:** Verify your sections array length matches the count
   - Common mistake: Stopping after first column - EXTRACT BOTH COLUMNS
   - Common mistake: Missing sections at bottom of image - SCROLL/LOOK EVERYWHERE
   - If you counted 7 sections, you MUST return 7 section objects
   - DO NOT stop early - extract until you've got them all

VALIDATION CHECKLIST BEFORE RETURNING JSON:
✓ Does EVERY section have a "column" field? (left/right/full)
✓ Does EVERY section have a "hasBox" field? (true/false)
✓ Does EVERY section have a "boxColor" field? (#hexcode or null)
✓ Does design.layout have "layoutType" field? (single-column/two-column/mixed)
✓ Are ALL sections from the image included? (Count them - do NOT miss any!)
✓ Did you check BOTH columns? (Don't stop after first column)
✓ For each hasBox=true, did you verify items are on DARK background with LIGHT text?
✓ For each hasBox=false, did you verify items are on LIGHT background with DARK text?

DESIGN EXTRACTION:
- Identify exact colors (hex codes)
- Analyze section header styling (colored boxes vs plain text)
- Note layout structure (columns, dividers, spacing)
- Identify font styles (serif vs sans-serif)

Return ONLY valid JSON, no other text`
            }
          ]
        }
      ]
    })

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response (Claude might wrap it in markdown)
    let jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : responseText

    const extractedData = JSON.parse(jsonString)

    // Debug logging
    console.log('\n=== MENU EXTRACTION DEBUG ===')
    console.log('Total sections extracted:', extractedData.sections?.length || 0)
    console.log('Layout type:', extractedData.design?.layout?.layoutType || 'not detected')
    console.log('Sections with column assignments:', extractedData.sections?.filter((s: any) => s.column).length || 0)
    console.log('Sections with boxes:', extractedData.sections?.filter((s: any) => s.hasBox).length || 0)
    console.log('\nSection details:')
    extractedData.sections?.forEach((s: any, idx: number) => {
      console.log(`  ${idx + 1}. ${s.title}: column=${s.column || 'none'}, hasBox=${s.hasBox || false}, boxColor=${s.boxColor || 'none'}`)
    })
    console.log('=== END DEBUG ===\n')

    res.json(extractedData)
  } catch (error) {
    console.error('Menu extraction error:', error)
    res.status(500).json({
      error: 'Failed to extract menu data',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Word document extraction endpoint
app.post('/api/extract-word', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document provided' })
    }

    // Extract text from Word document
    const result = await mammoth.extractRawText({ buffer: req.file.buffer })
    const text = result.value

    console.log('\n=== WORD DOCUMENT EXTRACTION ===')
    console.log('Document size:', req.file.size, 'bytes')
    console.log('Text length:', text.length, 'characters')

    // Parse the text into menu structure
    const parsedMenu = parseWordDocument(text)

    console.log('Sections extracted:', parsedMenu.sections.length)
    console.log('Restaurant name:', parsedMenu.restaurantName || 'Not detected')
    console.log('=== END EXTRACTION ===\n')

    res.json(parsedMenu)
  } catch (error) {
    console.error('Word extraction error:', error)
    res.status(500).json({
      error: 'Failed to extract Word document',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Helper function to parse Word document text into menu structure
function parseWordDocument(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  const sections: any[] = []
  let currentSection: any = null
  let restaurantName = ''

  // Price patterns to detect
  const pricePattern = /\$?\d+(\.\d{2})?|\d+\.\d{2}$/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Try to detect restaurant name (usually first few lines, all caps or title case)
    if (i < 3 && line.length < 50 && !pricePattern.test(line) && !restaurantName) {
      if (line === line.toUpperCase() || /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(line)) {
        restaurantName = line
        continue
      }
    }

    // Detect section headers (all caps, no price, or followed by multiple items)
    const isAllCaps = line === line.toUpperCase() && line.length < 100
    const hasNoPrice = !pricePattern.test(line)
    const nextLinesHaveItems = i < lines.length - 2 &&
      lines.slice(i + 1, i + 3).some(l => pricePattern.test(l))

    if ((isAllCaps || nextLinesHaveItems) && hasNoPrice && line.length < 100) {
      // Start new section
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection)
      }

      currentSection = {
        title: line,
        items: []
      }
      continue
    }

    // Detect menu items (has a price)
    const priceMatch = line.match(/\$?(\d+(?:\.\d{2})?)$/)
    if (priceMatch && currentSection) {
      const price = priceMatch[1]
      const nameAndDesc = line.substring(0, line.lastIndexOf(priceMatch[0])).trim()

      // Split name and description (description is often in lowercase or after a dash/period)
      let name = nameAndDesc
      let description = ''

      const descSplit = nameAndDesc.match(/^([^.-]+)[\s.-]+(.+)/)
      if (descSplit) {
        name = descSplit[1].trim()
        description = descSplit[2].trim()
      }

      currentSection.items.push({
        name: name,
        description: description,
        price: price
      })
    }
  }

  // Add last section
  if (currentSection && currentSection.items.length > 0) {
    sections.push(currentSection)
  }

  return {
    restaurantName: restaurantName || undefined,
    sections: sections
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API Key configured: ${!!process.env.ANTHROPIC_API_KEY}`)
})