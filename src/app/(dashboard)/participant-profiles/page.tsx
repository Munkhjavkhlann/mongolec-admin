'use client'

import { useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Users, Plus } from 'lucide-react'
import { ParticipantProfileTable } from '@/features/participant-profiles/components/participant-profile-table'
import { GET_PARTICIPANT_PROFILES } from '@/graphql/queries/participant-profiles'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'
import type { ParticipantProfile } from '@/features/participant-profiles/types'

interface GetParticipantsData {
  getParticipants: {
    participants: ParticipantProfile[]
    pagination: {
      total: number
    }
  }
}

export default function ParticipantProfilesPage() {
  const { data, loading, error, refetch } = useQuery<GetParticipantsData>(
    GET_PARTICIPANT_PROFILES,
    {
      variables: { limit: 100, page: 1 },
      fetchPolicy: 'cache-and-network',
    },
  )

  const participants = data?.getParticipants.participants ?? []

  const stats = [
    { label: 'Total', value: loading ? '—' : participants.length },
    {
      label: 'Active',
      value: loading ? '—' : participants.filter((p) => p.isActive).length,
      accent: 'green' as const,
    },
    {
      label: 'Inactive',
      value: loading ? '—' : participants.filter((p) => !p.isActive).length,
    },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Participant Profiles"
        description="Manage participant profiles for the Mongolec rally"
        actions={
          <Link href="/participant-profiles/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Participant
            </Button>
          </Link>
        }
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load participant profiles: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState icon={Users} title="Loading participant profiles…" className="py-12" />
        </div>
      ) : participants.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState
            icon={Users}
            title="No participant profiles yet"
            description="Add your first participant profile to get started."
          />
        </div>
      ) : (
        <ParticipantProfileTable
          participants={participants}
          loading={loading}
          onActionComplete={() => refetch()}
        />
      )}
    </div>
  )
}
