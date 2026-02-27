import { getStories } from '../lib/stories-api'
import type { StoriesPageSearchParams } from '../types'
import { StoriesDataTableClient } from './stories-data-table-client'

export async function StoriesDataTable({
  searchParams
}: {
  searchParams: Promise<StoriesPageSearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const search = params.search || ''

  const { data: stories, totalItems } = await getStories(page, pageSize, {
    search,
    type: params.type,
    status: params.status,
    rallyId: params.rallyId,
    featured: params.featured === 'true' ? true : params.featured === 'false' ? false : undefined,
  })

  return (
    <StoriesDataTableClient
      stories={stories}
      totalItems={totalItems}
      currentPage={page}
      pageSize={pageSize}
    />
  )
}
