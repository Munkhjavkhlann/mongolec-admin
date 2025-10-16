'use client'

import { ContentBlockProps, HeadingLevel, ListType } from './types'
import { BlockToolbar } from './block-toolbar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'

export function ContentBlock({
  block,
  language,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  editable = true,
}: ContentBlockProps) {
  const updateContent = (lang: 'en' | 'mn', value: string) => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        [lang]: value,
      },
    })
  }

  const updateMetadata = (key: string, value: any) => {
    onUpdate(block.id, {
      metadata: {
        ...block.metadata,
        [key]: value,
      },
    })
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">English</Label>
              <Textarea
                value={block.content.en}
                onChange={(e) => updateContent('en', e.target.value)}
                placeholder="Enter paragraph text in English..."
                className="min-h-[80px] mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Mongolian</Label>
              <Textarea
                value={block.content.mn}
                onChange={(e) => updateContent('mn', e.target.value)}
                placeholder="Enter paragraph text in Mongolian..."
                className="min-h-[80px] mt-1"
                disabled={!editable}
              />
            </div>
          </div>
        )

      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Level</Label>
              <Select
                value={block.metadata?.level?.toString() || '1'}
                onValueChange={(value) =>
                  updateMetadata('level', parseInt(value) as HeadingLevel)
                }
                disabled={!editable}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="1">Heading 1</SelectItem>
                  <SelectItem value="2">Heading 2</SelectItem>
                  <SelectItem value="3">Heading 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">English</Label>
              <Input
                value={block.content.en}
                onChange={(e) => updateContent('en', e.target.value)}
                placeholder="Enter heading text in English..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Mongolian</Label>
              <Input
                value={block.content.mn}
                onChange={(e) => updateContent('mn', e.target.value)}
                placeholder="Enter heading text in Mongolian..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Image URL</Label>
              <Input
                value={block.metadata?.url || ''}
                onChange={(e) => updateMetadata('url', e.target.value)}
                placeholder="Enter image URL..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Alt Text (English)</Label>
              <Input
                value={block.metadata?.alt?.en || ''}
                onChange={(e) =>
                  updateMetadata('alt', {
                    ...block.metadata?.alt,
                    en: e.target.value,
                  })
                }
                placeholder="Enter alt text in English..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Alt Text (Mongolian)</Label>
              <Input
                value={block.metadata?.alt?.mn || ''}
                onChange={(e) =>
                  updateMetadata('alt', {
                    ...block.metadata?.alt,
                    mn: e.target.value,
                  })
                }
                placeholder="Enter alt text in Mongolian..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Caption (English)</Label>
              <Input
                value={block.content.en}
                onChange={(e) => updateContent('en', e.target.value)}
                placeholder="Enter caption in English..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Caption (Mongolian)</Label>
              <Input
                value={block.content.mn}
                onChange={(e) => updateContent('mn', e.target.value)}
                placeholder="Enter caption in Mongolian..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
            {block.metadata?.url && (
              <div className="mt-4">
                <img
                  src={block.metadata.url}
                  alt={block.metadata?.alt?.[language] || ''}
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}
          </div>
        )

      case 'quote':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Quote (English)</Label>
              <Textarea
                value={block.content.en}
                onChange={(e) => updateContent('en', e.target.value)}
                placeholder="Enter quote in English..."
                className="min-h-[80px] mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quote (Mongolian)</Label>
              <Textarea
                value={block.content.mn}
                onChange={(e) => updateContent('mn', e.target.value)}
                placeholder="Enter quote in Mongolian..."
                className="min-h-[80px] mt-1"
                disabled={!editable}
              />
            </div>
          </div>
        )

      case 'list':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">List Type</Label>
              <Select
                value={block.metadata?.listType || 'bullet'}
                onValueChange={(value) =>
                  updateMetadata('listType', value as ListType)
                }
                disabled={!editable}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="bullet">Bullet List</SelectItem>
                  <SelectItem value="numbered">Numbered List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                List Items (English) - One per line
              </Label>
              <Textarea
                value={block.content.en}
                onChange={(e) => updateContent('en', e.target.value)}
                placeholder="Enter list items, one per line..."
                className="min-h-[120px] mt-1 font-mono text-sm"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                List Items (Mongolian) - One per line
              </Label>
              <Textarea
                value={block.content.mn}
                onChange={(e) => updateContent('mn', e.target.value)}
                placeholder="Enter list items, one per line..."
                className="min-h-[120px] mt-1 font-mono text-sm"
                disabled={!editable}
              />
            </div>
          </div>
        )

      case 'code':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Language</Label>
              <Input
                value={block.metadata?.language || 'javascript'}
                onChange={(e) => updateMetadata('language', e.target.value)}
                placeholder="e.g., javascript, python, html..."
                className="mt-1"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Code (English)</Label>
              <Textarea
                value={block.content.en}
                onChange={(e) => updateContent('en', e.target.value)}
                placeholder="Enter code..."
                className="min-h-[150px] mt-1 font-mono text-sm"
                disabled={!editable}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Code (Mongolian)</Label>
              <Textarea
                value={block.content.mn}
                onChange={(e) => updateContent('mn', e.target.value)}
                placeholder="Enter code or translation..."
                className="min-h-[150px] mt-1 font-mono text-sm"
                disabled={!editable}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="group relative mb-4 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {editable && (
          <div className="flex-shrink-0 pt-1">
            <BlockToolbar
              blockId={block.id}
              blockType={block.type}
              onChangeType={(type) => onUpdate(block.id, { type })}
              onDelete={() => onDelete(block.id)}
              onMoveUp={() => onMoveUp(block.id)}
              onMoveDown={() => onMoveDown(block.id)}
              isFirst={isFirst}
              isLast={isLast}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">{renderBlockContent()}</div>
      </div>
    </Card>
  )
}
