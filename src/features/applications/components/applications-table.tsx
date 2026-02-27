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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileText,
  User,
  MoreHorizontal,
  Bike,
  Heart,
  Calendar,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import type { Application } from '../types'
import { applicationStatusConfig, paymentStatusConfig } from '../types'
import {
  ApproveButton,
  RejectButton,
  WaitlistButton,
  ConfirmButton,
  UpdatePaymentStatusButton,
} from './application-actions'

interface ApplicationsTableProps {
  applications: Application[]
  loading?: boolean
  onActionComplete?: () => void
}

export function ApplicationsTable({ applications, loading, onActionComplete }: ApplicationsTableProps) {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])

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
          <span className="ml-2 text-muted-foreground">Loading applications...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Rally</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => {
              const statusKey = application.status as keyof typeof applicationStatusConfig
              const statusConf = applicationStatusConfig[statusKey]
              const paymentKey = application.paymentStatus as keyof typeof paymentStatusConfig
              const paymentConf = paymentStatusConfig[paymentKey]

              return (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">
                          {application.firstName} {application.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {application.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[200px]">
                      <div className="font-medium truncate">
                        {getDisplayName(application.rally?.title)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(application.rally?.startDate || '')}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      {application.isRider ? (
                        <>
                          <Bike className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Rider</span>
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 text-pink-500" />
                          <span className="text-sm">Supporter</span>
                        </>
                      )}
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
                    <Badge
                      variant={paymentConf.variant}
                      className={paymentConf.color}
                    >
                      {paymentConf.label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {formatDate(application.createdAt)}
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
                          <Link href={`/applications/${application.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {application.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center w-full">
                                                                <ApproveButton
                                  applicationId={application.id}
                                  status={application.status}
                                  onActionComplete={onActionComplete}
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center w-full">
                                <RejectButton
                                  applicationId={application.id}
                                  status={application.status}
                                  onActionComplete={onActionComplete}
                                />
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <div className="flex items-center w-full">
                                <WaitlistButton
                                  applicationId={application.id}
                                  status={application.status}
                                  onActionComplete={onActionComplete}
                                />
                              </div>
                            </DropdownMenuItem>
                          </>
                        )}
                        {application.status === 'APPROVED' && (
                          <DropdownMenuItem asChild>
                            <div className="flex items-center w-full">
                              <ConfirmButton
                                applicationId={application.id}
                                status={application.status}
                                onActionComplete={onActionComplete}
                              />
                            </div>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <div className="flex items-center w-full">
                            <UpdatePaymentStatusButton
                              applicationId={application.id}
                              status={application.status}
                              currentStatus={application.paymentStatus}
                              onActionComplete={onActionComplete}
                            />
                          </div>
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
