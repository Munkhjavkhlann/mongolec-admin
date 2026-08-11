'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DetailField } from '@/components/admin'
import { UPDATE_MERCH_ORDER_STATUS } from '@/graphql/mutations/merch-orders'
import {
  type MerchOrder,
  orderStatusConfig,
  ORDER_STATUS_OPTIONS,
  type MerchOrderStatus,
  paidPayment,
} from '../types/orders'

interface MerchOrderDetailDialogProps {
  order: MerchOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MerchOrderDetailDialog({
  order,
  open,
  onOpenChange,
}: MerchOrderDetailDialogProps) {
  const [updateStatus, { loading: isUpdating }] = useMutation(
    UPDATE_MERCH_ORDER_STATUS,
    {
      onCompleted: () => toast.success('Order status updated'),
      onError: (err) => toast.error(err.message || 'Failed to update status'),
      refetchQueries: ['GetMerchOrders'],
    }
  )

  const [localStatus, setLocalStatus] = useState<MerchOrderStatus | null>(null)

  const handleStatusChange = (newStatus: string) => {
    if (!order) return
    const status = newStatus as MerchOrderStatus
    setLocalStatus(status)
    updateStatus({ variables: { id: order.id, status } })
  }

  if (!order) return null

  const currentStatus = localStatus ?? order.status
  const statusConf = orderStatusConfig[currentStatus]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order #{order.orderNumber}
            <Badge variant="outline" className={statusConf.color}>
              {statusConf.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* QPay payment details */}
          {(() => {
            const pay = paidPayment(order)
            if (!pay) return null
            const fmt = (n?: number | null) =>
              `${(n ?? 0).toLocaleString()} ${pay.currency || order.currency}`
            const rows: Array<[string, React.ReactNode]> = [
              ['Paid amount', fmt(pay.paidAmount ?? pay.amount)],
              ['QPay fee', fmt(pay.fee)],
              ['Bank / wallet', pay.paymentWallet || '—'],
              ['Type', pay.paymentType || '—'],
              ['Paid at', pay.paidAt ? new Date(pay.paidAt).toLocaleString() : '—'],
              [
                'QPay payment id',
                <span key="pid" className="font-mono">
                  {pay.qpayPaymentId || '—'}
                </span>,
              ],
            ]
            if (pay.ebarimtCustomerNo) rows.push(['E-barimt no.', pay.ebarimtCustomerNo])
            return (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-emerald-800">✓ Paid via QPay</p>
                  {pay.settlementStatus && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-100 text-emerald-700 border-emerald-300 text-xs"
                    >
                      {pay.settlementStatus}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-2 border-b border-emerald-200/70 pb-2">
                  <span className="text-xs text-emerald-700">Net received</span>
                  <span className="text-lg font-bold text-emerald-800">{fmt(pay.netAmount)}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  {rows.map(([label, value]) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-emerald-700/70">{label}</span>
                      <span className="text-emerald-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Status update */}
          <div className="space-y-2">
            <Label>Update Status</Label>
            <div className="flex items-center gap-2">
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {orderStatusConfig[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>

          <Separator />

          {/* Contact info */}
          <div>
            <p className="text-sm font-semibold mb-3">Customer Information</p>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Name" value={order.customerName} />
              <DetailField label="Phone" value={order.phone} />
              <DetailField label="Email" value={order.email} />
              <DetailField label="Payment Method" value={order.paymentMethod} />
              <DetailField
                label="Delivery Method"
                value={
                  order.deliveryMethod === 'PICKUP'
                    ? 'Оффисоос авна / Pickup'
                    : 'Хүргэлт / Delivery'
                }
              />
            </div>
          </div>

          {order.address && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-3">Delivery Address</p>
                <p className="text-sm text-foreground">{order.address}</p>
              </div>
            </>
          )}

          {order.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Line items */}
          <div>
            <p className="text-sm font-semibold mb-3">Items</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.variantName && (
                      <p className="text-xs text-muted-foreground">{item.variantName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-sm">
                    <span className="text-muted-foreground">×{item.quantity}</span>
                    <span className="font-medium tabular-nums">
                      {order.currency} {(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{order.currency} {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{order.currency} {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
