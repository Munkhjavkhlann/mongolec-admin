import { Suspense } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StoriesHeader, StoriesStats, StoriesDataTable } from '@/features/stories'
import type { StoriesPageSearchParams } from '@/features/stories'

interface StoriesPageProps {
  searchParams: Promise<StoriesPageSearchParams>
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams
  return (
    <div className="space-y-6">
      <StoriesHeader />

      <Suspense fallback={<div>Loading stats...</div>}>
        <StoriesStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Rally Stories</CardTitle>
          <CardDescription>
            Manage impact stories, rider profiles, and field moments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading stories...</div>}>
            <StoriesDataTable searchParams={Promise.resolve(params)} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
