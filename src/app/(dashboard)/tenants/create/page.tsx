'use client'

import { TenantForm } from '@/features/tenant/components/tenant-form'

export default function CreateTenantPage() {
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Tenant</h1>
          <p className="text-muted-foreground mt-2">
            Add a new organization to the platform
          </p>
        </div>

        <TenantForm mode="create" />
      </div>
    </div>
  )
}
