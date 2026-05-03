'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react'
import Link from 'next/link'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DataTable, createCreatedAtColumn } from '@/components/data-table'
import type { RangerProfile } from '../types'
import { DELETE_RANGER_PROFILE } from '@/graphql/mutations/ranger-profiles'

function avatarColor(name: string) {
  const p = [
    'bg-rose-100 text-rose-700',
    'bg-orange-100 text-orange-700',
    'bg-amber-100 text-amber-700',
    'bg-lime-100 text-lime-700',
    'bg-teal-100 text-teal-700',
    'bg-sky-100 text-sky-700',
    'bg-violet-100 text-violet-700',
    'bg-pink-100 text-pink-700',
  ]
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return p[h % p.length]
}

function ActionsCell({
  ranger,
  onDeleteClick,
}: {
  ranger: RangerProfile
  onDeleteClick: (id: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/ranger-profiles/${ranger.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={() => onDeleteClick(ranger.id)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function buildColumns(onDeleteClick: (id: string) => void): ColumnDef<RangerProfile>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Ranger',
      cell: ({ row }) => {
        const ranger = row.original
        const colorClass = avatarColor(ranger.name)
        const initial = ranger.name[0]?.toUpperCase() ?? '?'
        return (
          <div className="flex items-center gap-3">
            {ranger.photo ? (
              <img
                src={ranger.photo}
                alt={ranger.name}
                className="h-10 w-10 rounded-full object-cover border flex-shrink-0"
              />
            ) : (
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${colorClass}`}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{ranger.name}</div>
              <div className="text-xs text-muted-foreground truncate">{ranger.parkName}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ getValue }) => (
        <span className="text-sm font-mono text-muted-foreground">#{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ getValue }) => {
        const active = getValue<boolean>()
        return (
          <Badge variant={active ? 'default' : 'secondary'} className="gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-muted-foreground'}`}
            />
            {active ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    createCreatedAtColumn<RangerProfile>(),
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionsCell ranger={row.original} onDeleteClick={onDeleteClick} />,
    },
  ]
}

interface RangerProfileTableProps {
  rangers: RangerProfile[]
  loading?: boolean
  onActionComplete?: () => void
}

export function RangerProfileTable({ rangers, loading, onActionComplete }: RangerProfileTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [deleteRanger] = useMutation(DELETE_RANGER_PROFILE, {
    onCompleted: () => {
      toast.success('Ranger deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedId(null)
      onActionComplete?.()
    },
    onError: (error) => toast.error(error.message),
  })

  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedId) deleteRanger({ variables: { id: selectedId } })
  }

  const sortedRangers = [...rangers].sort((a, b) => a.displayOrder - b.displayOrder)
  const columns = buildColumns(handleDeleteClick)

  return (
    <>
      <DataTable
        data={sortedRangers}
        columns={columns}
        loading={loading}
        showIndexColumn={false}
        emptyMessage="No ranger profiles found."
        toolbarConfig={{ searchPlaceholder: 'Search rangers...' }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ranger</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ranger? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
