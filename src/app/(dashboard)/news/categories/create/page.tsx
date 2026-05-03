import { Metadata } from 'next'
import { NewsCategoryForm } from '@/features/news/components/news-category-form'
import { PageHeader } from '@/components/admin'

export const metadata: Metadata = {
  title: 'Create News Category',
  description: 'Create a new news category',
}

export default function CreateNewsCategoryPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Create News Category"
        description="Create a category to organize your news articles"
        backHref="/news/categories"
      />
      <NewsCategoryForm />
    </div>
  )
}
