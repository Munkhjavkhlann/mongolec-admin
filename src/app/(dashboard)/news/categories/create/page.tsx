import { Metadata } from 'next'
import { NewsCategoryForm } from '@/features/news/components/news-category-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create News Category',
  description: 'Create a new news category',
}

export default function CreateNewsCategoryPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/news/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <NewsCategoryForm />
    </div>
  )
}
