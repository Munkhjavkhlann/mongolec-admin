'use client'

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MapPin,
  Building,
  MoreHorizontal,
  Calendar,
  Loader2,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import type { Nomination } from '../types'
import { nominationStatusConfig } from '../types'
import {
  ApproveButton,
  RejectButton,
  SelectButton,
} from './nomination-actions'

interface NominationsTableProps {
  nominations: Nomination[]
  loading?: boolean
  onActionComplete?: () => void
}

export function NominationsTable({
  nominations,
  loading,
  onActionComplete
}: NominationsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field.en || field.mn || ''
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading nominations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Park Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Partner Org</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nominations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No nominations found.
              </TableCell>
            </TableRow>
          ) : (
            nominations.map((nomination) => {
              const statusKey = nomination.status as keyof typeof nominationStatusConfig
              const statusConf = nominationStatusConfig[statusKey]

              return (
                <TableRow key={nomination.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {getDisplayName(nomination.parkNames)}
                        </div>
                        {nomination.parkWebsites && (
                          <div className="text-xs text-muted-foreground truncate">
                            {getDisplayName(nomination.parkWebsites)}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">{nomination.country}</div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">
                        {nomination.partnerOrganizationName || 'N/A'}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={statusConf.variant}
                      className={statusConf.color}
                    >
                      {statusConf.label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDate(nomination.createdAt)}</span>
                    </div>
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
                          <Link href={`/nominations/${nomination.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(nomination.status === 'PENDING' || nomination.status === 'UNDER_REVIEW') && (
                          <>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center w-full">
                                <ApproveButton
                                  nominationId={nomination.id}
                                  status={nomination.status}
                                  onActionComplete={onActionComplete}
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center w-full">
                                <RejectButton
                                  nominationId={nomination.id}
                                  status={nomination.status}
                                  onActionComplete={onActionComplete}
                                />
                              </div>
                            </DropdownMenuItem>
                          </>
                        )}
                        {nomination.status === 'APPROVED' && (
                          <DropdownMenuItem asChild>
                            <div className="flex items-center w-full">
                              <SelectButton
                                nominationId={nomination.id}
                                status={nomination.status}
                                onActionComplete={onActionComplete}
                              />
                            </div>
                          </DropdownMenuItem>
                        )}
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
