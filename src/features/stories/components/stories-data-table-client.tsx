'use client'

import { ServerDataTable, Column } from '@/components/data-table/server-data-table'
import type { Story } from '../types'
import { storyTypeConfig, statusConfig } from '../types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Edit, ExternalLink, Star, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'

interface StoriesDataTableClientProps {
  stories: Story[]
  totalItems: number
  currentPage: number
  pageSize: number
}

export function StoriesDataTableClient({
  stories,
  totalItems,
  currentPage,
  pageSize,
}: StoriesDataTableClientProps) {
  const columns: Column<Story>[] = [
    {
      key: 'title',
      title: 'Title',
      render: (_, story) => {
        const typeKey = story.type as keyof typeof storyTypeConfig
        const typeConfig = storyTypeConfig[typeKey]

        return (
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {story.featured && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-current" />
                    FEATURED
                  </Badge>
                )}
                <Badge variant="outline" className={`text-xs ${typeConfig?.color || ''}`}>
                  {typeConfig?.label || story.type}
                </Badge>
              </div>
              <span className="max-w-[200px] sm:max-w-[300px] truncate font-medium">
                {story.title}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                {story.slug}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'type',
      title: 'Type',
      render: (_, story) => {
        const typeKey = story.type as keyof typeof storyTypeConfig
        const config = storyTypeConfig[typeKey]
        return (
          <Badge variant="outline" className="text-xs">
            {config?.label || story.type}
          </Badge>
        )
      },
    },
    {
      key: 'rally.name',
      title: 'Rally',
      render: (_, story) => (
        <span className="text-sm">{story.rally?.name || '-'}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, story) => {
        const statusKey = story.status as keyof typeof statusConfig
        const config = statusConfig[statusKey]
        return (
          <Badge variant="outline" className={`text-xs ${config?.color || ''}`}>
            {config?.label || story.status}
          </Badge>
        )
      },
    },
    {
      key: 'author',
      title: 'Author',
      render: (_, story) => (
        <div className="text-sm">
          <div>{story.author || '-'}</div>
          {story.role && <div className="text-xs text-muted-foreground">{story.role}</div>}
        </div>
      ),
    },
    {
      key: 'publishedAt',
      title: 'Published',
      render: (_, story) => {
        if (story.status === 'SCHEDULED' && story.scheduledAt) {
          return (
            <div className="text-sm">
              <div className="text-muted-foreground text-xs">Scheduled:</div>
              <div>{format(new Date(story.scheduledAt), 'MMM dd, yyyy HH:mm')}</div>
            </div>
          )
        }

        if (!story.publishedAt) {
          return <span className="text-muted-foreground text-sm">-</span>
        }

        return (
          <div className="text-sm">
            {format(new Date(story.publishedAt), 'MMM dd, yyyy HH:mm')}
          </div>
        )
      },
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (_, story) => (
        <div className="text-muted-foreground text-sm">
          {format(new Date(story.createdAt), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, story) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/stories/${story.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          {story.status === 'PUBLISHED' && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/stories/${story.slug}`} target="_blank">
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
      data={stories as unknown as Record<string, unknown>[]}
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={pageSize}
      searchPlaceholder="Search stories, authors, or tags..."
    />
  )
}
