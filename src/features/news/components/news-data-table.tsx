import { getNewsArticles } from '../lib/news-api'
import type { NewsPageSearchParams } from '../types'
import { NewsDataTableClient } from './news-data-table-client'

export async function NewsDataTable({
  searchParams
}: {
  searchParams: Promise<NewsPageSearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const search = params.search || ''

  const { data: articles, totalItems } = await getNewsArticles(page, pageSize, {
    search,
    status: params.status,
    priority: params.priority,
    category: params.category,
  })

  return (
    <NewsDataTableClient
      articles={articles}
      totalItems={totalItems}
      currentPage={page}
      pageSize={pageSize}
    />
  )
}