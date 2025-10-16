'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { MerchCategory } from '../types'

// Mock data - replace with actual API call
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

export function MerchCategoriesTable() {
  const [categories] = useState<MerchCategory[]>(mockCategories)

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete category:', id)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: category.color,
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {category.slug}
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{category.productCount}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
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
                        <Link href={`/merch/categories/${category.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(category.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
