'use client'

import { useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Users, Plus } from 'lucide-react'
import { TeamTable } from '@/features/team/components/team-table'
import { GET_TEAM_MEMBERS } from '@/graphql/queries/team'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'
import type { TeamMember } from '@/features/team/types'

interface GetTeamMembersData {
  getTeamMembers: TeamMember[]
}

export default function TeamPage() {
  const { data, loading, error, refetch } = useQuery<GetTeamMembersData>(
    GET_TEAM_MEMBERS,
    { fetchPolicy: 'cache-and-network' }
  )

  const members = data?.getTeamMembers ?? []

  const stats = [
    { label: 'Total', value: loading ? '—' : members.length },
    { label: 'Active', value: loading ? '—' : members.filter((m) => m.isActive).length, accent: 'green' as const },
    { label: 'Inactive', value: loading ? '—' : members.filter((m) => !m.isActive).length },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Team Members"
        description="Manage organization team members"
        actions={
          <Link href="/team/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Member
            </Button>
          </Link>
        }
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load team members: {error.message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState icon={Users} title="Loading team members…" className="py-12" />
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card">
          <EmptyState icon={Users} title="No team members yet" description="Add your first team member to get started." />
        </div>
      ) : (
        <TeamTable members={members} loading={loading} onActionComplete={() => refetch()} />
      )}
    </div>
  )
}
