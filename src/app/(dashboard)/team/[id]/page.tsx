'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Pencil, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import { GET_TEAM_MEMBERS } from '@/graphql/queries/team'
import { PageHeader, FormSection, DetailField, EmptyState } from '@/components/admin'
import type { TeamMember } from '@/features/team/types'

interface GetTeamMembersData {
  getTeamMembers: TeamMember[]
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

export default function TeamDetailPage() {
  const params = useParams()
  const memberId = params.id as string

  const { data, loading, error } = useQuery<GetTeamMembersData>(GET_TEAM_MEMBERS, {
    skip: !memberId,
  })

  if (loading) {
    return (
      <div className="p-6">
        <EmptyState icon={Users} title="Loading team member…" className="py-20" />
      </div>
    )
  }

  const member = data?.getTeamMembers?.find((m) => m.id === memberId)

  if (error || !member) {
    return (
      <div className="space-y-4 p-6">
        <PageHeader title="Team Member" backHref="/team" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || 'Team member not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-5 p-6 max-w-4xl">
      <PageHeader
        title={member.name}
        description={member.role}
        backHref="/team"
        badge={
          <Badge variant={member.isActive ? 'default' : 'secondary'}>
            {member.isActive ? 'Active' : 'Inactive'}
          </Badge>
        }
        actions={
          <Link href={`/team/${memberId}/edit`}>
            <Button size="sm">
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {member.photo && (
            <FormSection title="Photo">
              <img
                src={member.photo}
                alt={member.name}
                className="h-48 w-48 rounded-lg object-cover border"
              />
            </FormSection>
          )}

          <FormSection title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Name" value={member.name} />
              <DetailField label="Role" value={member.role} />
              <DetailField label="Display Order" value={String(member.displayOrder)} />
              <DetailField
                label="Status"
                value={
                  <Badge variant={member.isActive ? 'default' : 'secondary'}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                }
              />
            </div>
          </FormSection>

          {member.bio && (
            <FormSection title="Biography">
              <p className="text-sm whitespace-pre-wrap text-foreground/80">{member.bio}</p>
            </FormSection>
          )}
        </div>

        <div className="space-y-5">
          <FormSection title="Metadata">
            <div className="space-y-3">
              <DetailField label="Created" value={formatDate(member.createdAt)} icon={Calendar} />
              <DetailField label="Last Updated" value={formatDate(member.updatedAt)} icon={Calendar} />
            </div>
          </FormSection>
        </div>
      </div>
    </div>
  )
}
