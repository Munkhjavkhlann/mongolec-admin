'use client'

import { useQuery } from '@apollo/client/react'
import { TenantForm } from '@/features/tenant/components/tenant-form'
import { GET_TENANT_BY_ID } from '@/graphql/queries/tenant'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface GetTenantByIdData {
  tenantById: any;
}

export default function EditTenantPage({ params }: { params: { id: string } }) {
  const { data, loading, error } = useQuery<GetTenantByIdData>(GET_TENANT_BY_ID, {
    variables: { id: params.id },
  })

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading tenant...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tenant: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data?.tenantById) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Tenant not found
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Tenant</h1>
          <p className="text-muted-foreground mt-2">
            Update organization details
          </p>
        </div>

        <TenantForm
          mode="edit"
          tenantId={params.id}
          initialData={data.tenantById}
        />
      </div>
    </div>
  )
}
