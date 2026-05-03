'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, MoreHorizontal, Package, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
import { DataTable, createActionsColumn, createCreatedAtColumn } from '@/components/data-table'
import type { MerchProduct } from '../types'
import { merchStatusConfig } from '../types'

function getDisplayName(field: string | { en: string; mn: string } | undefined): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field.en || field.mn || ''
}

function getTotalInventory(product: MerchProduct): number {
  if (product.hasVariants && product.variants?.length) {
    return product.variants.reduce((sum, v) => sum + (v.inventory || 0), 0)
  }
  return product.inventory || 0
}

function getPriceDisplay(product: MerchProduct): string {
  if (product.hasVariants && product.variants?.length) {
    const prices = product.variants.map(v => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return `${min.toLocaleString()}`
    return `${min.toLocaleString()} – ${max.toLocaleString()}`
  }
  return `${product.price.toLocaleString()}`
}

function ActionsCell({ row }: { row: { original: MerchProduct } }) {
  const product = row.original
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
          <Link href={`/merch/products/${product.id}`}>
            <Package className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/merch/products/${product.id}/edit`}>
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

const columns: ColumnDef<MerchProduct>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original
      const name = getDisplayName(product.name)
      return (
        <div className="flex items-center gap-3">
          {product.featuredImage ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted flex-shrink-0">
              <Image
                src={product.featuredImage}
                alt={name || 'Product'}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted border flex-shrink-0">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">
              {name || <span className="text-muted-foreground italic">Untitled Product</span>}
            </div>
            {product.sku && (
              <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const product = row.original
      const conf = merchStatusConfig[product.status]
      return (
        <Badge variant="outline" className={`${conf?.color || ''} gap-1.5`}>
          {conf?.label || product.status}
          {product.isFeatured && (
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 ml-1" />
          )}
        </Badge>
      )
    },
  },
  {
    id: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const product = row.original
      return (
        <div>
          <div className="font-medium">
            <span className="text-xs text-muted-foreground mr-0.5">{product.currency}</span>
            {getPriceDisplay(product)}
          </div>
          {product.compareAtPrice && !product.hasVariants && (
            <div className="text-xs text-muted-foreground line-through">
              {product.currency} {product.compareAtPrice.toLocaleString()}
            </div>
          )}
        </div>
      )
    },
  },
  {
    id: 'inventory',
    header: 'Stock',
    cell: ({ row }) => {
      const product = row.original
      const total = getTotalInventory(product)
      const minStock = product.minStock || 10
      const variantCount = product.hasVariants ? (product.variants?.length ?? 0) : 0

      let stockBadge: React.ReactNode
      if (total === 0) {
        stockBadge = (
          <Badge variant="outline" className="text-xs mt-1 border-destructive/50 text-destructive">
            Out of Stock
          </Badge>
        )
      } else if (total <= minStock) {
        stockBadge = (
          <Badge variant="outline" className="text-xs mt-1 bg-amber-50 text-amber-700 border-amber-200">
            Low Stock
          </Badge>
        )
      } else {
        stockBadge = (
          <Badge variant="outline" className="text-xs mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
            In Stock
          </Badge>
        )
      }

      return (
        <div>
          <div className="font-medium text-sm">{total}</div>
          {variantCount > 0 && (
            <div className="text-xs text-muted-foreground">
              {variantCount} variant{variantCount !== 1 ? 's' : ''}
            </div>
          )}
          {stockBadge}
        </div>
      )
    },
  },
  createCreatedAtColumn<MerchProduct>(),
  createActionsColumn<MerchProduct>(ActionsCell),
]

interface MerchProductsTableProps {
  products: MerchProduct[]
}

export function MerchProductsTable({ products }: MerchProductsTableProps) {
  return (
    <DataTable
      data={products}
      columns={columns}
      showIndexColumn={false}
      enableRowSelection
      emptyMessage="No products found."
      toolbarConfig={{ searchPlaceholder: 'Search products...' }}
    />
  )
}
