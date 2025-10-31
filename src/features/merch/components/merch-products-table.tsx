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
import { Edit, Trash2, MoreHorizontal, Package, Star } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import Image from 'next/image'
import type { MerchProduct } from '../types'
import { merchStatusConfig } from '../types'

interface MerchProductsTableProps {
  products: MerchProduct[]
}

export function MerchProductsTable({ products }: MerchProductsTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Helper to extract string from multilingual field
  const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.en || field.mn || '';
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete product:', id)
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleAll = () => {
    setSelectedProducts(prev =>
      prev.length === products.length ? [] : products.map(p => p.id)
    )
  }

  // Helper to calculate total inventory from variants
  const getTotalInventory = (product: MerchProduct) => {
    if (product.hasVariants && product.variants?.length) {
      return product.variants.reduce((sum, variant) => sum + (variant.inventory || 0), 0)
    }
    return product.inventory || 0
  }

  // Helper to get price range for products with variants
  const getPriceDisplay = (product: MerchProduct) => {
    if (product.hasVariants && product.variants?.length) {
      const prices = product.variants.map(v => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      if (minPrice === maxPrice) {
        return `${product.currency} ${minPrice.toLocaleString()}`
      }
      return `${product.currency} ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`
    }
    return `${product.currency} ${product.price.toLocaleString()}`
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={toggleAll}
                aria-label="Select all products"
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const statusKey = product.status as keyof typeof merchStatusConfig
              const statusConf = merchStatusConfig[statusKey]
              const totalInventory = getTotalInventory(product)
              const isLowStock = totalInventory <= (product.minStock || 10)

              return (
                <TableRow key={product.id}>
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                      aria-label={`Select ${getDisplayName(product.name) || 'product'}`}
                    />
                  </TableCell>

                  {/* Product Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.featuredImage ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={product.featuredImage}
                            alt={getDisplayName(product.name) || 'Product'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted border">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {getDisplayName(product.name) || <span className="text-muted-foreground italic">Untitled Product</span>}
                        </div>
                        {product.sku && (
                          <div className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={statusConf?.color || ''}>
                        {statusConf?.label || product.status}
                      </Badge>
                      {product.isFeatured && (
                        <Badge variant="secondary" className="w-fit">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="font-medium">{getPriceDisplay(product)}</div>
                    {product.compareAtPrice && !product.hasVariants && (
                      <div className="text-xs text-muted-foreground line-through">
                        {product.currency} {product.compareAtPrice.toLocaleString()}
                      </div>
                    )}
                  </TableCell>

                  {/* Variants */}
                  <TableCell>
                    {product.hasVariants && product.variants?.length ? (
                      <Badge variant="secondary">
                        {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Inventory */}
                  <TableCell>
                    <div>
                      <div className={`font-medium ${isLowStock ? 'text-destructive' : ''}`}>
                        {totalInventory}
                      </div>
                      {isLowStock && totalInventory > 0 && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Low Stock
                        </Badge>
                      )}
                      {totalInventory === 0 && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Out of Stock
                        </Badge>
                      )}
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
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id)}
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
