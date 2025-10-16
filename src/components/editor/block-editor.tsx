'use client'

import { useState, useCallback } from 'react'
import { BlockEditorProps, ContentBlock, BlockType, Language } from './types'
import { ContentBlock as ContentBlockComponent } from './content-block'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
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
  code: 'Code Block',
}

function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function BlockEditor({
  initialBlocks = [],
  onChange,
  editable = true,
  className = '',
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialBlocks.length > 0
      ? initialBlocks
      : [
          {
            id: generateId(),
            type: 'paragraph',
            content: { en: '', mn: '' },
          },
        ]
  )
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  const handleBlocksChange = useCallback(
    (newBlocks: ContentBlock[]) => {
      setBlocks(newBlocks)
      onChange?.(newBlocks)
    },
    [onChange]
  )

  const addBlock = useCallback(
    (type: BlockType) => {
      const newBlock: ContentBlock = {
        id: generateId(),
        type,
        content: { en: '', mn: '' },
        metadata:
          type === 'heading'
            ? { level: 2 }
            : type === 'list'
              ? { listType: 'bullet' }
              : type === 'code'
                ? { language: 'javascript' }
                : undefined,
      }
      handleBlocksChange([...blocks, newBlock])
    },
    [blocks, handleBlocksChange]
  )

  const updateBlock = useCallback(
    (id: string, updates: Partial<ContentBlock>) => {
      handleBlocksChange(
        blocks.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        )
      )
    },
    [blocks, handleBlocksChange]
  )

  const deleteBlock = useCallback(
    (id: string) => {
      if (blocks.length === 1) {
        handleBlocksChange([
          {
            id: generateId(),
            type: 'paragraph',
            content: { en: '', mn: '' },
          },
        ])
      } else {
        handleBlocksChange(blocks.filter((block) => block.id !== id))
      }
    },
    [blocks, handleBlocksChange]
  )

  const moveBlockUp = useCallback(
    (id: string) => {
      const index = blocks.findIndex((block) => block.id === id)
      if (index > 0) {
        const newBlocks = [...blocks]
        ;[newBlocks[index - 1], newBlocks[index]] = [
          newBlocks[index],
          newBlocks[index - 1],
        ]
        handleBlocksChange(newBlocks)
      }
    },
    [blocks, handleBlocksChange]
  )

  const moveBlockDown = useCallback(
    (id: string) => {
      const index = blocks.findIndex((block) => block.id === id)
      if (index < blocks.length - 1) {
        const newBlocks = [...blocks]
        ;[newBlocks[index], newBlocks[index + 1]] = [
          newBlocks[index + 1],
          newBlocks[index],
        ]
        handleBlocksChange(newBlocks)
      }
    },
    [blocks, handleBlocksChange]
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Language Tabs */}
      <Tabs
        value={currentLanguage}
        onValueChange={(value) => setCurrentLanguage(value as Language)}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="mn">Mongolian</TabsTrigger>
          </TabsList>

          {editable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Block
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 z-50 bg-popover"
                sideOffset={5}
              >
                {(Object.keys(blockTypeLabels) as BlockType[]).map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => addBlock(type)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {blockTypeIcons[type]}
                    <span>{blockTypeLabels[type]}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <TabsContent value="en" className="mt-0">
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <ContentBlockComponent
                key={block.id}
                block={block}
                language="en"
                onUpdate={updateBlock}
                onDelete={deleteBlock}
                onMoveUp={moveBlockUp}
                onMoveDown={moveBlockDown}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                editable={editable}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mn" className="mt-0">
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <ContentBlockComponent
                key={block.id}
                block={block}
                language="mn"
                onUpdate={updateBlock}
                onDelete={deleteBlock}
                onMoveUp={moveBlockUp}
                onMoveDown={moveBlockDown}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                editable={editable}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Block Button at Bottom */}
      {editable && (
        <div className="flex justify-center pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-48 z-50 bg-popover"
              sideOffset={5}
            >
              {(Object.keys(blockTypeLabels) as BlockType[]).map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => addBlock(type)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {blockTypeIcons[type]}
                  <span>{blockTypeLabels[type]}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
