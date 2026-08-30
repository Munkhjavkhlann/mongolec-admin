'use client'

import { useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MerchOrdersTable } from '@/features/merch/components/merch-orders-table'
import { OrdersExportButton } from '@/features/merch/components/orders-export-button'
import { GET_MERCH_ORDERS } from '@/graphql/queries/merch-orders'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'
import { orderStatusConfig } from '@/features/merch/types/orders'
import type { MerchOrder } from '@/features/merch/types/orders'

interface GetMerchOrdersData {
  getMerchOrders: MerchOrder[]
}

export default function MerchOrdersPage() {
  const { data, loading, error } = useQuery<GetMerchOrdersData>(GET_MERCH_ORDERS, {
    variables: { limit: 100, offset: 0 },
  })

  const orders = data?.getMerchOrders ?? []

  const pending = orders.filter((o) => o.status === 'PENDING').length
  const shipped = orders.filter((o) => o.status === 'SHIPPED').length
  const delivered = orders.filter((o) => o.status === 'DELIVERED').length

  const stats = [
    { label: 'Total Orders', value: orders.length },
    { label: 'Pending', value: pending, accent: 'blue' as const },
    { label: 'Shipped', value: shipped },
    { label: 'Delivered', value: delivered, accent: 'green' as const },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Orders"
        description="View and manage merchandise orders"
        actions={
          <div className="flex items-center gap-2">
            <OrdersExportButton orders={orders} />
            <Button variant="outline" asChild>
              <Link href="/merch">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Merch
              </Link>
            </Button>
          </div>
        }
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load orders: {error.message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <EmptyState icon={ShoppingCart} title="Loading orders…" className="py-20" />
      ) : (
        <MerchOrdersTable orders={orders} />
      )}
    </div>
  )
}
