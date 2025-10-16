'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMutation } from '@apollo/client/react'
import { CREATE_NEWS_CATEGORY } from '@/graphql/mutations/news'
import { useRouter } from 'next/navigation'

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
      router.push('/news/categories')
    },
    onError: (error) => {
      console.error('Failed to create category:', error)
      alert(`Failed to create category: ${error.message}`)
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
      color: '#3b82f6', // Default blue color
    },
  })

  const onSubmit = async (data: NewsCategoryFormData) => {
    const transformedData = {
      name: { en: data.name_en, mn: data.name_mn },
      slug: data.slug,
      description: {
        en: data.description_en || '',
        mn: data.description_mn || ''
      },
      color: data.color,
    }

    await createCategory({
      variables: {
        input: transformedData,
      },
    })
  }

  const generateSlug = (name: string) => {
    return name
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
          <h2 className="text-3xl font-bold">Create News Category</h2>
          <p className="text-muted-foreground mt-2">
            Create a category to organize your news articles
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
          <CardTitle>Category Information</CardTitle>
          <CardDescription>Enter the category name, slug, and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`name_${activeLanguage}`}>
              Name ({activeLanguage === 'en' ? 'English' : 'Mongolian'}) *
            </Label>
            <Input
              id={`name_${activeLanguage}`}
              {...register(`name_${activeLanguage}` as keyof NewsCategoryFormData)}
              placeholder={activeLanguage === 'en' ? 'Enter category name' : 'Ангиллын нэр'}
              className="text-lg font-medium"
              onBlur={(e) => {
                if (activeLanguage === 'en' && !watch('slug')) {
                  setValue('slug', generateSlug(e.target.value))
                }
              }}
            />
            {errors[`name_${activeLanguage}` as keyof typeof errors] && (
              <p className="text-sm text-destructive mt-1">
                {errors[`name_${activeLanguage}` as keyof typeof errors]?.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="category-url-slug"
            />
            {errors.slug && (
              <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description_${activeLanguage}`}>
              Description ({activeLanguage === 'en' ? 'English' : 'Mongolian'})
            </Label>
            <Textarea
              id={`description_${activeLanguage}`}
              {...register(`description_${activeLanguage}` as keyof NewsCategoryFormData)}
              placeholder={activeLanguage === 'en' ? 'Brief description of the category' : 'Ангиллын тайлбар'}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color (Hex)</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                {...register('color')}
                className="w-20 h-10"
              />
              <Input
                {...register('color')}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Choose a color to identify this category
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t z-10">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}
