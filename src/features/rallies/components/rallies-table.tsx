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
import { Edit, Trash2, MoreHorizontal, Trophy, Users, Calendar, ToggleLeft, ToggleRight } from 'lucide-react'
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
import Link from 'next/link'
import Image from 'next/image'
import type { Rally } from '../types'
import { rallyStatusConfig } from '../types'
import { useMutation } from '@apollo/client/react'
import { UPDATE_RALLY_STATUS, TOGGLE_RECRUITING } from '@/graphql/mutations/rallies'
import { toast } from 'sonner'

interface RalliesTableProps {
  rallies: Rally[]
}

export function RalliesTable({ rallies }: RalliesTableProps) {
  const [selectedRallies, setSelectedRallies] = useState<string[]>([])
  const [updateStatus] = useMutation(UPDATE_RALLY_STATUS)
  const [toggleRecruiting] = useMutation(TOGGLE_RECRUITING)

  // Helper to extract string from multilingual field
  const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.en || field.mn || '';
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete rally:', id)
  }

  const toggleRally = (rallyId: string) => {
    setSelectedRallies(prev =>
      prev.includes(rallyId)
        ? prev.filter(id => id !== rallyId)
        : [...prev, rallyId]
    )
  }

  const toggleAll = () => {
    setSelectedRallies(prev =>
      prev.length === rallies.length ? [] : rallies.map(r => r.id)
    )
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({
        variables: { id, status },
        refetchQueries: ['GetRallies'],
      })
      toast.success('Rally status updated successfully')
    } catch (error) {
      console.error('Failed to update rally status:', error)
      toast.error('Failed to update rally status')
    }
  }

  const handleToggleRecruiting = async (id: string) => {
    try {
      await toggleRecruiting({
        variables: { id },
        refetchQueries: ['GetRallies'],
      })
      toast.success('Recruiting status toggled successfully')
    } catch (error) {
      console.error('Failed to toggle recruiting:', error)
      toast.error('Failed to toggle recruiting')
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRallies.length === rallies.length && rallies.length > 0}
                onCheckedChange={toggleAll}
                aria-label="Select all rallies"
              />
            </TableHead>
            <TableHead>Rally</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Recruiting</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rallies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No rallies found.
              </TableCell>
            </TableRow>
          ) : (
            rallies.map((rally) => {
              const statusKey = rally.status as keyof typeof rallyStatusConfig
              const statusConf = rallyStatusConfig[statusKey]
              const participantCount = rally.currentParticipants || 0
              const maxParticipants = rally.maxParticipants
              const isFull = maxParticipants && participantCount >= maxParticipants

              return (
                <TableRow key={rally.id}>
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedRallies.includes(rally.id)}
                      onCheckedChange={() => toggleRally(rally.id)}
                      aria-label={`Select ${getDisplayName(rally.title) || 'rally'}`}
                    />
                  </TableCell>

                  {/* Rally Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {rally.heroImage ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={rally.heroImage}
                            alt={getDisplayName(rally.title) || 'Rally'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted border">
                          <Trophy className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {getDisplayName(rally.title) || <span className="text-muted-foreground italic">Untitled Rally</span>}
                        </div>
                        {rally.slug && (
                          <div className="text-xs text-muted-foreground">
                            {rally.slug}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Dates */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatDate(rally.startDate)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      to {formatDate(rally.endDate)}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Select
                      value={rally.status}
                      onValueChange={(value) => handleStatusChange(rally.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
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
                  </TableCell>

                  {/* Participants */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`font-medium ${isFull ? 'text-destructive' : ''}`}>
                        {participantCount}
                      </div>
                      {maxParticipants && (
                        <>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-muted-foreground">{maxParticipants}</span>
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        </>
                      )}
                      {!maxParticipants && (
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    {isFull && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Full
                      </Badge>
                    )}
                  </TableCell>

                  {/* Recruiting Toggle */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleRecruiting(rally.id)}
                      className="h-8"
                    >
                      {rally.isRecruiting ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-green-500">Open</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">Closed</span>
                        </>
                      )}
                    </Button>
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
                        <DropdownMenuItem
                          onClick={() => handleDelete(rally.id)}
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
