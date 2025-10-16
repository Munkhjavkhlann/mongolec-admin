'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Image as ImageIcon, Type, Quote, List, Code } from 'lucide-react'

// Block types for news articles
type BlockType = 'paragraph' | 'heading' | 'image' | 'quote' | 'list' | 'code'

interface ContentBlock {
  id: string
  type: BlockType
  content: {
    en: string
    mn: string
  }
  metadata?: Record<string, any>
}

const newsArticleSchema = z.object({
  // Multi-language basic fields
  title_en: z.string().min(1, 'English title is required'),
  title_mn: z.string().min(1, 'Mongolian title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt_en: z.string().optional(),
  excerpt_mn: z.string().optional(),
  subtitle_en: z.string().optional(),
  subtitle_mn: z.string().optional(),

  // Content blocks
  blocks: z.array(z.any()),

  // Media
  featuredImage: z.string().optional(),
  socialImage: z.string().optional(),

  // Categorization
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // News metadata
  location_en: z.string().optional(),
  location_mn: z.string().optional(),
  source: z.string().optional(),
  byline_en: z.string().optional(),
  byline_mn: z.string().optional(),

  // Priority and status
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'BREAKING']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']),
  isBreaking: z.boolean(),
  isFeatured: z.boolean(),

  // SEO
  metaTitle_en: z.string().optional(),
  metaTitle_mn: z.string().optional(),
  metaDescription_en: z.string().optional(),
  metaDescription_mn: z.string().optional(),
  keywords_en: z.string().optional(),
  keywords_mn: z.string().optional(),

  // Publishing
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
})

type NewsArticleFormData = z.infer<typeof newsArticleSchema>

