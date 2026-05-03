'use client'

import { RangerProfileForm } from '@/features/ranger-profiles/components/ranger-profile-form'
import { PageHeader } from '@/components/admin'

export default function CreateRangerProfilePage() {
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title="Add Ranger Profile"
        description="Add a new ranger profile"
        backHref="/ranger-profiles"
      />
      <RangerProfileForm mode="create" />
    </div>
  )
}
