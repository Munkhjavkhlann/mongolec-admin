'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { value: 'all', label: 'All', query: {} },
  { value: 'published', label: 'Published', query: { status: ['PUBLISHED'] } },
  { value: 'draft', label: 'Draft', query: { status: ['DRAFT'] } },
  { value: 'impact', label: 'Impact', query: { type: ['IMPACT'] } },
  { value: 'rider-profiles', label: 'Rider Profiles', query: { type: ['RIDER_PROFILE'] } },
  { value: 'field-moments', label: 'Field Moments', query: { type: ['FIELD_MOMENT'] } },
]

interface StoriesDataTableTabsProps {
  activeTab: string
}

export function StoriesDataTableTabs({ activeTab }: StoriesDataTableTabsProps) {
  const searchParams = useSearchParams()

  const buildQueryString = (query: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Clear existing filters
    params.delete('status')
    params.delete('type')

    // Add new filters
    Object.entries(query).forEach(([key, value]) => {
      value.forEach(v => params.append(key, v))
    })

    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
  }

  return (
    <div className="flex items-center space-x-1 border-b">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value
        const href = `/stories${buildQueryString(tab.query as Record<string, string[]>)}`

        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
