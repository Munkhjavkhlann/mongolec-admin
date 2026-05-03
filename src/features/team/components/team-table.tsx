'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Trash2, Pencil, Eye } from 'lucide-react'
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
import type { TeamMember } from '../types'
import { DELETE_TEAM_MEMBER } from '@/graphql/mutations/team'

function avatarColor(name: string) {
  const p = ['bg-rose-100 text-rose-700','bg-orange-100 text-orange-700','bg-amber-100 text-amber-700','bg-lime-100 text-lime-700','bg-teal-100 text-teal-700','bg-sky-100 text-sky-700','bg-violet-100 text-violet-700','bg-pink-100 text-pink-700']
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return p[h % p.length]
}

function ActionsCell({
  member,
  onDeleteClick,
}: {
  member: TeamMember
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
          <Link href={`/team/${member.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/team/${member.id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={() => onDeleteClick(member.id)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function buildColumns(onDeleteClick: (id: string) => void): ColumnDef<TeamMember>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Member',
      cell: ({ row }) => {
        const member = row.original
        const colorClass = avatarColor(member.name)
        const initial = member.name[0]?.toUpperCase() ?? '?'
        return (
          <div className="flex items-center gap-3">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
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
              <div className="font-medium truncate">{member.name}</div>
              <div className="text-xs text-muted-foreground truncate">{member.role}</div>
            </div>
          </div>
        )
      },
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
          <Badge
            variant={active ? 'default' : 'secondary'}
            className="gap-1"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-muted-foreground'}`}
            />
            {active ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    createCreatedAtColumn<TeamMember>(),
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionsCell member={row.original} onDeleteClick={onDeleteClick} />,
    },
  ]
}

interface TeamTableProps {
  members: TeamMember[]
  loading?: boolean
  onActionComplete?: () => void
}

export function TeamTable({ members, loading, onActionComplete }: TeamTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [deleteMember] = useMutation(DELETE_TEAM_MEMBER, {
    onCompleted: () => {
      toast.success('Team member deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedId(null)
      onActionComplete?.()
    },
    onError: error => toast.error(error.message),
  })

  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedId) deleteMember({ variables: { id: selectedId } })
  }

  const sortedMembers = [...members].sort((a, b) => a.displayOrder - b.displayOrder)
  const columns = buildColumns(handleDeleteClick)

  return (
    <>
      <DataTable
        data={sortedMembers}
        columns={columns}
        loading={loading}
        showIndexColumn={false}
        emptyMessage="No team members found."
        toolbarConfig={{ searchPlaceholder: 'Search team members...' }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
