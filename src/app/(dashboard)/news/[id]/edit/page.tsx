import { Metadata } from 'next'
import { NewsArticleForm } from '@/features/news/components/news-article-form'

export const metadata: Metadata = {
  title: 'Edit News Article',
  description: 'Edit news article',
}

interface EditNewsPageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params

  // TODO: Fetch article data
  // const article = await getNewsArticle(id)

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit News Article</h1>
          <p className="text-muted-foreground mt-2">
            Update article details and content
          </p>
        </div>

        <NewsArticleForm mode="edit" />
      </div>
    </div>
  )
}
