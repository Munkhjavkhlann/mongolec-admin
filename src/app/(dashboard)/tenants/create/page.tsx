'use client'

import { TenantForm } from '@/features/tenant/components/tenant-form'
import { PageHeader } from '@/components/admin'

export default function CreateTenantPage() {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <PageHeader
        title="Create Tenant"
        description="Add a new organization to the platform"
        backHref="/tenants"
      />
      <TenantForm mode="create" />
    </div>
  )
}
