'use client'

import { BlockToolbarProps, BlockType } from './types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Quote,
  List,
  Code,
} from 'lucide-react'

const blockTypeIcons: Record<BlockType, React.ReactNode> = {
  paragraph: <Type className="h-4 w-4" />,
  heading: <Heading1 className="h-4 w-4" />,
  image: <Image className="h-4 w-4" />,
  quote: <Quote className="h-4 w-4" />,
  list: <List className="h-4 w-4" />,
  code: <Code className="h-4 w-4" />,
}

const blockTypeLabels: Record<BlockType, string> = {
  paragraph: 'Paragraph',
  heading: 'Heading',
  image: 'Image',
  quote: 'Quote',
  list: 'List',
  code: 'Code',
}

export function BlockToolbar({
  blockId,
  blockType,
  onChangeType,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: BlockToolbarProps) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Drag Handle */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
        type="button"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </Button>

      {/* Block Type Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 gap-1"
            type="button"
          >
            {blockTypeIcons[blockType]}
            <span className="text-xs text-muted-foreground">
              {blockTypeLabels[blockType]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-48 z-50 bg-popover"
          sideOffset={5}
        >
          {(Object.keys(blockTypeLabels) as BlockType[]).map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => onChangeType(type)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {blockTypeIcons[type]}
              <span>{blockTypeLabels[type]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Move Up */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onMoveUp}
        disabled={isFirst}
        type="button"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      {/* Move Down */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onMoveDown}
        disabled={isLast}
        type="button"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onDelete}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
