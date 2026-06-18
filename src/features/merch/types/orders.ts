export type MerchOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

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
  createdAt: string
  updatedAt: string
}

export const orderStatusConfig: Record<
  MerchOrderStatus,
  { label: string; color: string }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
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
}

export const ORDER_STATUS_OPTIONS: MerchOrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]
