import { Metadata } from 'next'
import { MerchCategoryForm } from '@/features/merch/components/merch-category-form'
import { PageHeader } from '@/components/admin'

export const metadata: Metadata = {
  title: 'Create Merchandise Category',
  description: 'Create a new merchandise category',
}

export default function CreateMerchCategoryPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Create Category"
        description="Create a category to organize your products"
        backHref="/merch/categories"
      />
      <MerchCategoryForm mode="create" />
    </div>
  )
}
