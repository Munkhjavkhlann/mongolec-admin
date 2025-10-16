'use client'

import { ServerDataTable, Column } from '@/components/data-table/server-data-table'
import type { NewsArticle } from '../types'
import { priorityConfig, statusConfig } from '../types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Edit, ExternalLink, Star, Zap, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface NewsDataTableClientProps {
  articles: NewsArticle[]
  totalItems: number
  currentPage: number
  pageSize: number
}

export function NewsDataTableClient({
  articles,
  totalItems,
  currentPage,
  pageSize,
}: NewsDataTableClientProps) {
  const columns: Column<NewsArticle>[] = [
    {
      key: 'title',
      title: 'Title',
      render: (_, article) => {
        const isBreaking = article.isBreaking || article.priority === 'breaking'
        const isFeatured = article.isFeatured || article.featured
        const priorityKey = article.priority as keyof typeof priorityConfig
        const config = priorityConfig[priorityKey]

        return (
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {isBreaking && (
                  <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                    <Zap className="h-3 w-3" />
                    BREAKING
                  </Badge>
                )}
                {isFeatured && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-current" />
                    FEATURED
                  </Badge>
                )}
                <Badge variant="outline" className={`text-xs ${config?.color || ''}`}>
                  {config?.label || article.priority}
                </Badge>
              </div>
              <span className="max-w-[200px] sm:max-w-[300px] truncate font-medium">
                {article.title}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                {article.slug}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'category',
      title: 'Category',
      render: (category) => (
        <Badge variant="outline" className="text-xs">
          {(category as string) || 'Uncategorized'}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, article) => {
        const statusKey = article.status as keyof typeof statusConfig
        const config = statusConfig[statusKey]
        return (
          <Badge variant="outline" className={`text-xs ${config?.color || ''}`}>
            {config?.label || article.status}
          </Badge>
        )
      },
    },
    {
      key: 'author.name',
      title: 'Author',
      render: (_, article) => (
        <span className="text-sm">{article.author?.name || '-'}</span>
      ),
    },
    {
      key: 'views',
      title: 'Views',
      render: (_, article) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          {article.views?.toLocaleString() || '0'}
        </div>
      ),
    },
    {
      key: 'publishedAt',
      title: 'Published',
      render: (_, article) => {
        if (article.status === 'scheduled' && article.scheduledAt) {
          return (
            <div className="text-sm">
              <div className="text-muted-foreground text-xs">Scheduled:</div>
              <div>{format(new Date(article.scheduledAt), 'MMM dd, yyyy HH:mm')}</div>
            </div>
          )
        }

        if (!article.publishedAt) {
          return <span className="text-muted-foreground text-sm">—</span>
        }

        return (
          <div className="text-sm">
            {format(new Date(article.publishedAt), 'MMM dd, yyyy HH:mm')}
          </div>
        )
      },
    },
    {
      key: 'updatedAt',
      title: 'Updated',
      render: (_, article) => (
        <div className="text-muted-foreground text-sm">
          {format(new Date(article.updatedAt), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, article) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/news/${article.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          {article.status === 'published' && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/news/${article.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <ServerDataTable
      data={articles}
      columns={columns}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={pageSize}
      searchPlaceholder="Search articles, categories, or authors..."
    />
  )
}
