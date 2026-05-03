'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Trophy, Calendar, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DataTable, createCreatedAtColumn } from '@/components/data-table'
import type { Rally } from '../types'
import { rallyStatusConfig } from '../types'
import { CHANGE_RALLY_STATUS, TOGGLE_RALLY_RECRUITING, DELETE_RALLY } from '@/graphql/mutations/rallies'

function getDisplayName(field: string | { en: string; mn: string } | undefined): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field.en || field.mn || ''
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ActionsCell({
  rally,
  onDeleteClick,
}: {
  rally: Rally
  onDeleteClick: (id: string) => void
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
          <Link href={`/rallies/${rally.id}`}>
            <Trophy className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/rallies/${rally.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDeleteClick(rally.id)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function buildColumns(
  onDeleteClick: (id: string) => void,
  onStatusChange: (id: string, status: string) => void,
  onToggleRecruiting: (id: string) => void
): ColumnDef<Rally>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Rally',
      cell: ({ row }) => {
        const rally = row.original
        const title = getDisplayName(rally.title)
        const dateRange = `${formatDate(rally.startDate)} – ${formatDate(rally.endDate)}`
        return (
          <div className="flex items-center gap-3">
            {rally.heroImage ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-muted flex-shrink-0">
                <Image
                  src={rally.heroImage}
                  alt={title || 'Rally'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted border flex-shrink-0">
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate text-sm">
                {title || <span className="text-muted-foreground italic">Untitled Rally</span>}
              </div>
              {rally.slug && (
                <div className="text-xs text-muted-foreground font-mono">{rally.slug}</div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{dateRange}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(value) => onStatusChange(row.original.id, value)}
        >
          <SelectTrigger className="h-7 w-[130px] text-xs border-0 bg-muted/50 rounded-full px-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(rallyStatusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: 'currentParticipants',
      header: 'Participants',
      cell: ({ row }) => {
        const rally = row.original
        const count = rally.currentParticipants || 0
        const max = rally.maxParticipants
        const isFull = max !== undefined && count >= max
        const pct = max ? Math.min((count / max) * 100, 100) : 0
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{count}</span>
              {max !== undefined && (
                <span className="text-muted-foreground">/ {max}</span>
              )}
              {isFull && (
                <Badge variant="destructive" className="text-xs ml-1 h-4 px-1.5">
                  Full
                </Badge>
              )}
            </div>
            {max !== undefined && (
              <div className="h-1 w-20 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'isRecruiting',
      header: 'Recruiting',
      cell: ({ row }) => {
        const rally = row.original
        return (
          <div
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium"
            onClick={() => onToggleRecruiting(rally.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onToggleRecruiting(rally.id)}
          >
            {rally.isRecruiting ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-green-600">Open</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                <span className="text-muted-foreground">Closed</span>
              </>
            )}
          </div>
        )
      },
    },
    createCreatedAtColumn<Rally>(),
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionsCell rally={row.original} onDeleteClick={onDeleteClick} />,
    },
  ]
}

interface RalliesTableProps {
  rallies: Rally[]
  loading?: boolean
}

export function RalliesTable({ rallies, loading }: RalliesTableProps) {
  const router = useRouter()
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null)

  const [updateStatus] = useMutation(CHANGE_RALLY_STATUS, {
    onCompleted: () => {
      toast.success('Rally status updated successfully')
      router.refresh()
    },
    onError: error => toast.error(error.message),
  })

  const [toggleRecruiting] = useMutation(TOGGLE_RALLY_RECRUITING, {
    onCompleted: () => {
      toast.success('Recruiting status toggled successfully')
      router.refresh()
    },
    onError: error => toast.error(error.message),
  })

  const [deleteRally] = useMutation(DELETE_RALLY, {
    onCompleted: () => {
      toast.success('Rally deleted successfully')
      setDeleteDialogId(null)
      router.refresh()
    },
    onError: error => {
      toast.error(error.message)
      setDeleteDialogId(null)
    },
  })

  const handleStatusChange = (id: string, status: string) => {
    updateStatus({ variables: { id, status }, refetchQueries: ['GetRallies'] })
  }

  const handleToggleRecruiting = (id: string) => {
    toggleRecruiting({ variables: { id }, refetchQueries: ['GetRallies'] })
  }

  const handleDeleteClick = (id: string) => setDeleteDialogId(id)

  const confirmDelete = () => {
    if (deleteDialogId) deleteRally({ variables: { id: deleteDialogId }, refetchQueries: ['GetRallies'] })
  }

  const columns = buildColumns(handleDeleteClick, handleStatusChange, handleToggleRecruiting)

  return (
    <>
      <DataTable
        data={rallies}
        columns={columns}
        loading={loading}
        showIndexColumn={false}
        enableRowSelection
        emptyMessage="No rallies found."
        toolbarConfig={{ searchPlaceholder: 'Search rallies...' }}
      />

      <AlertDialog open={!!deleteDialogId} onOpenChange={() => setDeleteDialogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rally</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The rally and all its data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
