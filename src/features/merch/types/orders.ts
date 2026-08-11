export type MerchOrderStatus =
  | 'AWAITING_PAYMENT'
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXPIRED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'

export interface MerchOrderItem {
  id: string
  productId: string
  name: string
  image?: string
  variantId?: string
  variantName?: string
  unitPrice: number
  quantity: number
}

export interface MerchPayment {
  id: string
  provider: string
  status: PaymentStatus
  amount: number
  paidAmount?: number | null
  fee?: number | null
  netAmount?: number | null
  paymentWallet?: string | null
  paymentType?: string | null
  settlementStatus?: string | null
  ebarimtCustomerNo?: string | null
  currency: string
  qpayInvoiceId?: string | null
  qpayPaymentId?: string | null
  paidAt?: string | null
  createdAt: string
}

export interface MerchOrder {
  id: string
  orderNumber: string
  userId?: string
  customerName: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  status: MerchOrderStatus
  paymentMethod?: string
  subtotal: number
  total: number
  currency: string
  tenantId?: string
  items: MerchOrderItem[]
  payments?: MerchPayment[]
  deliveryMethod: string
  paymentClaimedAt?: string | null
  createdAt: string
  updatedAt: string
}

export const orderStatusConfig: Record<
  MerchOrderStatus,
  { label: string; color: string }
> = {
  AWAITING_PAYMENT: {
    label: 'Awaiting payment',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  PAID: {
    label: 'Paid',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
  },
}

export const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  PAID: { label: 'Paid', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FAILED: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200' },
  EXPIRED: { label: 'Expired', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
}

/** The paid QPay payment for an order, if any. */
export function paidPayment(order: MerchOrder): MerchPayment | undefined {
  return order.payments?.find((p) => p.status === 'PAID')
}

export const ORDER_STATUS_OPTIONS: MerchOrderStatus[] = [
  'AWAITING_PAYMENT',
  'PAID',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'EXPIRED',
]
