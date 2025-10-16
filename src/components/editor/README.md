# Custom Block Editor

A fully custom block-based content editor built with shadcn/ui components for multi-language content management.

## Features

- **No External Dependencies**: Built entirely with shadcn/ui components (no BlockNote, Tiptap, etc.)
- **Multi-Language Support**: English and Mongolian content editing with tabs
- **Block Types**:
  - Paragraph (rich text)
  - Heading (H1, H2, H3)
  - Image (with URL, alt text, caption)
  - Quote
  - List (bullet/numbered)
  - Code block (with syntax language)
- **Block Controls**:
  - Drag handle (visual indicator)
  - Block type switcher
  - Move up/down buttons
  - Delete button
  - All controls hidden until hover
- **Proper Z-Index**: Dropdowns and popovers properly layered above content
- **Clean UI**: Professional styling with hover effects and smooth transitions

## Usage

```tsx
'use client'

import { useState } from 'react'
import { BlockEditor, ContentBlockType } from '@/components/editor'

export default function ExamplePage() {
  const [blocks, setBlocks] = useState<ContentBlockType[]>([
    {
      id: '1',
      type: 'heading',
      content: {
        en: 'Welcome to the Block Editor',
        mn: 'Блок засварлагч руу тавтай морил',
      },
      metadata: { level: 1 },
    },
    {
      id: '2',
      type: 'paragraph',
      content: {
        en: 'This is a custom block editor built with shadcn/ui.',
        mn: 'Энэ бол shadcn/ui ашигласан захиалгат блок засварлагч юм.',
      },
    },
  ])

  const handleChange = (newBlocks: ContentBlockType[]) => {
    setBlocks(newBlocks)
    console.log('Blocks updated:', newBlocks)
    // Save to backend, etc.
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Content</h1>
      <BlockEditor
        initialBlocks={blocks}
        onChange={handleChange}
        editable={true}
      />
    </div>
  )
}
```

## Data Structure

The editor works with the following JSON structure:

```typescript
interface ContentBlock {
  id: string
  type: 'paragraph' | 'heading' | 'image' | 'quote' | 'list' | 'code'
  content: {
    en: string
    mn: string
  }
  metadata?: {
    level?: 1 | 2 | 3          // for headings
    url?: string                // for images
    alt?: {en: string, mn: string}  // for images
    caption?: {en: string, mn: string}  // for images
    listType?: 'bullet' | 'numbered'  // for lists
    language?: string           // for code blocks
  }
}
```

## Components

### BlockEditor (Main Component)

**Props:**
- `initialBlocks?: ContentBlock[]` - Initial content blocks
- `onChange?: (blocks: ContentBlock[]) => void` - Callback when blocks change
- `editable?: boolean` - Enable/disable editing (default: true)
- `className?: string` - Additional CSS classes

### ContentBlock

Renders individual blocks with appropriate inputs based on block type.

### BlockToolbar

Provides block controls (drag, type switcher, move, delete).

## Styling

All components use shadcn/ui components and Tailwind CSS. The editor includes:

- Proper z-index layering (z-50 for dropdowns/popovers)
- Hover effects on blocks
- Smooth transitions
- Responsive design
- Clean, minimal UI

## Z-Index Hierarchy

- Base content: z-0 (default)
- Block cards: z-1 (auto)
- Dropdowns/Popovers: z-50
- Background overlays: Handled by Radix UI

This ensures dropdowns always appear above content without text showing through.
