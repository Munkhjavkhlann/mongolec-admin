'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Plus, Building2 } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { TenantsTable } from '@/features/tenant/components/tenants-table'
import { GET_TENANTS } from '@/graphql/queries/tenant'
import { DELETE_TENANT } from '@/graphql/mutations/tenant'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'

interface GetTenantsData {
  tenants: any[]
}

export default function TenantsPage() {
  const { data, loading, error } = useQuery<GetTenantsData>(GET_TENANTS)
  const [deleteTenant] = useMutation(DELETE_TENANT)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null)

  const tenants = data?.tenants || []

  const stats = [
    { label: 'Total Tenants', value: tenants.length },
    { label: 'Active', value: tenants.filter((t: any) => t.status === 'ACTIVE').length, accent: 'green' as const },
    { label: 'Free Plan', value: tenants.filter((t: any) => t.plan === 'FREE').length },
    { label: 'Pro Plan', value: tenants.filter((t: any) => t.plan === 'PRO').length, accent: 'blue' as const },
  ]

  const handleDeleteClick = (id: string) => {
    setTenantToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!tenantToDelete) return
    try {
      await deleteTenant({
        variables: { id: tenantToDelete },
        refetchQueries: ['GetTenants'],
      })
      toast.success('Tenant deleted successfully')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete tenant')
    } finally {
      setDeleteDialogOpen(false)
      setTenantToDelete(null)
    }
  }

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Tenants"
        description="Manage organizations and their subscriptions"
        actions={
          <Button asChild>
            <Link href="/tenants/create">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Tenant
            </Link>
          </Button>
        }
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load tenants: {error.message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <EmptyState icon={Building2} title="Loading tenants…" className="py-20" />
      ) : (
        <TenantsTable tenants={tenants} onDelete={handleDeleteClick} />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tenant and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
