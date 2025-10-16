import { Metadata } from 'next'
import { NewsCategoriesTable } from '@/features/news/components/news-categories-table'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'News Categories',
  description: 'Manage news categories',
}

export default function NewsCategoriesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/news">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">News Categories</h1>
            </div>
            <p className="text-muted-foreground ml-11">
              Organize your news articles with categories
            </p>
          </div>

          <Button asChild>
            <Link href="/news/categories/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Link>
          </Button>
        </div>

        <NewsCategoriesTable />
      </div>
    </div>
  )
}
