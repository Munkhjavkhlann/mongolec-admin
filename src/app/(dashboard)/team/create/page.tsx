'use client'

import { TeamMemberForm } from '@/features/team/components/team-member-form'
import { PageHeader } from '@/components/admin'

export default function CreateTeamMemberPage() {
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title="Add Team Member"
        description="Add a new member to the organization team"
        backHref="/team"
      />
      <TeamMemberForm mode="create" />
    </div>
  )
}
