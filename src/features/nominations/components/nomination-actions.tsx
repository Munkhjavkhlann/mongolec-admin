'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Check, X, Trophy, Loader2 } from 'lucide-react'
import { useMutation } from '@apollo/client/react'
import {
  APPROVE_NOMINATION,
  REJECT_NOMINATION,
  SELECT_NOMINATION,
} from '@/graphql/mutations/nominations'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GET_RALLIES } from '@/graphql/queries/rallies'

interface NominationActionsProps {
  nominationId: string
  status: string
  onActionComplete?: () => void
}

export function ApproveButton({ nominationId, onActionComplete }: NominationActionsProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [approveNomination, { loading }] = useMutation(APPROVE_NOMINATION, {
    refetchQueries: ['GetNominations', 'GetNomination', 'GetNominationStats'],
  })

  const handleApprove = async () => {
    try {
      await approveNomination({
        variables: {
          id: nominationId,
          notes: notes || undefined,
        },
      })
      toast.success('Nomination approved successfully')
      setOpen(false)
      setNotes('')
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to approve nomination:', error)
      toast.error('Failed to approve nomination')
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="default"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Check className="mr-2 h-4 w-4" />
        Approve
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Nomination</DialogTitle>
            <DialogDescription>
              Add any notes for approving this nomination
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this approval..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve Nomination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function RejectButton({ nominationId, onActionComplete }: NominationActionsProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [rejectNomination, { loading }] = useMutation(REJECT_NOMINATION, {
    refetchQueries: ['GetNominations', 'GetNomination', 'GetNominationStats'],
  })

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      await rejectNomination({
        variables: {
          id: nominationId,
          reason,
        },
      })
      toast.success('Nomination rejected successfully')
      setOpen(false)
      setReason('')
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to reject nomination:', error)
      toast.error('Failed to reject nomination')
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <X className="mr-2 h-4 w-4" />
        Reject
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Nomination</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this nomination
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this nomination is being rejected..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Nomination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function SelectButton({ nominationId, onActionComplete }: NominationActionsProps) {
  const [open, setOpen] = useState(false)
  const [rallyId, setRallyId] = useState('')
  const [selectNomination, { loading }] = useMutation(SELECT_NOMINATION, {
    refetchQueries: ['GetNominations', 'GetNomination', 'GetNominationStats'],
  })

  const handleSelect = async () => {
    if (!rallyId) {
      toast.error('Please select a rally')
      return
    }

    try {
      await selectNomination({
        variables: {
          id: nominationId,
          rallyId,
        },
      })
      toast.success('Nomination selected for rally successfully')
      setOpen(false)
      setRallyId('')
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to select nomination:', error)
      toast.error('Failed to select nomination for rally')
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="default"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Trophy className="mr-2 h-4 w-4" />
        Select for Rally
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Nomination for Rally</DialogTitle>
            <DialogDescription>
              Choose which rally to select this park nomination for
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rally">Rally *</Label>
              <Select value={rallyId} onValueChange={setRallyId}>
                <SelectTrigger id="rally">
                  <SelectValue placeholder="Select a rally" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rally-1">Mongolia Rally 2025</SelectItem>
                  <SelectItem value="rally-2">Mongolia Rally 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={loading || !rallyId}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Select for Rally
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
