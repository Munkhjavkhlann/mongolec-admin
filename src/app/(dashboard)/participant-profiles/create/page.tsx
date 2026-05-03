'use client'

import { ParticipantProfileForm } from '@/features/participant-profiles/components/participant-profile-form'
import { PageHeader } from '@/components/admin'

export default function CreateParticipantProfilePage() {
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title="Add Participant Profile"
        description="Add a new participant profile"
        backHref="/participant-profiles"
      />
      <ParticipantProfileForm mode="create" />
    </div>
  )
}
