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
import {
  CREATE_MERCH_CATEGORY,
  UPDATE_MERCH_CATEGORY,
} from '@/graphql/mutations/merch'
import { GET_MERCH_CATEGORIES } from '@/graphql/queries/merch'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FormSection } from '@/components/admin'

const merchCategorySchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_mn: z.string().min(1, 'Mongolian name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description_en: z.string().optional(),
  description_mn: z.string().optional(),
})

type MerchCategoryFormData = z.infer<typeof merchCategorySchema>

type LangField = string | { en?: string; mn?: string } | null | undefined

interface MerchCategoryInitialData {
  id: string
  name?: LangField
  slug?: string
  description?: LangField
}

interface MerchCategoryFormProps {
  mode?: 'create' | 'edit'
  categoryId?: string
  initialData?: MerchCategoryInitialData
}

const normalizeLangField = (field: LangField): { en: string; mn: string } => {
  if (!field) return { en: '', mn: '' }
  if (typeof field === 'string') return { en: field, mn: field }
  return { en: field.en || '', mn: field.mn || '' }
}

export function MerchCategoryForm({
  mode = 'create',
  categoryId,
  initialData,
}: MerchCategoryFormProps) {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'mn'>('en')

  const initialName = normalizeLangField(initialData?.name)
  const initialDescription = normalizeLangField(initialData?.description)

  const refetchQueries = [{ query: GET_MERCH_CATEGORIES, variables: { language: 'en' } }]

  const [createCategory, { loading: creating }] = useMutation(CREATE_MERCH_CATEGORY, {
    refetchQueries,
    onCompleted: () => {
      toast.success('Category created successfully')
      router.push('/merch/categories')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_MERCH_CATEGORY, {
    refetchQueries,
    onCompleted: () => {
      toast.success('Category updated successfully')
      router.push('/merch/categories')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })

  const loading = creating || updating

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MerchCategoryFormData>({
    resolver: zodResolver(merchCategorySchema),
    defaultValues: {
      name_en: initialName.en,
      name_mn: initialName.mn,
      slug: initialData?.slug || '',
      description_en: initialDescription.en,
      description_mn: initialDescription.mn,
    },
  })

  const onSubmit = async (data: MerchCategoryFormData) => {
    const input = {
      name: { en: data.name_en, mn: data.name_mn },
      slug: data.slug,
      description: {
        en: data.description_en || '',
        mn: data.description_mn || '',
      },
    }

    if (mode === 'edit' && categoryId) {
      await updateCategory({ variables: { id: categoryId, input } })
    } else {
      await createCategory({ variables: { input } })
    }
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
            {...register(`name_${activeLanguage}` as keyof MerchCategoryFormData)}
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
          <Input id="slug" {...register('slug')} placeholder="category-url-slug" />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
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
            {...register(`description_${activeLanguage}` as keyof MerchCategoryFormData)}
            placeholder={
              activeLanguage === 'en' ? 'Brief description of the category' : 'Ангиллын тайлбар'
            }
            rows={3}
          />
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 py-4">
          <Button type="submit" disabled={loading} className="min-w-[160px]">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {mode === 'edit' ? 'Update Category' : 'Create Category'}
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
