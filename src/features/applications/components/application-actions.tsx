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
import { Check, X, Clock, Loader2 } from 'lucide-react'
import { useMutation } from '@apollo/client/react'
import {
  APPROVE_APPLICATION,
  REJECT_APPLICATION,
  WAITLIST_APPLICATION,
  CONFIRM_APPLICATION,
  UPDATE_APPLICATION_PAYMENT_STATUS,
} from '@/graphql/mutations/applications'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ApplicationActionsProps {
  applicationId: string
  status: string
  onActionComplete?: () => void
}

export function ApproveButton({ applicationId, onActionComplete }: ApplicationActionsProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [approveApplication, { loading }] = useMutation(APPROVE_APPLICATION, {
    refetchQueries: ['GetApplications', 'GetApplication', 'GetApplicationStats'],
  })

  const handleApprove = async () => {
    try {
      await approveApplication({
        variables: {
          id: applicationId,
          notes: notes || undefined,
        },
      })
      toast.success('Application approved successfully')
      setOpen(false)
      setNotes('')
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to approve application:', error)
      toast.error('Failed to approve application')
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
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Add any notes for approving this application
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
              Approve Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function RejectButton({ applicationId, onActionComplete }: ApplicationActionsProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [rejectApplication, { loading }] = useMutation(REJECT_APPLICATION, {
    refetchQueries: ['GetApplications', 'GetApplication', 'GetApplicationStats'],
  })

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      await rejectApplication({
        variables: {
          id: applicationId,
          reason,
        },
      })
      toast.success('Application rejected successfully')
      setOpen(false)
      setReason('')
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to reject application:', error)
      toast.error('Failed to reject application')
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
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this application is being rejected..."
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
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function WaitlistButton({ applicationId, onActionComplete }: ApplicationActionsProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [waitlistApplication, { loading }] = useMutation(WAITLIST_APPLICATION, {
    refetchQueries: ['GetApplications', 'GetApplication', 'GetApplicationStats'],
  })

  const handleWaitlist = async () => {
    try {
      await waitlistApplication({
        variables: {
          id: applicationId,
          notes: notes || undefined,
        },
      })
      toast.success('Application added to waitlist successfully')
      setOpen(false)
      setNotes('')
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to waitlist application:', error)
      toast.error('Failed to waitlist application')
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Clock className="mr-2 h-4 w-4" />
        Waitlist
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waitlist Application</DialogTitle>
            <DialogDescription>
              Add any notes for waitlisting this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this waitlist decision..."
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
            <Button onClick={handleWaitlist} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Waitlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ConfirmButton({ applicationId, onActionComplete }: ApplicationActionsProps) {
  const [confirmApplication, { loading }] = useMutation(CONFIRM_APPLICATION, {
    refetchQueries: ['GetApplications', 'GetApplication', 'GetApplicationStats'],
  })

  const handleConfirm = async () => {
    try {
      await confirmApplication({
        variables: {
          id: applicationId,
        },
      })
      toast.success('Application confirmed successfully')
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to confirm application:', error)
      toast.error('Failed to confirm application')
    }
  }

  return (
    <Button
      size="sm"
      variant="default"
      onClick={handleConfirm}
      disabled={loading}
    >
      <Check className="mr-2 h-4 w-4" />
      Confirm
    </Button>
  )
}

export function UpdatePaymentStatusButton({
  applicationId,
  currentStatus,
  onActionComplete,
}: ApplicationActionsProps & { currentStatus: string }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [updatePaymentStatus, { loading }] = useMutation(UPDATE_APPLICATION_PAYMENT_STATUS, {
    refetchQueries: ['GetApplications', 'GetApplication'],
  })

  const handleUpdate = async () => {
    try {
      await updatePaymentStatus({
        variables: {
          id: applicationId,
          paymentStatus: status,
        },
      })
      toast.success('Payment status updated successfully')
      setOpen(false)
      onActionComplete?.()
    } catch (error) {
      console.error('Failed to update payment status:', error)
      toast.error('Failed to update payment status')
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        Update Payment
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Update the payment status for this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-status">Payment Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="payment-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="DEPOSIT_PAID">Deposit Paid</SelectItem>
                  <SelectItem value="FULLY_PAID">Fully Paid</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading || status === currentStatus}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
