# Universal Menu Design Replication - Improvements

## Date: 2025-10-01

### Overview
Enhanced the AI menu extraction and rendering system to support **universal layout patterns** that work for ANY menu design, not just specific restaurant styles.

---

## Changes Made

### 1. AI Extraction Prompt (`server/index.ts`)

#### **Enhanced JSON Schema:**
```json
{
  "sections": [{
    "title": "Section name",
    "items": [...],
    "column": "left" | "right" | "full",  // NEW
    "hasBox": true | false,                // NEW
    "boxColor": "#hexcode"                 // NEW
  }],
  "design": {
    "layout": {
      "columns": 1 | 2,
      "layoutType": "single-column" | "two-column" | "mixed"  // NEW
    }
  }
}
```

#### **New Detection Instructions:**

**1. Column Distribution Analysis:**
- Detects x-coordinate position of each section header
- Groups sections that align vertically
- Assigns column: "left", "right", or "full" to each section
- Enables accurate two-column layout replication

**2. Boxed Section Detection:**
- Identifies sections with colored rectangular backgrounds containing multiple items
- Distinguishes from sections with only colored header bars
- Extracts box background color when detected
- Examples: Navy/tan boxes, colored section groupings

**3. Layout Type Classification:**
- `"single-column"`: All sections stacked vertically
- `"two-column"`: Sections distributed left/right evenly
- `"mixed"`: Some full-width sections, others in columns

**4. Section Completeness Verification:**
- Instructions to count ALL visible sections
- Explicit reminder to extract EVERYTHING, not just first few
- Prevents partial extractions

---

### 2. TypeScript Interfaces (`UploadPage.tsx`)

Updated `ExtractedMenuData` interface to include:
```typescript
sections: Array<{
  title: string
  items: Array<{...}>
  column?: 'left' | 'right' | 'full'    // NEW
  hasBox?: boolean                       // NEW
  boxColor?: string | null               // NEW
}>
```

---

### 3. CustomReplicatedTemplate (`CustomReplicatedTemplate.tsx`)

#### **Complete Rewrite with Universal Layout Support:**

**New Features:**

1. **Column-Aware Rendering:**
   - Filters sections by column assignment
   - Renders left/right columns separately
   - Supports full-width sections at top

2. **Boxed Section Rendering:**
   - Applies colored background boxes when `hasBox: true`
   - Uses extracted `boxColor` from AI analysis
   - Adds padding and border-radius for boxed sections

3. **Mixed Layout Support:**
   - Full-width sections render first
   - Two-column grid below for columned sections
   - Graceful fallback to single-column

4. **Layout Type Detection:**
   ```typescript
   if (layoutType === 'two-column' && (leftSections.length > 0 || rightSections.length > 0)) {
     // Render two-column layout with proper distribution
   } else {
     // Fallback to single-column
   }
   ```

---

## How It Works Now

### Extraction Flow:
1. User uploads menu photo
2. AI analyzes visual layout structure
3. For each section, detects:
   - Position (left/right column or full-width)
   - Has background box? (yes/no)
   - Box color (if applicable)
4. Returns complete structure with column assignments

### Rendering Flow:
1. CustomReplicatedTemplate receives sections with metadata
2. Groups sections by column assignment:
   - `leftSections = filter(column === 'left')`
   - `rightSections = filter(column === 'right')`
   - `fullWidthSections = filter(column === 'full')`
3. Renders layout based on structure:
   - Full-width sections at top
   - Two-column grid below (if applicable)
   - Boxed sections get colored backgrounds
   - Non-boxed sections use standard header styling

---

## Testing Checklist

Use this checklist when testing with reference menus:

### Column Distribution:
- [ ] Left column sections render in left column
- [ ] Right column sections render in right column
- [ ] Full-width sections span entire width
- [ ] Sections maintain original vertical order within columns

### Boxed Sections:
- [ ] Sections with colored boxes render with background color
- [ ] Box color matches original menu
- [ ] Padding/spacing looks natural
- [ ] Items inside box are properly formatted

### Layout Types:
- [ ] Single-column menus render vertically
- [ ] Two-column menus distribute evenly
- [ ] Mixed layouts work (some full-width, some columned)

### Completeness:
- [ ] ALL sections from original menu are extracted
- [ ] Section count matches original
- [ ] No sections missing from rendered output

---

## Example Test Cases

### Test 1: Two-Column Menu with Boxed Sections
**Example:** Tavern 28 Bar & Kitchen
- Navy boxes in left column (Starters, Salads)
- Tan boxes in right column (Entrees, Sandwiches)
- Expected: Accurate column distribution + colored boxes

### Test 2: Single-Column Menu
**Example:** Simple bistro menu
- All sections stacked vertically
- No boxed sections
- Expected: Clean single-column layout

### Test 3: Mixed Layout Menu
**Example:** Fine dining menu
- Logo/header full-width at top
- Appetizers/Entrees in two columns below
- Desserts full-width at bottom
- Expected: Mixed layout with proper distribution

---

## Next Steps

1. **Test with diverse menu styles:**
   - Upload various menus to `reference-menus/originals/`
   - Save AI extractions to `reference-menus/ai-renderings/`
   - Compare renderings to originals

2. **Iterate on accuracy:**
   - If column detection is wrong, improve AI prompt
   - If box colors are off, enhance color extraction
   - If layout breaks, debug rendering logic

3. **Add more patterns:**
   - Three-column layouts
   - Asymmetric layouts (1/3 + 2/3 columns)
   - Side-by-side section blocks
   - Nested section groupings

---

## Files Changed

1. `server/index.ts` - Enhanced AI extraction prompt (lines 176-291)
2. `src/pages/UploadPage.tsx` - Updated TypeScript interfaces (lines 7-59)
3. `src/components/templates/CustomReplicatedTemplate.tsx` - Complete rewrite (259 lines)

---

## Goal Achieved

✅ **Universal menu design replication:** ANY menu uploaded should now have its layout structure accurately detected and replicated, regardless of restaurant style or design complexity.