export function NewsArticleFormFull() {
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'mn'>('en')
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      id: '1',
      type: 'paragraph',
      content: { en: '', mn: '' },
    },
  ])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsArticleFormData>({
    resolver: zodResolver(newsArticleSchema),
    defaultValues: {
      priority: 'NORMAL',
      status: 'DRAFT',
      isBreaking: false,
      isFeatured: false,
      blocks: [],
    },
  })

  const onSubmit = (data: NewsArticleFormData) => {
    // Transform data to match backend schema
    const transformedData = {
      title: { en: data.title_en, mn: data.title_mn },
      slug: data.slug,
      excerpt: { en: data.excerpt_en || '', mn: data.excerpt_mn || '' },
      subtitle: { en: data.subtitle_en || '', mn: data.subtitle_mn || '' },
      byline: { en: data.byline_en || '', mn: data.byline_mn || '' },
      blocks: blocks,
      featuredImage: data.featuredImage,
      socialImage: data.socialImage,
      categoryId: data.categoryId,
      location: { en: data.location_en || '', mn: data.location_mn || '' },
      source: data.source,
      priority: data.priority,
      status: data.status,
      isBreaking: data.isBreaking,
      isFeatured: data.isFeatured,
      metaTitle: { en: data.metaTitle_en || '', mn: data.metaTitle_mn || '' },
      metaDescription: { en: data.metaDescription_en || '', mn: data.metaDescription_mn || '' },
      keywords: {
        en: data.keywords_en?.split(',').map(k => k.trim()) || [],
        mn: data.keywords_mn?.split(',').map(k => k.trim()) || [],
      },
      publishedAt: data.publishedAt,
      scheduledAt: data.scheduledAt,
    }

    console.log('Submitting:', transformedData)
    // TODO: Call GraphQL mutation
  }

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: { en: '', mn: '' },
      metadata: type === 'image' ? { url: '', alt: { en: '', mn: '' }, caption: { en: '', mn: '' } } : {},
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, lang: 'en' | 'mn', value: string) => {
    setBlocks(blocks.map(block =>
      block.id === id
        ? { ...block, content: { ...block.content, [lang]: value } }
        : block
    ))
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Language Switcher */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Create News Article</h2>
        <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as 'en' | 'mn')}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="mn">Монгол</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the article title and slug</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor={`title_${activeLanguage}`}>
                Title ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
              </Label>
              <Input
                id={`title_${activeLanguage}`}
                {...register(`title_${activeLanguage}` as keyof NewsArticleFormData)}
                placeholder={activeLanguage === 'en' ? 'Enter English title' : 'Монгол гарчиг оруулна уу'}
                onBlur={(e) => {
                  if (activeLanguage === 'en' && !watch('slug')) {
                    setValue('slug', generateSlug(e.target.value))
                  }
                }}
              />
              {errors[`title_${activeLanguage}` as keyof typeof errors] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors[`title_${activeLanguage}` as keyof typeof errors]?.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="article-slug"
              />
              {errors.slug && (
                <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor={`subtitle_${activeLanguage}`}>
                Subtitle ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
              </Label>
              <Input
                id={`subtitle_${activeLanguage}`}
                {...register(`subtitle_${activeLanguage}` as keyof NewsArticleFormData)}
                placeholder={activeLanguage === 'en' ? 'Enter subtitle' : 'Дэд гарчиг оруулна уу'}
              />
            </div>

            <div>
              <Label htmlFor={`excerpt_${activeLanguage}`}>
                Excerpt ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
              </Label>
              <Textarea
                id={`excerpt_${activeLanguage}`}
                {...register(`excerpt_${activeLanguage}` as keyof NewsArticleFormData)}
                placeholder={activeLanguage === 'en' ? 'Brief summary of the article' : 'Нийтлэлийн товч агуулга'}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Blocks */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Content Blocks</CardTitle>
              <CardDescription>Build your article with content blocks</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock('paragraph')}>
                <Type className="h-4 w-4 mr-2" />
                Text
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock('heading')}>
                <Type className="h-4 w-4 mr-2" />
                Heading
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Image
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock('quote')}>
                <Quote className="h-4 w-4 mr-2" />
                Quote
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock('list')}>
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {blocks.map((block, index) => (
            <div key={block.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{block.type} Block</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlock(block.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              {block.type === 'image' ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Image URL"
                    value={block.metadata?.url || ''}
                    onChange={(e) => {
                      setBlocks(blocks.map(b =>
                        b.id === block.id
                          ? { ...b, metadata: { ...b.metadata, url: e.target.value } }
                          : b
                      ))
                    }}
                  />
                  <Input
                    placeholder={activeLanguage === 'en' ? 'Alt text' : 'Зургийн тайлбар'}
                    value={block.metadata?.alt?.[activeLanguage] || ''}
                    onChange={(e) => {
                      setBlocks(blocks.map(b =>
                        b.id === block.id
                          ? {
                              ...b,
                              metadata: {
                                ...b.metadata,
                                alt: { ...b.metadata?.alt, [activeLanguage]: e.target.value }
                              }
                            }
                          : b
                      ))
                    }}
                  />
                  <Textarea
                    placeholder={activeLanguage === 'en' ? 'Caption' : 'Тайлбар'}
                    value={block.content[activeLanguage]}
                    onChange={(e) => updateBlock(block.id, activeLanguage, e.target.value)}
                    rows={2}
                  />
                </div>
              ) : (
                <Textarea
                  placeholder={activeLanguage === 'en' ? `Enter ${block.type} content` : `${block.type} агуулга оруулна уу`}
                  value={block.content[activeLanguage]}
                  onChange={(e) => updateBlock(block.id, activeLanguage, e.target.value)}
                  rows={block.type === 'heading' ? 2 : 4}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Media & Metadata */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                {...register('featuredImage')}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="socialImage">Social Share Image URL</Label>
              <Input
                id="socialImage"
                {...register('socialImage')}
                placeholder="https://example.com/social.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>News Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`location_${activeLanguage}`}>
                Location ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
              </Label>
              <Input
                id={`location_${activeLanguage}`}
                {...register(`location_${activeLanguage}` as keyof NewsArticleFormData)}
                placeholder={activeLanguage === 'en' ? 'Ulaanbaatar, Mongolia' : 'Улаанбаатар, Монгол'}
              />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                {...register('source')}
                placeholder="Reuters, AP, etc."
              />
            </div>
            <div>
              <Label htmlFor={`byline_${activeLanguage}`}>
                Byline ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
              </Label>
              <Input
                id={`byline_${activeLanguage}`}
                {...register(`byline_${activeLanguage}` as keyof NewsArticleFormData)}
                placeholder={activeLanguage === 'en' ? 'By John Doe' : 'Зохиогч: Болд'}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status & Priority */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'BREAKING')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="BREAKING">Breaking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isBreaking"
                checked={watch('isBreaking')}
                onCheckedChange={(checked) => setValue('isBreaking', checked)}
              />
              <Label htmlFor="isBreaking">Breaking News</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={watch('isFeatured')}
                onCheckedChange={(checked) => setValue('isFeatured', checked)}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`metaTitle_${activeLanguage}`}>
              Meta Title ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Input
              id={`metaTitle_${activeLanguage}`}
              {...register(`metaTitle_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'SEO title' : 'SEO гарчиг'}
            />
          </div>

          <div>
            <Label htmlFor={`metaDescription_${activeLanguage}`}>
              Meta Description ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Textarea
              id={`metaDescription_${activeLanguage}`}
              {...register(`metaDescription_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'SEO description' : 'SEO тайлбар'}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor={`keywords_${activeLanguage}`}>
              Keywords ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Input
              id={`keywords_${activeLanguage}`}
              {...register(`keywords_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'keyword1, keyword2, keyword3' : 'түлхүүр_үг1, түлхүүр_үг2'}
            />
            <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Save Article
        </Button>
      </div>
    </form>
  )
}
