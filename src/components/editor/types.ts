export type BlockType = 'paragraph' | 'heading' | 'image' | 'quote' | 'list' | 'code'
export type Language = 'en' | 'mn'
export type ListType = 'bullet' | 'numbered'
export type HeadingLevel = 1 | 2 | 3

export interface ContentBlock {
  id: string
  type: BlockType
  content: {
    en: string
    mn: string
  }
  metadata?: {
    level?: HeadingLevel
    url?: string
    alt?: {
      en: string
      mn: string
    }
    caption?: {
      en: string
      mn: string
    }
    listType?: ListType
    language?: string
  }
}

export interface BlockEditorProps {
  initialBlocks?: ContentBlock[]
  onChange?: (blocks: ContentBlock[]) => void
  editable?: boolean
  className?: string
}

export interface ContentBlockProps {
  block: ContentBlock
  language: Language
  onUpdate: (id: string, updates: Partial<ContentBlock>) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  isFirst: boolean
  isLast: boolean
  editable?: boolean
}

export interface BlockToolbarProps {
  blockId: string
  blockType: BlockType
  onChangeType: (type: BlockType) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}
