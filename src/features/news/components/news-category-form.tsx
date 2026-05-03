'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Save } from 'lucide-react'
import { useMutation } from '@apollo/client/react'
import { CREATE_NEWS_CATEGORY } from '@/graphql/mutations/news'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FormSection } from '@/components/admin'

const newsCategorySchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_mn: z.string().min(1, 'Mongolian name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description_en: z.string().optional(),
  description_mn: z.string().optional(),
  color: z.string().optional(),
})

type NewsCategoryFormData = z.infer<typeof newsCategorySchema>

export function NewsCategoryForm() {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'mn'>('en')

  const [createCategory, { loading }] = useMutation(CREATE_NEWS_CATEGORY, {
    onCompleted: () => {
      toast.success('Category created successfully')
      router.push('/news/categories')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsCategoryFormData>({
    resolver: zodResolver(newsCategorySchema),
    defaultValues: {
      color: '#3b82f6',
    },
  })

  const onSubmit = async (data: NewsCategoryFormData) => {
    await createCategory({
      variables: {
        input: {
          name: { en: data.name_en, mn: data.name_mn },
          slug: data.slug,
          description: {
            en: data.description_en || '',
            mn: data.description_mn || '',
          },
          color: data.color,
        },
      },
    })
  }

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormSection
        title="Category Information"
        description="Name, slug, and description for this category"
        actions={
          <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as 'en' | 'mn')}>
            <TabsList className="h-7 text-xs">
              <TabsTrigger value="en" className="text-xs px-2.5 h-5.5">English</TabsTrigger>
              <TabsTrigger value="mn" className="text-xs px-2.5 h-5.5">Монгол</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor={`name_${activeLanguage}`}>
            Name ({activeLanguage === 'en' ? 'English' : 'Mongolian'}){' '}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`name_${activeLanguage}`}
            {...register(`name_${activeLanguage}` as keyof NewsCategoryFormData)}
            placeholder={activeLanguage === 'en' ? 'Enter category name' : 'Ангиллын нэр'}
            onBlur={(e) => {
              if (activeLanguage === 'en' && !watch('slug')) {
                setValue('slug', generateSlug(e.target.value))
              }
            }}
          />
          {errors[`name_${activeLanguage}` as keyof typeof errors] && (
            <p className="text-xs text-destructive">
              {errors[`name_${activeLanguage}` as keyof typeof errors]?.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">
            URL Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            id="slug"
            {...register('slug')}
            placeholder="category-url-slug"
          />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            URL-friendly identifier (auto-generated from English name)
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`description_${activeLanguage}`}>
            Description ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
          </Label>
          <Textarea
            id={`description_${activeLanguage}`}
            {...register(`description_${activeLanguage}` as keyof NewsCategoryFormData)}
            placeholder={
              activeLanguage === 'en'
                ? 'Brief description of the category'
                : 'Ангиллын тайлбар'
            }
            rows={3}
          />
        </div>
      </FormSection>

      <FormSection title="Appearance" description="Visual styling for this category">
        <div className="space-y-1.5">
          <Label htmlFor="color">Color</Label>
          <div className="flex gap-2">
            <Input
              id="color"
              type="color"
              {...register('color')}
              className="w-12 h-9 p-1 cursor-pointer"
            />
            <Input
              {...register('color')}
              placeholder="#3b82f6"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Used to identify this category in listings and badges
          </p>
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 py-4">
          <Button type="submit" disabled={loading} className="min-w-[160px]">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Create Category
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
