'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SerializedEditorState } from 'lexical'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Editor } from '@/components/blocks/editor-00/editor'
import { FormSection } from '@/components/admin'
import { Save, Globe, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@apollo/client/react'
import { CREATE_NEWS_ARTICLE, UPDATE_NEWS_ARTICLE } from '@/graphql/mutations/news'
import { GET_NEWS_ARTICLE_BY_ID } from '@/graphql/queries/news'
import { cn } from '@/lib/utils'

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
  title_en: z.string().min(1, 'English title is required'),
  title_mn: z.string().min(1, 'Mongolian title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt_en: z.string().optional(),
  excerpt_mn: z.string().optional(),
  subtitle_en: z.string().optional(),
  subtitle_mn: z.string().optional(),
  featuredImage: z.string().optional(),
  socialImage: z.string().optional(),
  categoryId: z.string().optional(),
  location_en: z.string().optional(),
  location_mn: z.string().optional(),
  source: z.string().optional(),
  byline_en: z.string().optional(),
  byline_mn: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'BREAKING']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']),
  isBreaking: z.boolean(),
  isFeatured: z.boolean(),
  metaTitle_en: z.string().optional(),
  metaTitle_mn: z.string().optional(),
  metaDescription_en: z.string().optional(),
  metaDescription_mn: z.string().optional(),
  keywords_en: z.string().optional(),
  keywords_mn: z.string().optional(),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
})

type NewsArticleFormData = z.infer<typeof newsArticleSchema>

interface RawArticle {
  id: string
  slug?: string
  title?: string
  subtitle?: string
  excerpt?: string
  byline?: string
  location?: string
  source?: string
  featuredImage?: string
  socialImage?: string
  status?: string
  priority?: string
  isBreaking?: boolean
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
  keywords?: string | string[]
  blocks?: unknown
  publishedAt?: string | null
  scheduledAt?: string | null
  category?: { id: string; name: string } | null
}

interface NewsArticleFormBlockNoteProps {
  mode?: 'create' | 'edit'
  articleId?: string
}

