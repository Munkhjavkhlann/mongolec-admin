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

interface NewsCategory {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  articleCount: number
  createdAt: string
}

const mockCategories: NewsCategory[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    color: '#3b82f6',
    description: 'Latest tech news and updates',
    articleCount: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sports',
    slug: 'sports',
    color: '#10b981',
    description: 'Sports news and scores',
    articleCount: 35,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Politics',
    slug: 'politics',
    color: '#ef4444',
    description: 'Political news and analysis',
    articleCount: 28,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Business',
    slug: 'business',
    color: '#f59e0b',
    description: 'Business and finance news',
    articleCount: 31,
    createdAt: new Date().toISOString(),
  },
]

function ActionsCell({ category }: { category: NewsCategory }) {
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
          <Link href={`/news/categories/${category.id}/edit`}>
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

const columns: ColumnDef<NewsCategory>[] = [
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
      <span className="max-w-[300px] truncate block">{getValue<string | undefined>() || '-'}</span>
    ),
  },
  {
    accessorKey: 'articleCount',
    header: 'Articles',
    cell: ({ getValue }) => <Badge variant="secondary">{getValue<number>()}</Badge>,
  },
  createCreatedAtColumn<NewsCategory>(),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell category={row.original} />,
  },
]

interface NewsCategoriesTableProps {
  categories?: NewsCategory[]
}

export function NewsCategoriesTable({ categories = mockCategories }: NewsCategoriesTableProps) {
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
