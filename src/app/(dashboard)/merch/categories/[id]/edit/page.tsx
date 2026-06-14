'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { MerchCategoryForm } from '@/features/merch/components/merch-category-form'
import { GET_MERCH_CATEGORY_BY_ID } from '@/graphql/queries/merch'
import { AlertCircle, Package } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader, EmptyState } from '@/components/admin'

interface GetMerchCategoryByIdData {
  getMerchCategoryById: {
    id: string
    name: string | { en?: string; mn?: string }
    slug: string
    description?: string | { en?: string; mn?: string }
  } | null
}

export default function MerchCategoryEditPage() {
  const params = useParams()
  const categoryId = params.id as string

  const { data, loading, error } = useQuery<GetMerchCategoryByIdData>(GET_MERCH_CATEGORY_BY_ID, {
    variables: { id: categoryId },
    skip: !categoryId,
  })

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState icon={Package} title="Loading category…" className="py-20" />
      </div>
    )
  }

  if (error || !data?.getMerchCategoryById) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <PageHeader title="Edit Category" backHref="/merch/categories" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || 'Category not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const category = data.getMerchCategoryById

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Edit Category"
        description="Update category information"
        backHref="/merch/categories"
      />
      <MerchCategoryForm mode="edit" categoryId={categoryId} initialData={category} />
    </div>
  )
}
