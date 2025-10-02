# Reference Menus Testing Workflow

## Purpose
Test and improve the "Replicate My Design" feature that analyzes uploaded menus and recreates their visual design.

## Folder Structure

```
reference-menus/
├── originals/        # Original menu photos (JPG, PNG)
├── ai-renderings/    # AI extraction results (JSON)
├── screenshots/      # Screenshots of rendered output
└── README.md         # This file
```

## Testing Process

### 1. Upload Menu
- Place original menu photo in `originals/`
- Name it descriptively (e.g., `tavern-28.jpg`, `italian-bistro.png`)

### 2. Extract Design
- Upload via http://localhost:5173/upload
- Click "Extract Menu with AI"
- API calls `/api/extract-menu` and returns:
  ```json
  {
    "restaurantName": "...",
    "logo": { ... },
    "sections": [ ... ],
    "contentMetrics": { ... },
    "design": {
      "colors": { ... },
      "sectionHeaderStyle": { ... },
      "layout": { ... },
      "fonts": { ... }
    }
  }
  ```
- Save the JSON response to `ai-renderings/[menu-name].json`

### 3. Replicate Design
- Click "Replicate My Design"
- CustomReplicatedTemplate.tsx renders using extracted design
- Take screenshot and save to `screenshots/[menu-name]-rendered.png`

### 4. Compare & Iterate
- Compare original vs rendered
- Document gaps/issues below
- Improve extraction prompt in `server/index.ts`
- Improve rendering in `CustomReplicatedTemplate.tsx`
- Re-test

## Current Test Cases

### Test 1: Tavern 28 Bar & Kitchen
- **File:** `originals/tavern-28.jpg`
- **Style:** Navy/tan color scheme, 2-column layout
- **Status:** Testing
- **Issues:**
  - [ ] PREVIEW_SCALE undefined error (FIXED)
  - [ ] Color extraction accuracy
  - [ ] Section header styling
  - [ ] Spacing/layout match
  - [ ] Font matching

## Design Extraction Checklist

For each menu, verify AI extracts:
- [ ] Background color (hex code)
- [ ] Section header background color
- [ ] Section header text color
- [ ] Body text color
- [ ] Price text color
- [ ] Divider/border colors
- [ ] Column layout (1, 2, or 3)
- [ ] Section header style (colored box vs plain)
- [ ] Header alignment (left, center, full-width)
- [ ] Spacing (tight, normal, loose)
- [ ] Font styles (serif vs sans-serif)

## Rendering Improvement Ideas

### Short-term
- [ ] More accurate color matching
- [ ] Better section header rendering
- [ ] Improved spacing calculations
- [ ] Logo placement options

### Long-term
- [ ] Border/divider styles (dotted, solid, dashed)
- [ ] Background patterns/textures
- [ ] Custom decorative elements
- [ ] Font weight variations
- [ ] Multi-color schemes
- [ ] Page backgrounds (watermarks, patterns)

## Notes
- Keep original menu photos here for comparison
- Document AI extraction accuracy
- Track rendering improvements over time
- Build a test suite of diverse menu styles
