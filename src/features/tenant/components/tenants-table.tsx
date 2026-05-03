'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, MoreHorizontal, Building2 } from 'lucide-react'
import Link from 'next/link'

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
import type { Tenant } from '../types'
import { tenantStatusConfig, tenantPlanConfig } from '../types'

function ActionsCell({
  tenant,
  onDelete,
}: {
  tenant: Tenant
  onDelete?: (id: string) => void
}) {
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
          <Link href={`/tenants/${tenant.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(tenant.id)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function buildColumns(onDelete?: (id: string) => void): ColumnDef<Tenant>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Organization',
      cell: ({ row }) => {
        const tenant = row.original
        const subline = tenant.domain
          ? `${tenant.slug} · ${tenant.domain}`
          : tenant.slug
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted border flex-shrink-0">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate">{tenant.name}</div>
              <div className="text-xs text-muted-foreground font-mono truncate">{subline}</div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'meta',
      header: 'Plan & Status',
      cell: ({ row }) => {
        const tenant = row.original
        const planConf = tenantPlanConfig[tenant.plan]
        const statusConf = tenantStatusConfig[tenant.status]
        return (
          <div>
            <Badge variant="outline" className={planConf?.color || ''}>
              {planConf?.label || tenant.plan}
            </Badge>
            <div className="mt-1">
              <Badge variant="outline" className={statusConf?.color || ''}>
                {statusConf?.label || tenant.status}
              </Badge>
            </div>
          </div>
        )
      },
    },
    createCreatedAtColumn<Tenant>(),
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionsCell tenant={row.original} onDelete={onDelete} />,
    },
  ]
}

interface TenantsTableProps {
  tenants: Tenant[]
  onDelete?: (id: string) => void
}

export function TenantsTable({ tenants, onDelete }: TenantsTableProps) {
  const columns = buildColumns(onDelete)

  return (
    <DataTable
      data={tenants}
      columns={columns}
      showIndexColumn={false}
      enableRowSelection
      emptyMessage="No tenants found."
      toolbarConfig={{ searchPlaceholder: 'Search tenants...' }}
    />
  )
}
