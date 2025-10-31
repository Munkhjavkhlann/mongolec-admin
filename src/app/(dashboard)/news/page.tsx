import { Suspense } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NewsHeader, NewsStats, NewsDataTable } from '@/features/news'
import type { NewsPageSearchParams } from '@/features/news'

interface NewsPageProps {
  searchParams: Promise<NewsPageSearchParams>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams
  return (
    <div className="space-y-6">
      <NewsHeader />

      <Suspense fallback={<div>Loading stats...</div>}>
        <NewsStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>News Articles</CardTitle>
          <CardDescription>
            Manage your news articles and publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading articles...</div>}>
            <NewsDataTable searchParams={Promise.resolve(params)} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}