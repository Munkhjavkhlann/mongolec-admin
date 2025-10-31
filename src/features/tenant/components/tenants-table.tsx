'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Trash2, MoreHorizontal, Building2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { Tenant } from '../types'
import { tenantStatusConfig, tenantPlanConfig } from '../types'
import { formatDistanceToNow } from 'date-fns'

interface TenantsTableProps {
  tenants: Tenant[]
  onDelete?: (id: string) => void
}

export function TenantsTable({ tenants, onDelete }: TenantsTableProps) {
  const [selectedTenants, setSelectedTenants] = useState<string[]>([])

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id)
    } else {
      console.log('Delete tenant:', id)
    }
  }

  const toggleTenant = (tenantId: string) => {
    setSelectedTenants(prev =>
      prev.includes(tenantId)
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId]
    )
  }

  const toggleAll = () => {
    setSelectedTenants(prev =>
      prev.length === tenants.length ? [] : tenants.map(t => t.id)
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedTenants.length === tenants.length && tenants.length > 0}
                onCheckedChange={toggleAll}
                aria-label="Select all tenants"
              />
            </TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No tenants found.
              </TableCell>
            </TableRow>
          ) : (
            tenants.map((tenant) => {
              const statusConf = tenantStatusConfig[tenant.status]
              const planConf = tenantPlanConfig[tenant.plan]

              return (
                <TableRow key={tenant.id}>
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedTenants.includes(tenant.id)}
                      onCheckedChange={() => toggleTenant(tenant.id)}
                      aria-label={`Select ${tenant.name}`}
                    />
                  </TableCell>

                  {/* Tenant Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted border">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{tenant.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Slug: {tenant.slug}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Domain */}
                  <TableCell>
                    {tenant.domain ? (
                      <div className="text-sm">{tenant.domain}</div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="outline" className={statusConf?.color || ''}>
                      {statusConf?.label || tenant.status}
                    </Badge>
                  </TableCell>

                  {/* Plan */}
                  <TableCell>
                    <Badge variant="outline" className={planConf?.color || ''}>
                      {planConf?.label || tenant.plan}
                    </Badge>
                  </TableCell>

                  {/* Created */}
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(tenant.createdAt), { addSuffix: true })}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
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
                          onClick={() => handleDelete(tenant.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
