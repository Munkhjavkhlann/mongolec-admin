'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, createCreatedAtColumn } from '@/components/data-table'
import { MerchOrderDetailDialog } from './merch-order-detail-dialog'
import { type MerchOrder, orderStatusConfig } from '../types/orders'

function buildColumns(
  onViewClick: (order: MerchOrder) => void
): ColumnDef<MerchOrder>[] {
  return [
    {
      accessorKey: 'orderNumber',
      header: 'Order',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          #{row.original.orderNumber}
        </span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => {
        const order = row.original
        return (
          <div>
            <div className="font-medium text-sm">{order.customerName}</div>
            {order.phone && (
              <div className="text-xs text-muted-foreground">{order.phone}</div>
            )}
          </div>
        )
      },
    },
    {
      id: 'total',
      header: 'Total',
      cell: ({ row }) => {
        const order = row.original
        return (
          <span className="font-medium tabular-nums text-sm">
            <span className="text-xs text-muted-foreground mr-0.5">
              {order.currency}
            </span>
            {order.total.toLocaleString()}
          </span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const order = row.original
        const conf = orderStatusConfig[order.status]
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className={conf?.color ?? ''}>
                {conf?.label ?? order.status}
              </Badge>
              {order.paymentClaimedAt && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  Төлбөр төлсөн ✓
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {order.deliveryMethod === 'PICKUP' ? 'Pickup' : 'Delivery'}
            </span>
          </div>
        )
      },
    },
    createCreatedAtColumn<MerchOrder>(),
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewClick(row.original)}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View order</span>
        </Button>
      ),
    },
  ]
}

interface MerchOrdersTableProps {
  orders: MerchOrder[]
}

export function MerchOrdersTable({ orders }: MerchOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<MerchOrder | null>(null)

  const columns = buildColumns(setSelectedOrder)

  return (
    <>
      <DataTable
        data={orders}
        columns={columns}
        showIndexColumn={false}
        emptyMessage="No orders found."
        toolbarConfig={{ searchPlaceholder: 'Search orders...' }}
      />
      <MerchOrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null)
        }}
      />
    </>
  )
}
