'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trophy } from 'lucide-react'
import Link from 'next/link'
import { RalliesTable } from '@/features/rallies/components/rallies-table'
import { GET_RALLIES } from '@/graphql/queries/rallies'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'

interface GetRalliesData {
  getRallies: {
    rallies: any[]
    pagination: any
  }
}

const STATUS_TABS = [
  { value: 'all', label: 'All', filter: undefined },
  { value: 'upcoming', label: 'Upcoming', filter: 'UPCOMING' as const },
  { value: 'ongoing', label: 'Ongoing', filter: 'ONGOING' as const },
  { value: 'completed', label: 'Completed', filter: 'COMPLETED' as const },
  { value: 'draft', label: 'Draft', filter: 'DRAFT' as const },
]

export default function RalliesPage() {
  const [activeTab, setActiveTab] = useState('all')

  const activeFilter = STATUS_TABS.find(t => t.value === activeTab)?.filter

  const { data, loading, error } = useQuery<GetRalliesData>(GET_RALLIES, {
    variables: { status: activeFilter, limit: 100, page: 1 },
    fetchPolicy: 'cache-and-network',
  })

  const { data: allData, loading: allLoading } = useQuery<GetRalliesData>(GET_RALLIES, {
    variables: { limit: 1000, page: 1 },
    fetchPolicy: 'cache-and-network',
  })

  const rallies = data?.getRallies?.rallies ?? []
  const allRallies = allData?.getRallies?.rallies ?? []

  const stats = [
    { label: 'Total', value: allLoading ? '—' : allRallies.length },
    { label: 'Upcoming', value: allLoading ? '—' : allRallies.filter((r: any) => r.status === 'UPCOMING').length, accent: 'blue' as const },
    { label: 'Ongoing', value: allLoading ? '—' : allRallies.filter((r: any) => r.status === 'ONGOING').length, accent: 'green' as const },
    { label: 'Recruiting', value: allLoading ? '—' : allRallies.filter((r: any) => r.isRecruiting).length, accent: 'primary' as const },
    { label: 'Completed', value: allLoading ? '—' : allRallies.filter((r: any) => r.status === 'COMPLETED').length },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Rallies"
        description="Manage rallies, dates, and participation"
        actions={
          <Button size="sm" asChild>
            <Link href="/rallies/create">
              <Plus className="h-4 w-4 mr-1.5" />
              New Rally
            </Link>
          </Button>
        }
      />

      <StatBar stats={stats} loading={allLoading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load rallies: {error.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-9">
          {STATUS_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-4">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {loading ? (
              <div className="rounded-xl border border-border/60 bg-card">
                <EmptyState
                  icon={Trophy}
                  title="Loading rallies…"
                  className="py-12"
                />
              </div>
            ) : rallies.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-card">
                <EmptyState
                  icon={Trophy}
                  title="No rallies found"
                  description="Create a new rally to get started."
                  action={
                    <Button size="sm" asChild>
                      <Link href="/rallies/create">
                        <Plus className="h-4 w-4 mr-1.5" />
                        New Rally
                      </Link>
                    </Button>
                  }
                />
              </div>
            ) : (
              <RalliesTable rallies={rallies} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
