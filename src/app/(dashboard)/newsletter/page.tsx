'use client'

import { useQuery } from '@apollo/client/react'
import { Mail } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTable, createCreatedAtColumn } from '@/components/data-table'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'
import { GET_NEWSLETTER_SUBSCRIPTIONS } from '@/graphql/queries/newsletter'

type SubscriptionStatus = 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED' | 'PENDING'

interface Subscriber {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  status: SubscriptionStatus
  source: string | null
  interests: unknown
  createdAt: string
  updatedAt: string
}

interface GetNewsletterSubscriptionsData {
  getNewsletterSubscriptions: {
    subscriptions: Subscriber[]
    pagination: {
      total: number
      totalPages: number
      currentPage: number
      perPage: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

const STATUS_BADGE_CONFIG: Record<
  SubscriptionStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  UNSUBSCRIBED: {
    label: 'Unsubscribed',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  BOUNCED: {
    label: 'Bounced',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
}

const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<string>()}</span>
    ),
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      const name = [firstName, lastName].filter(Boolean).join(' ')
      return name ? (
        <span className="text-sm">{name}</span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<SubscriptionStatus>()
      const conf = STATUS_BADGE_CONFIG[status] ?? {
        label: status,
        className: '',
      }
      return (
        <Badge variant="outline" className={conf.className}>
          {conf.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ getValue }) => {
      const source = getValue<string | null>()
      return source ? (
        <span className="text-sm">{source}</span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      )
    },
  },
  createCreatedAtColumn<Subscriber>({ title: 'Subscribed' }),
]

export default function NewsletterPage() {
  const { data, loading, error } = useQuery<GetNewsletterSubscriptionsData>(
    GET_NEWSLETTER_SUBSCRIPTIONS,
    {
      variables: { limit: 50 },
      fetchPolicy: 'cache-and-network',
    }
  )

  const subscriptions = data?.getNewsletterSubscriptions?.subscriptions ?? []

  const total = subscriptions.length
  const activeCount = subscriptions.filter((s) => s.status === 'ACTIVE').length
  const unsubscribedCount = subscriptions.filter(
    (s) => s.status === 'UNSUBSCRIBED'
  ).length

  const stats = [
    { label: 'Total', value: loading ? '—' : total },
    {
      label: 'Active',
      value: loading ? '—' : activeCount,
      accent: 'green' as const,
    },
    {
      label: 'Unsubscribed',
      value: loading ? '—' : unsubscribedCount,
    },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Newsletter Subscribers"
        description="View and manage newsletter subscriptions"
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load subscribers: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState icon={Mail} title="Loading subscribers…" className="py-12" />
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState
            icon={Mail}
            title="No subscribers found"
            description="Newsletter subscribers will appear here once they sign up."
          />
        </div>
      ) : (
        <DataTable
          data={subscriptions}
          columns={columns}
          loading={loading}
          showIndexColumn={false}
          emptyMessage="No subscribers found."
          toolbarConfig={{ searchPlaceholder: 'Search subscribers…' }}
        />
      )}
    </div>
  )
}
