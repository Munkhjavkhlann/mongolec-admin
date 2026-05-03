'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Eye, Mail, MailOpen, CheckCircle2 } from 'lucide-react'
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
import { DataTable, createCreatedAtColumn } from '@/components/data-table'
import type { ContactMessage } from '../types'
import { contactMessageStatusConfig } from '../types'
import { UPDATE_CONTACT_MESSAGE_STATUS } from '@/graphql/mutations/contact'


function avatarColor(name: string) {
  const p = ['bg-rose-100 text-rose-700','bg-orange-100 text-orange-700','bg-amber-100 text-amber-700','bg-lime-100 text-lime-700','bg-teal-100 text-teal-700','bg-sky-100 text-sky-700','bg-violet-100 text-violet-700','bg-pink-100 text-pink-700']
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return p[h % p.length]
}

function getStatusIcon(status: string) {
  if (status === 'NEW') return Mail
  if (status === 'READ') return MailOpen
  return CheckCircle2
}

const statusIcons = {
  NEW: Mail,
  READ: MailOpen,
  REPLIED: CheckCircle2,
}

function ActionsCell({
  message,
  onStatusChange,
}: {
  message: ContactMessage
  onStatusChange: (id: string, status: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/contact/${message.id}`} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View message
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1">
          Mark as
        </DropdownMenuLabel>
        {(Object.entries(contactMessageStatusConfig) as [keyof typeof contactMessageStatusConfig, typeof contactMessageStatusConfig[keyof typeof contactMessageStatusConfig]][]).map(([key, config]) => {
          const Icon = statusIcons[key]
          const isCurrent = message.status === key
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => !isCurrent && onStatusChange(message.id, key)}
              disabled={isCurrent}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {config.label}
              {isCurrent && (
                <CheckCircle2 className="h-3 w-3 ml-auto text-muted-foreground" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function buildColumns(
  onStatusChange: (id: string, status: string) => void
): ColumnDef<ContactMessage>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Sender',
      cell: ({ row }) => {
        const message = row.original
        const colorClass = avatarColor(message.name)
        const initial = message.name[0]?.toUpperCase() ?? '?'
        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${colorClass}`}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{message.name}</div>
              <div className="text-xs text-muted-foreground font-mono truncate">{message.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'subject',
      header: 'Message',
      cell: ({ row }) => {
        const message = row.original
        return (
          <div className="max-w-[200px]">
            <div className="font-medium text-sm truncate">{message.subject}</div>
            <div className="text-xs text-muted-foreground truncate">
              {message.message?.slice(0, 80)}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue<string>()
        const conf = contactMessageStatusConfig[status as keyof typeof contactMessageStatusConfig]
        const Icon = getStatusIcon(status)
        return (
          <Badge variant={conf.variant} className={`${conf.color} gap-1`}>
            <Icon className="h-3 w-3" />
            {conf.label}
          </Badge>
        )
      },
    },
    createCreatedAtColumn<ContactMessage>(),
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell message={row.original} onStatusChange={onStatusChange} />
      ),
    },
  ]
}

interface ContactMessagesTableProps {
  messages: ContactMessage[]
  loading?: boolean
  onActionComplete?: () => void
}

export function ContactMessagesTable({
  messages,
  loading,
  onActionComplete,
}: ContactMessagesTableProps) {
  const [updateStatus] = useMutation(UPDATE_CONTACT_MESSAGE_STATUS, {
    onCompleted: () => {
      toast.success('Status updated successfully')
      onActionComplete?.()
    },
    onError: error => toast.error(error.message),
  })

  const handleStatusChange = (id: string, status: string) => {
    updateStatus({ variables: { id, status } })
  }

  const columns = buildColumns(handleStatusChange)

  return (
    <DataTable
      data={messages}
      columns={columns}
      loading={loading}
      showIndexColumn={false}
      emptyMessage="No messages found."
      toolbarConfig={{ searchPlaceholder: 'Search messages...' }}
    />
  )
}