export function NewsArticleFormBlockNote({ mode = 'create', articleId }: NewsArticleFormBlockNoteProps) {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'mn'>('en')
  const [contentEn, setContentEn] = useState<SerializedEditorState>(initialEditorState)
  const [contentMn, setContentMn] = useState<SerializedEditorState>(initialEditorState)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [createArticle, { loading: creating }] = useMutation(CREATE_NEWS_ARTICLE, {
    onCompleted: (data: unknown) => {
      const result = data as { createNewsArticle: { id: string } }
      router.push(`/news/${result.createNewsArticle.id}/edit`)
    },
    onError: (err: Error) => setSubmitError(err.message),
  })

  const [updateArticle, { loading: updating }] = useMutation(UPDATE_NEWS_ARTICLE, {
    onError: (err: Error) => setSubmitError(err.message),
  })

  const { data: articleData } = useQuery<{ newsArticleById: RawArticle }>(GET_NEWS_ARTICLE_BY_ID, {
    variables: { id: articleId, language: 'en' },
    skip: mode !== 'edit' || !articleId,
  })

  const { data: articleDataMn } = useQuery<{ newsArticleById: RawArticle }>(GET_NEWS_ARTICLE_BY_ID, {
    variables: { id: articleId, language: 'mn' },
    skip: mode !== 'edit' || !articleId,
  })

  const isSubmitting = creating || updating

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  useEffect(() => {
    const en = articleData?.newsArticleById
    const mn = articleDataMn?.newsArticleById
    if (!en) return

    const status = (en.status?.toUpperCase() ?? 'DRAFT') as NewsArticleFormData['status']
    const priority = (en.priority?.toUpperCase() ?? 'NORMAL') as NewsArticleFormData['priority']

    reset({
      title_en: en.title ?? '',
      title_mn: mn?.title ?? '',
      slug: en.slug ?? '',
      excerpt_en: en.excerpt ?? '',
      excerpt_mn: mn?.excerpt ?? '',
      subtitle_en: en.subtitle ?? '',
      subtitle_mn: mn?.subtitle ?? '',
      byline_en: en.byline ?? '',
      byline_mn: mn?.byline ?? '',
      location_en: en.location ?? '',
      location_mn: mn?.location ?? '',
      source: en.source ?? '',
      featuredImage: en.featuredImage ?? '',
      socialImage: en.socialImage ?? '',
      categoryId: en.category?.id ?? '',
      priority,
      status,
      isBreaking: en.isBreaking ?? false,
      isFeatured: en.isFeatured ?? false,
      metaTitle_en: en.metaTitle ?? '',
      metaTitle_mn: mn?.metaTitle ?? '',
      metaDescription_en: en.metaDescription ?? '',
      metaDescription_mn: mn?.metaDescription ?? '',
      keywords_en: Array.isArray(en.keywords) ? en.keywords.join(', ') : (en.keywords ?? ''),
      keywords_mn: Array.isArray(mn?.keywords) ? mn?.keywords.join(', ') : (mn?.keywords ?? ''),
      publishedAt: en.publishedAt ? new Date(en.publishedAt).toISOString().slice(0, 16) : '',
      scheduledAt: en.scheduledAt ? new Date(en.scheduledAt).toISOString().slice(0, 16) : '',
    })

    if (en.blocks) {
      try {
        const blocksEn = typeof en.blocks === 'string' ? JSON.parse(en.blocks) : en.blocks
        if (blocksEn?.en) setContentEn(blocksEn.en)
        else if (blocksEn?.root) setContentEn(blocksEn)
      } catch {}
    }
    if (mn?.blocks) {
      try {
        const blocksMn = typeof mn.blocks === 'string' ? JSON.parse(mn.blocks) : mn.blocks
        if (blocksMn?.mn) setContentMn(blocksMn.mn)
        else if (blocksMn?.root) setContentMn(blocksMn)
      } catch {}
    }
  }, [articleData, articleDataMn, reset])

  const watchedStatus = watch('status')
  const watchedPriority = watch('priority')
  const watchedIsBreaking = watch('isBreaking')
  const watchedIsFeatured = watch('isFeatured')

  const buildInput = (data: NewsArticleFormData) => ({
    title: { en: data.title_en, mn: data.title_mn },
    slug: data.slug,
    excerpt: { en: data.excerpt_en ?? '', mn: data.excerpt_mn ?? '' },
    subtitle: { en: data.subtitle_en ?? '', mn: data.subtitle_mn ?? '' },
    byline: { en: data.byline_en ?? '', mn: data.byline_mn ?? '' },
    blocks: { en: contentEn, mn: contentMn },
    featuredImage: data.featuredImage || undefined,
    socialImage: data.socialImage || undefined,
    categoryId: data.categoryId || undefined,
    location: { en: data.location_en ?? '', mn: data.location_mn ?? '' },
    source: data.source || undefined,
    priority: data.priority.toLowerCase(),
    status: data.status.toLowerCase(),
    isBreaking: data.isBreaking,
    isFeatured: data.isFeatured,
    metaTitle: { en: data.metaTitle_en ?? '', mn: data.metaTitle_mn ?? '' },
    metaDescription: { en: data.metaDescription_en ?? '', mn: data.metaDescription_mn ?? '' },
    keywords: {
      en: data.keywords_en?.split(',').map((k) => k.trim()).filter(Boolean) ?? [],
      mn: data.keywords_mn?.split(',').map((k) => k.trim()).filter(Boolean) ?? [],
    },
    publishedAt: data.publishedAt || undefined,
    scheduledAt: data.scheduledAt || undefined,
  })

  const onSubmit = async (data: NewsArticleFormData) => {
    setSubmitError(null)
    const input = buildInput(data)

    if (mode === 'create') {
      createArticle({ variables: { input } })
    } else {
      updateArticle({ variables: { id: articleId, input } })
    }
  }

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

  const lang = activeLanguage === 'en' ? 'English' : 'Mongolian'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

      {/* Page header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='sm' asChild className='gap-1.5 text-muted-foreground'>
            <Link href='/news'>
              <ChevronLeft className='h-4 w-4' />
              News
            </Link>
          </Button>
          <span className='text-muted-foreground'>/</span>
          <h1 className='text-xl font-semibold'>
            {mode === 'create' ? 'New Article' : 'Edit Article'}
          </h1>
        </div>

        {/* Language toggle */}
        <div className='flex items-center gap-1 rounded-md border p-1'>
          {(['en', 'mn'] as const).map((l) => (
            <button
              key={l}
              type='button'
              onClick={() => setActiveLanguage(l)}
              className={cn(
                'flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors',
                activeLanguage === l
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Globe className='h-3.5 w-3.5' />
              {l === 'en' ? 'English' : 'Монгол'}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className='flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive'>
          <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main two-column layout */}
      <div className='grid gap-6 lg:grid-cols-[1fr_300px]'>

        {/* Left column */}
        <div className='space-y-6'>

          {/* Article Details */}
          <FormSection title={`Article Details · ${lang}`}>
              <div className='space-y-2'>
                <Label htmlFor={`title_${activeLanguage}`}>
                  Title *
                </Label>
                <Input
                  id={`title_${activeLanguage}`}
                  {...register(`title_${activeLanguage}` as keyof NewsArticleFormData)}
                  placeholder={activeLanguage === 'en' ? 'Enter article title' : 'Нийтлэлийн гарчиг'}
                  onBlur={(e) => {
                    if (activeLanguage === 'en' && !watch('slug')) {
                      setValue('slug', generateSlug(e.target.value))
                    }
                  }}
                />
                {errors[`title_${activeLanguage}` as keyof typeof errors] && (
                  <p className='text-xs text-destructive'>
                    {errors[`title_${activeLanguage}` as keyof typeof errors]?.message as string}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`subtitle_${activeLanguage}`}>Subtitle</Label>
                <Input
                  id={`subtitle_${activeLanguage}`}
                  {...register(`subtitle_${activeLanguage}` as keyof NewsArticleFormData)}
                  placeholder={activeLanguage === 'en' ? 'Article subtitle' : 'Дэд гарчиг'}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>URL Slug *</Label>
                <div className='flex'>
                  <span className='inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground'>
                    /news/
                  </span>
                  <Input
                    id='slug'
                    {...register('slug')}
                    placeholder='article-url-slug'
                    className='rounded-l-none font-mono text-sm'
                  />
                </div>
                {errors.slug && (
                  <p className='text-xs text-destructive'>{errors.slug.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`excerpt_${activeLanguage}`}>Excerpt</Label>
                <Textarea
                  id={`excerpt_${activeLanguage}`}
                  {...register(`excerpt_${activeLanguage}` as keyof NewsArticleFormData)}
                  placeholder={activeLanguage === 'en' ? 'Brief summary for article previews' : 'Товч агуулга'}
                  rows={3}
                  className='resize-none'
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor={`byline_${activeLanguage}`}>Byline</Label>
                  <Input
                    id={`byline_${activeLanguage}`}
                    {...register(`byline_${activeLanguage}` as keyof NewsArticleFormData)}
                    placeholder={activeLanguage === 'en' ? 'By Jane Smith' : 'Зохиогч: Б. Болд'}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor={`location_${activeLanguage}`}>Location</Label>
                  <Input
                    id={`location_${activeLanguage}`}
                    {...register(`location_${activeLanguage}` as keyof NewsArticleFormData)}
                    placeholder={activeLanguage === 'en' ? 'Ulaanbaatar, Mongolia' : 'Улаанбаатар'}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='source'>Source</Label>
                <Input
                  id='source'
                  {...register('source')}
                  placeholder='Reuters, AP, Original…'
                />
              </div>
          </FormSection>

          {/* Article Content */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Article Content · {lang}</Label>
            <div className='rounded-md border overflow-hidden'>
              {activeLanguage === 'en' ? (
                <Editor
                  editorSerializedState={contentEn}
                  onSerializedChange={setContentEn}
                />
              ) : (
                <Editor
                  editorSerializedState={contentMn}
                  onSerializedChange={setContentMn}
                />
              )}
            </div>
          </div>

          {/* SEO */}
          <FormSection title={`SEO & Social · ${lang}`}>
              <div className='space-y-2'>
                <Label htmlFor={`metaTitle_${activeLanguage}`}>Meta Title</Label>
                <Input
                  id={`metaTitle_${activeLanguage}`}
                  {...register(`metaTitle_${activeLanguage}` as keyof NewsArticleFormData)}
                  placeholder={activeLanguage === 'en' ? 'SEO title (60 chars max)' : 'SEO гарчиг'}
                  maxLength={60}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`metaDescription_${activeLanguage}`}>Meta Description</Label>
                <Textarea
                  id={`metaDescription_${activeLanguage}`}
                  {...register(`metaDescription_${activeLanguage}` as keyof NewsArticleFormData)}
                  placeholder={activeLanguage === 'en' ? 'SEO description (160 chars max)' : 'SEO тайлбар'}
                  rows={3}
                  maxLength={160}
                  className='resize-none'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`keywords_${activeLanguage}`}>Keywords</Label>
                <Input
                  id={`keywords_${activeLanguage}`}
                  {...register(`keywords_${activeLanguage}` as keyof NewsArticleFormData)}
                  placeholder={activeLanguage === 'en' ? 'ecology, mongolia, conservation' : 'экологи, монгол'}
                  className='font-mono text-sm'
                />
                <p className='text-xs text-muted-foreground'>Separate with commas</p>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='featuredImage'>Featured Image URL</Label>
                  <Input
                    id='featuredImage'
                    {...register('featuredImage')}
                    placeholder='https://…'
                    className='text-sm'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='socialImage'>Social / OG Image</Label>
                  <Input
                    id='socialImage'
                    {...register('socialImage')}
                    placeholder='https://…'
                    className='text-sm'
                  />
                </div>
              </div>
          </FormSection>
        </div>

        {/* Right sidebar */}
        <div className='space-y-4'>

          {/* Publish */}
          <FormSection title='Publish'>
              <div className='space-y-2'>
                <Label>Status</Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(v) => setValue('status', v as NewsArticleFormData['status'])}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='DRAFT'>Draft</SelectItem>
                    <SelectItem value='PUBLISHED'>Published</SelectItem>
                    <SelectItem value='SCHEDULED'>Scheduled</SelectItem>
                    <SelectItem value='ARCHIVED'>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Priority</Label>
                <Select
                  value={watchedPriority}
                  onValueChange={(v) => setValue('priority', v as NewsArticleFormData['priority'])}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='LOW'>Low</SelectItem>
                    <SelectItem value='NORMAL'>Normal</SelectItem>
                    <SelectItem value='HIGH'>High</SelectItem>
                    <SelectItem value='URGENT'>Urgent</SelectItem>
                    <SelectItem value='BREAKING'>Breaking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(watchedStatus === 'SCHEDULED' || watchedStatus === 'PUBLISHED') && (
                <div className='space-y-2'>
                  <Label htmlFor={watchedStatus === 'PUBLISHED' ? 'publishedAt' : 'scheduledAt'}>
                    {watchedStatus === 'PUBLISHED' ? 'Published At' : 'Scheduled At'}
                  </Label>
                  {watchedStatus === 'PUBLISHED' ? (
                    <Input
                      id='publishedAt'
                      type='datetime-local'
                      {...register('publishedAt')}
                      className='text-sm'
                    />
                  ) : (
                    <Input
                      id='scheduledAt'
                      type='datetime-local'
                      {...register('scheduledAt')}
                      className='text-sm'
                    />
                  )}
                </div>
              )}
          </FormSection>

          {/* Flags */}
          <FormSection title='Article Flags'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Breaking News</Label>
                  <p className='text-xs text-muted-foreground'>Mark as urgent, top story</p>
                </div>
                <Switch
                  checked={watchedIsBreaking}
                  onCheckedChange={(v) => setValue('isBreaking', v)}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Featured</Label>
                  <p className='text-xs text-muted-foreground'>Show on homepage highlight</p>
                </div>
                <Switch
                  checked={watchedIsFeatured}
                  onCheckedChange={(v) => setValue('isFeatured', v)}
                />
              </div>
          </FormSection>

          {/* Status summary */}
          <div className='flex flex-wrap gap-2'>
            <Badge variant='outline' className='text-xs'>
              {watchedStatus}
            </Badge>
            {watchedIsBreaking && (
              <Badge variant='destructive' className='text-xs'>Breaking</Badge>
            )}
            {watchedIsFeatured && (
              <Badge className='text-xs bg-amber-500 hover:bg-amber-500'>Featured</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className='sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
        <div className='flex items-center justify-end gap-2 py-4'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setValue('status', 'DRAFT')}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button type='submit' size='sm' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving…
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                {mode === 'create' ? 'Publish Article' : 'Update Article'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
