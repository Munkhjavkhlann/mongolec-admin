'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, MoreHorizontal } from 'lucide-react'
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
import type { MerchCategory } from '../types'

const mockCategories: MerchCategory[] = [
  {
    id: '1',
    name: 'Apparel',
    slug: 'apparel',
    description: 'Clothing and wearables',
    color: '#3b82f6',
    productCount: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Hats, bags, and other accessories',
    color: '#10b981',
    productCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Collectibles',
    slug: 'collectibles',
    description: 'Limited edition items',
    color: '#f59e0b',
    productCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function ActionsCell({ category }: { category: MerchCategory }) {
  const handleDelete = () => {
    // TODO: Implement delete functionality
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
          <Link href={`/merch/categories/${category.id}/edit`}>
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

const columns: ColumnDef<MerchCategory>[] = [
  {
    accessorKey: 'name',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original
      return (
        <Badge
          variant="outline"
          style={{ borderColor: category.color, color: category.color }}
        >
          {category.name}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ getValue }) => (
      <span className="font-mono text-sm text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue }) => (
      <span className="max-w-[300px] truncate block">{getValue<string>() || '-'}</span>
    ),
  },
  {
    accessorKey: 'productCount',
    header: 'Products',
    cell: ({ getValue }) => <Badge variant="secondary">{getValue<number>()}</Badge>,
  },
  createCreatedAtColumn<MerchCategory>(),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell category={row.original} />,
  },
]

interface MerchCategoriesTableProps {
  categories?: MerchCategory[]
}

export function MerchCategoriesTable({ categories = mockCategories }: MerchCategoriesTableProps) {
  return (
    <DataTable
      data={categories}
      columns={columns}
      showIndexColumn={false}
      emptyMessage="No categories found."
      toolbarConfig={{ searchPlaceholder: 'Search categories...' }}
    />
  )
}
