'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Edit, ExternalLink, Eye, Newspaper, Star, Trash2, UserCircle2, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useMutation } from '@apollo/client/react'

import { DataTable, createActionsColumn } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DELETE_NEWS_ARTICLE } from '@/graphql/mutations/news'

import type { NewsArticle } from '../types'
import { priorityConfig, statusConfig } from '../types'

interface NewsDataTableClientProps {
  articles: NewsArticle[]
  totalItems: number
  currentPage: number
  pageSize: number
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  published: 'default',
  draft: 'secondary',
  scheduled: 'outline',
  archived: 'destructive',
}

const priorityVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  breaking: 'destructive',
  urgent: 'destructive',
  high: 'default',
  normal: 'secondary',
  low: 'outline',
}

function NewsActions({ row }: { row: { original: NewsArticle } }) {
  const router = useRouter()
  const [deleteArticle] = useMutation(DELETE_NEWS_ARTICLE, {
    onCompleted: () => router.refresh(),
  })

  const article = row.original

  const handleDelete = () => {
    if (!confirm('Delete this article? This cannot be undone.')) return
    deleteArticle({ variables: { id: article.id } })
  }

  return (
    <div className="flex items-center gap-1">
      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
        <Link href={`/news/${article.id}/edit`}>
          <Edit className="h-3.5 w-3.5" />
        </Link>
      </Button>
      {article.status === 'published' && (
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
          <Link href={`/news/${article.slug}`} target="_blank">
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

const columns: ColumnDef<NewsArticle>[] = [
  {
    accessorKey: 'title',
    header: 'Article',
    cell: ({ row }) => {
      const article = row.original
      const isBreaking = article.isBreaking || article.priority === 'breaking'
      const isFeatured = article.isFeatured || article.featured
      return (
        <div className="flex items-start gap-3">
          {article.featuredImage ? (
            <div className="relative h-12 w-12 rounded-md overflow-hidden border flex-shrink-0">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-md bg-muted border flex items-center justify-center flex-shrink-0">
              <Newspaper className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isBreaking && (
                <Badge variant="destructive" className="h-4 px-1.5 text-[10px] gap-0.5">
                  <Zap className="h-2.5 w-2.5" />
                  Breaking
                </Badge>
              )}
              {isFeatured && (
                <Badge
                  variant="default"
                  className="h-4 px-1.5 text-[10px] gap-0.5 bg-amber-500 hover:bg-amber-500"
                >
                  <Star className="h-2.5 w-2.5" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="font-medium text-sm leading-snug max-w-[280px] truncate">
              {article.title}
            </div>
            <div className="text-xs text-muted-foreground font-mono max-w-[280px] truncate">
              /{article.slug}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    id: 'meta',
    header: 'Category & Status',
    cell: ({ row }) => {
      const article = row.original
      const categoryName = article.category?.name ?? null
      const statusLabel =
        statusConfig[article.status as keyof typeof statusConfig]?.label ?? article.status
      return (
        <div className="space-y-1">
          {categoryName ? (
            <Badge variant="outline" className="text-xs">
              {categoryName}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
          <div>
            <Badge variant={statusVariant[article.status] ?? 'secondary'} className="text-xs mt-1">
              {statusLabel}
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const article = row.original
      if (article.priority === 'normal')
        return <span className="text-xs text-muted-foreground">Normal</span>
      const label =
        priorityConfig[article.priority as keyof typeof priorityConfig]?.label ?? article.priority
      return (
        <Badge variant={priorityVariant[article.priority] ?? 'secondary'} className="text-xs">
          {label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'byline',
    header: 'Author',
    cell: ({ row }) => {
      const byline = row.original.byline
      if (!byline) return <span className="text-sm text-muted-foreground">—</span>
      return (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <UserCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate max-w-[120px]">{byline}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'views',
    header: 'Views',
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm">
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{(row.original.views ?? 0).toLocaleString()}</span>
      </div>
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: 'Published',
    cell: ({ row }) => {
      const article = row.original
      if (article.status === 'scheduled' && article.scheduledAt) {
        return (
          <div className="text-xs">
            <div className="text-sky-600 dark:text-sky-400 font-medium">Scheduled</div>
            <div className="text-muted-foreground">
              {format(new Date(article.scheduledAt), 'MMM dd, yyyy')}
            </div>
          </div>
        )
      }
      if (!article.publishedAt)
        return <span className="text-xs text-muted-foreground">—</span>
      return (
        <div className="text-xs text-muted-foreground">
          {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
        </div>
      )
    },
  },
  createActionsColumn<NewsArticle>(NewsActions),
]

export function NewsDataTableClient({
  articles,
  totalItems,
  currentPage,
  pageSize,
}: NewsDataTableClientProps) {
  return (
    <DataTable
      data={articles}
      columns={columns}
      manualPagination
      pageCount={Math.ceil(totalItems / pageSize)}
      pagination={{ pageIndex: currentPage - 1, pageSize }}
      showIndexColumn={false}
      toolbarConfig={{
        searchPlaceholder: 'Search articles, categories, or authors…',
        enableView: true,
        enableFilter: false,
      }}
    />
  )
}
