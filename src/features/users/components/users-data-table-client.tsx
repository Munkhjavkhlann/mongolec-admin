'use client'

import { useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MinusCircle,
  MoreHorizontal,
  X,
  XCircle,
} from 'lucide-react'

import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'

import { DataTable, createActionsColumn, createCreatedAtColumn } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import type { User } from '../types'

const APPROVE_USER = gql`
  mutation ApproveUser($userId: ID!) {
    approveUser(userId: $userId) {
      success
      message
    }
  }
`

const REJECT_USER = gql`
  mutation RejectUser($userId: ID!, $reason: String) {
    rejectUser(userId: $userId, reason: $reason) {
      success
      message
    }
  }
`

interface UsersDataTableClientProps {
  users: User[]
  totalItems: number
  currentPage: number
  pageSize: number
}

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }
> = {
  ACTIVE:   { label: 'Active',   variant: 'default',     icon: CheckCircle2 },
  PENDING:  { label: 'Pending',  variant: 'outline',     icon: Clock },
  REJECTED: { label: 'Rejected', variant: 'destructive', icon: XCircle },
  INACTIVE: { label: 'Inactive', variant: 'secondary',   icon: MinusCircle },
}

function getUserStatus(user: User): string {
  if (user.rejectedAt) return 'REJECTED'
  if (user.isActive) return 'ACTIVE'
  if (!user.approvedAt) return 'PENDING'
  return 'INACTIVE'
}

function avatarColor(name: string) {
  const p = ['bg-rose-100 text-rose-700','bg-orange-100 text-orange-700','bg-amber-100 text-amber-700','bg-lime-100 text-lime-700','bg-teal-100 text-teal-700','bg-sky-100 text-sky-700','bg-violet-100 text-violet-700','bg-pink-100 text-pink-700']
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return p[h % p.length]
}

function UserActionsMenu({
  user,
  onApprove,
  onReject,
}: {
  user: User
  onApprove: (userId: string) => void
  onReject: (user: User) => void
}) {
  const status = getUserStatus(user)
  const canApprove = status === 'PENDING' || status === 'REJECTED' || status === 'INACTIVE'
  const canReject  = status === 'PENDING' || status === 'ACTIVE'

  if (!canApprove && !canReject) return null

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
        <DropdownMenuSeparator />
        {canApprove && (
          <DropdownMenuItem
            onClick={() => onApprove(user.id)}
            className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </DropdownMenuItem>
        )}
        {canReject && (
          <DropdownMenuItem
            onClick={() => onReject(user)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UsersDataTableClient({
  users: initialUsers,
  totalItems,
  currentPage,
  pageSize,
}: UsersDataTableClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [rejectTarget, setRejectTarget] = useState<User | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const [approveUserMutation, { loading: approving }] = useMutation(APPROVE_USER)
  const [rejectUserMutation, { loading: rejecting }] = useMutation(REJECT_USER)

  // Capture userId in closure — Apollo onCompleted doesn't reliably pass variables back
  const handleApprove = async (userId: string) => {
    try {
      await approveUserMutation({ variables: { userId } })
      setUsers(prev =>
        prev.map(u =>
          u.id === userId
            ? { ...u, isActive: true, approvedAt: new Date().toISOString(), rejectedAt: null }
            : u
        )
      )
      toast.success('User approved')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve user')
    }
  }

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return
    const userId = rejectTarget.id
    const reason = rejectReason || undefined
    try {
      await rejectUserMutation({ variables: { userId, reason } })
      setUsers(prev =>
        prev.map(u =>
          u.id === userId
            ? { ...u, isActive: false, rejectedAt: new Date().toISOString(), rejectionReason: rejectReason }
            : u
        )
      )
      toast.success('User rejected')
      setRejectTarget(null)
      setRejectReason('')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject user')
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original
        const hasName = user.firstName || user.lastName
        const fullName = hasName
          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
          : null
        const initials = hasName
          ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
          : user.email[0]?.toUpperCase() ?? '?'
        const colorClass = avatarColor(fullName ?? user.email)
        return (
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${colorClass}`}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm">
                {fullName ?? <span className="text-muted-foreground italic">No name</span>}
              </div>
              <div className="text-xs text-muted-foreground font-mono truncate">{user.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const user = row.original
        if (!user.roles?.length)
          return <span className="text-xs text-muted-foreground">—</span>
        return (
          <div className="flex flex-wrap gap-1">
            {user.roles.slice(0, 2).map(r => (
              <Badge key={r.id} variant="outline" className="text-xs">
                {r.role.name}
              </Badge>
            ))}
            {user.roles.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{user.roles.length - 2}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const status = getUserStatus(row.original)
        const config = statusConfig[status]
        const Icon = config.icon
        return (
          <Badge variant={config.variant} className="text-xs gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'emailVerified',
      header: 'Verified',
      cell: ({ row }) => {
        const emailVerified = row.original.emailVerified
        return (
          <Badge
            variant="outline"
            className={emailVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200 gap-1' : 'text-muted-foreground gap-1'}
          >
            {emailVerified ? <CheckCircle2 className="h-3 w-3" /> : <MinusCircle className="h-3 w-3" />}
            {emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'tenant',
      header: 'Tenant',
      cell: ({ row }) =>
        row.original.tenant ? (
          <Badge variant="outline" className="text-xs font-mono">
            {row.original.tenant.slug}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    createCreatedAtColumn<User>({ title: 'Joined' }),
    createActionsColumn<User>(({ row }) => (
      <UserActionsMenu
        user={row.original}
        onApprove={handleApprove}
        onReject={user => setRejectTarget(user)}
      />
    )),
  ]

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        manualPagination
        pageCount={Math.ceil(totalItems / pageSize)}
        pagination={{ pageIndex: currentPage - 1, pageSize }}
        showIndexColumn={false}
        toolbarConfig={{
          searchPlaceholder: 'Search users by name or email…',
          enableView: true,
          enableFilter: false,
        }}
      />

      <Dialog
        open={!!rejectTarget}
        onOpenChange={open => {
          if (!open) {
            setRejectTarget(null)
            setRejectReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User</DialogTitle>
            <DialogDescription>
              Reject <strong>{rejectTarget?.email}</strong>? They will not be able to sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason (optional)</Label>
            <Textarea
              id="reject-reason"
              placeholder="e.g., Incomplete application, duplicate account…"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setRejectTarget(null); setRejectReason('') }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={rejecting}
              onClick={handleRejectConfirm}
            >
              {rejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
