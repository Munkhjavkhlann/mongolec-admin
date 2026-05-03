'use client'

import { useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Shield, Plus } from 'lucide-react'
import { RangerProfileTable } from '@/features/ranger-profiles/components/ranger-profile-table'
import { GET_RANGERS_PROFILES } from '@/graphql/queries/ranger-profiles'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'
import type { RangerProfile } from '@/features/ranger-profiles/types'

interface GetRangersData {
  getRangers: {
    rangers: RangerProfile[]
    pagination: {
      total: number
    }
  }
}

export default function RangerProfilesPage() {
  const { data, loading, error, refetch } = useQuery<GetRangersData>(GET_RANGERS_PROFILES, {
    variables: { limit: 100, page: 1 },
    fetchPolicy: 'cache-and-network',
  })

  const rangers = data?.getRangers.rangers ?? []

  const stats = [
    { label: 'Total', value: loading ? '—' : rangers.length },
    {
      label: 'Active',
      value: loading ? '—' : rangers.filter((r) => r.isActive).length,
      accent: 'green' as const,
    },
    { label: 'Inactive', value: loading ? '—' : rangers.filter((r) => !r.isActive).length },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Ranger Profiles"
        description="Manage ranger profiles for the Mongolec rally"
        actions={
          <Link href="/ranger-profiles/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Ranger
            </Button>
          </Link>
        }
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load ranger profiles: {error.message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState icon={Shield} title="Loading ranger profiles…" className="py-12" />
        </div>
      ) : rangers.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState
            icon={Shield}
            title="No ranger profiles yet"
            description="Add your first ranger profile to get started."
          />
        </div>
      ) : (
        <RangerProfileTable rangers={rangers} loading={loading} onActionComplete={() => refetch()} />
      )}
    </div>
  )
}
