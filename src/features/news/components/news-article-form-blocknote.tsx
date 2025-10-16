'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SerializedEditorState } from 'lexical'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MultiLanguageEditor } from '@/components/editor/multi-language-editor'

const initialEditorState = {
  root: {
    children: [
      {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState

const newsArticleSchema = z.object({
  // Multi-language basic fields
  title_en: z.string().min(1, 'English title is required'),
  title_mn: z.string().min(1, 'Mongolian title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt_en: z.string().optional(),
  excerpt_mn: z.string().optional(),
  subtitle_en: z.string().optional(),
  subtitle_mn: z.string().optional(),

  // Media
  featuredImage: z.string().optional(),
  socialImage: z.string().optional(),

  // Categorization
  categoryId: z.string().optional(),

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

export function NewsArticleFormBlockNote() {
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'mn'>('en')
  const [contentEn, setContentEn] = useState<SerializedEditorState>(initialEditorState)
  const [contentMn, setContentMn] = useState<SerializedEditorState>(initialEditorState)

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
      blocks: { en: contentEn, mn: contentMn },
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Create News Article</h2>
          <p className="text-muted-foreground mt-2">
            Create a professional news article with rich content blocks
          </p>
        </div>
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
          <CardDescription>Enter the article title, slug, and subtitle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`title_${activeLanguage}`}>
              Title ({activeLanguage === 'en' ? 'English' : 'Mongolian'}) *
            </Label>
            <Input
              id={`title_${activeLanguage}`}
              {...register(`title_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'Enter article title' : 'Нийтлэлийн гарчиг'}
              className="text-lg font-medium"
              onBlur={(e) => {
                if (activeLanguage === 'en' && !watch('slug')) {
                  setValue('slug', generateSlug(e.target.value))
                }
              }}
            />
            {errors[`title_${activeLanguage}` as keyof typeof errors] && (
              <p className="text-sm text-destructive mt-1">
                {errors[`title_${activeLanguage}` as keyof typeof errors]?.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="article-url-slug"
            />
            {errors.slug && (
              <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`subtitle_${activeLanguage}`}>
              Subtitle ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Input
              id={`subtitle_${activeLanguage}`}
              {...register(`subtitle_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'Article subtitle or summary' : 'Дэд гарчиг'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`excerpt_${activeLanguage}`}>
              Excerpt ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Textarea
              id={`excerpt_${activeLanguage}`}
              {...register(`excerpt_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'Brief summary for previews' : 'Товч агуулга'}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rich Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Article Content</CardTitle>
          <CardDescription>
            Write your article with rich formatting using shadcn-editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiLanguageEditor
            contentEn={contentEn}
            contentMn={contentMn}
            onChangeEn={setContentEn}
            onChangeMn={setContentMn}
            activeLanguage={activeLanguage}
            onLanguageChange={setActiveLanguage}
            label=""
          />
        </CardContent>
      </Card>

      {/* Media & Publishing */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>Featured and social images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                {...register('featuredImage')}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialImage">Social Share Image</Label>
              <Input
                id="socialImage"
                {...register('socialImage')}
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Status and priority settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="BREAKING">Breaking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isBreaking">Breaking News</Label>
                <Switch
                  id="isBreaking"
                  checked={watch('isBreaking')}
                  onCheckedChange={(checked) => setValue('isBreaking', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured Article</Label>
                <Switch
                  id="isFeatured"
                  checked={watch('isFeatured')}
                  onCheckedChange={(checked) => setValue('isFeatured', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>News Metadata</CardTitle>
          <CardDescription>Additional information about the article</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor={`location_${activeLanguage}`}>
              Location ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Input
              id={`location_${activeLanguage}`}
              {...register(`location_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'Ulaanbaatar, Mongolia' : 'Улаанбаатар, Монгол'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">News Source</Label>
            <Input
              id="source"
              {...register('source')}
              placeholder="Reuters, AP, Original, etc."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor={`byline_${activeLanguage}`}>
              Author Byline ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Input
              id={`byline_${activeLanguage}`}
              {...register(`byline_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'By John Doe, Senior Reporter' : 'Зохиогч: Б. Болд'}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Social Media</CardTitle>
          <CardDescription>Optimize for search engines and social sharing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`metaTitle_${activeLanguage}`}>
              Meta Title ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Input
              id={`metaTitle_${activeLanguage}`}
              {...register(`metaTitle_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'SEO title (60 chars max)' : 'SEO гарчиг'}
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`metaDescription_${activeLanguage}`}>
              Meta Description ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Textarea
              id={`metaDescription_${activeLanguage}`}
              {...register(`metaDescription_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'SEO description (160 chars max)' : 'SEO тайлбар'}
              rows={3}
              maxLength={160}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`keywords_${activeLanguage}`}>
              Keywords ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Input
              id={`keywords_${activeLanguage}`}
              {...register(`keywords_${activeLanguage}` as keyof NewsArticleFormData)}
              placeholder={activeLanguage === 'en' ? 'keyword1, keyword2, keyword3' : 'түлхүүр үг 1, түлхүүр үг 2'}
            />
            <p className="text-xs text-muted-foreground mt-1">Separate keywords with commas</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t z-10">
        <Button type="button" variant="outline" size="lg">
          Cancel
        </Button>
        <Button type="button" variant="outline" size="lg">
          Save Draft
        </Button>
        <Button type="submit" size="lg">
          Publish Article
        </Button>
      </div>
    </form>
  )
}
