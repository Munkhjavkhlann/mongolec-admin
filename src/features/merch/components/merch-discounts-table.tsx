'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable, createCreatedAtColumn } from '@/components/data-table'
import { DELETE_MERCH_DISCOUNT } from '@/graphql/mutations/merch'
import { GET_MERCH_DISCOUNTS } from '@/graphql/queries/merch'
import type { MerchDiscount } from '../types'

function ActionsCell({ discount }: { discount: MerchDiscount }) {
  const [deleteDiscount] = useMutation(DELETE_MERCH_DISCOUNT, {
    refetchQueries: [{ query: GET_MERCH_DISCOUNTS }],
    onCompleted: () => {
      toast.success('Discount deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete discount')
    },
  })

  const handleDelete = () => {
    if (!confirm(`Delete discount "${discount.name}"? This cannot be undone.`)) return
    deleteDiscount({ variables: { id: discount.id } })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/merch/discounts/${discount.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<MerchDiscount>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => {
      const type = getValue<string>()
      return (
        <Badge variant={type === 'PERCENT' ? 'default' : 'secondary'}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const { type, value } = row.original
      return (
        <span className="font-mono text-sm">
          {type === 'PERCENT' ? `${value}%` : `$${value.toFixed(2)}`}
        </span>
      )
    },
  },
  {
    id: 'dateRange',
    header: 'Date Range',
    cell: ({ row }) => {
      const { startDate, endDate } = row.original
      const fmt = (d: string) => {
        try { return format(new Date(d), 'MMM d, yyyy') } catch { return d }
      }
      return (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {fmt(startDate)} – {fmt(endDate)}
        </span>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ getValue }) => (
      <Badge variant={getValue<boolean>() ? 'default' : 'outline'}>
        {getValue<boolean>() ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    id: 'productCount',
    header: 'Products',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.productIds?.length ?? 0}</Badge>
    ),
  },
  createCreatedAtColumn<MerchDiscount>(),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell discount={row.original} />,
  },
]

interface MerchDiscountsTableProps {
  discounts?: MerchDiscount[]
}

export function MerchDiscountsTable({ discounts = [] }: MerchDiscountsTableProps) {
  return (
    <DataTable
      data={discounts}
      columns={columns}
      showIndexColumn={false}
      emptyMessage="No discounts found."
      toolbarConfig={{ searchPlaceholder: 'Search discounts...' }}
    />
  )
}
