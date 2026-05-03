'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Loader2 } from 'lucide-react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  APPROVE_NOMINATION,
  REJECT_NOMINATION,
  SELECT_NOMINATION,
} from '@/graphql/mutations/nominations'
import { GET_RALLIES } from '@/graphql/queries/rallies'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Approve ───────────────────────────────────────────────────────────────

interface ApproveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nominationId: string
  onActionComplete?: () => void
}

export function ApproveDialog({ open, onOpenChange, nominationId, onActionComplete }: ApproveDialogProps) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [approveNomination, { loading }] = useMutation(APPROVE_NOMINATION, {
    refetchQueries: ['GetNominations', 'GetNomination', 'GetNominationStats'],
  })

  const handleApprove = async () => {
    try {
      await approveNomination({ variables: { id: nominationId, notes: notes || undefined } })
      toast.success('Nomination approved')
      router.refresh()
      onOpenChange(false)
      setNotes('')
      onActionComplete?.()
    } catch {
      toast.error('Failed to approve nomination')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Nomination</DialogTitle>
          <DialogDescription>Optionally add notes for this approval.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="approve-notes">Notes (optional)</Label>
          <Textarea
            id="approve-notes"
            placeholder="Add notes about this approval..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleApprove} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Reject ────────────────────────────────────────────────────────────────

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nominationId: string
  onActionComplete?: () => void
}

export function RejectDialog({ open, onOpenChange, nominationId, onActionComplete }: RejectDialogProps) {
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [rejectNomination, { loading }] = useMutation(REJECT_NOMINATION, {
    refetchQueries: ['GetNominations', 'GetNomination', 'GetNominationStats'],
  })

  const handleReject = async () => {
    if (!reason.trim()) { toast.error('Please provide a reason'); return }
    try {
      await rejectNomination({ variables: { id: nominationId, reason } })
      toast.success('Nomination rejected')
      router.refresh()
      onOpenChange(false)
      setReason('')
      onActionComplete?.()
    } catch {
      toast.error('Failed to reject nomination')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Nomination</DialogTitle>
          <DialogDescription>Provide a reason for rejecting this nomination.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="reject-reason">Reason *</Label>
          <Textarea
            id="reject-reason"
            placeholder="Explain why this nomination is being rejected..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleReject} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Select for Rally ──────────────────────────────────────────────────────

type LocalizedField = string | { en?: string; mn?: string } | null | undefined

function getDisplayName(field: LocalizedField): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field.en || field.mn || ''
}

interface SelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nominationId: string
  onActionComplete?: () => void
}

export function SelectDialog({ open, onOpenChange, nominationId, onActionComplete }: SelectDialogProps) {
  const router = useRouter()
  const [rallyId, setRallyId] = useState('')
  const [selectNomination, { loading }] = useMutation(SELECT_NOMINATION, {
    refetchQueries: ['GetNominations', 'GetNomination', 'GetNominationStats'],
  })

  type RalliesData = { getRallies: { rallies: Array<{ id: string; title: LocalizedField }> } }
  const { data: ralliesData, loading: ralliesLoading } = useQuery<RalliesData>(GET_RALLIES, {
    skip: !open,
    variables: { limit: 100 },
  })

  const rallies = ralliesData?.getRallies?.rallies ?? []

  const handleSelect = async () => {
    if (!rallyId) { toast.error('Please select a rally'); return }
    try {
      await selectNomination({ variables: { id: nominationId, rallyId } })
      toast.success('Nomination selected for rally')
      router.refresh()
      onOpenChange(false)
      setRallyId('')
      onActionComplete?.()
    } catch {
      toast.error('Failed to select nomination for rally')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select for Rally</DialogTitle>
          <DialogDescription>Choose which rally to assign this nomination to.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="rally-select">Rally *</Label>
          <Select value={rallyId} onValueChange={setRallyId} disabled={ralliesLoading}>
            <SelectTrigger id="rally-select">
              <SelectValue placeholder={ralliesLoading ? 'Loading rallies...' : 'Select a rally'} />
            </SelectTrigger>
            <SelectContent>
              {rallies.map((rally) => (
                <SelectItem key={rally.id} value={rally.id}>
                  {getDisplayName(rally.title)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSelect} disabled={loading || !rallyId}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Select for Rally
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Legacy compat exports (for detail page usage) ─────────────────────────

interface LegacyProps {
  nominationId: string
  status: string
  onActionComplete?: () => void
}

export function ApproveButton({ nominationId, onActionComplete }: LegacyProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Approve</Button>
      <ApproveDialog open={open} onOpenChange={setOpen} nominationId={nominationId} onActionComplete={onActionComplete} />
    </>
  )
}

export function RejectButton({ nominationId, onActionComplete }: LegacyProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>Reject</Button>
      <RejectDialog open={open} onOpenChange={setOpen} nominationId={nominationId} onActionComplete={onActionComplete} />
    </>
  )
}

export function SelectButton({ nominationId, onActionComplete }: LegacyProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Select for Rally</Button>
      <SelectDialog open={open} onOpenChange={setOpen} nominationId={nominationId} onActionComplete={onActionComplete} />
    </>
  )
}
