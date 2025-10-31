export interface MerchProduct {
  id: string
  name: string | { en: string; mn: string }
  slug: string
  sku: string
  description?: string | { en: string; mn: string }
  shortDescription?: string | { en: string; mn: string }
  price: number
  compareAtPrice?: number
  currency: string
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED'
  category?: MerchCategory
  featuredImage?: string
  images?: string[]
  inventory: number
  trackInventory: boolean
  minStock?: number
  isFeatured: boolean
  hasVariants?: boolean
  options?: any[]
  variants?: MerchVariant[]
  createdAt: string
  updatedAt: string
}

export interface MerchVariant {
  id: string
  sku: string
  title?: string
  price: number
  compareAtPrice?: number
  inventory: number
  image?: string
  isAvailable: boolean
  optionValues?: any[]
}

export interface MerchCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  parentId?: string
  productCount: number
  createdAt: string
  updatedAt: string
}

export const merchStatusConfig = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-200 text-gray-800 border-gray-300',
    variant: 'outline' as const,
  },
  ACTIVE: {
    label: 'Active',
    color: 'bg-green-500 text-white border-green-500',
    variant: 'default' as const,
  },
  INACTIVE: {
    label: 'Inactive',
    color: 'bg-gray-500 text-white border-gray-500',
    variant: 'secondary' as const,
  },
  OUT_OF_STOCK: {
    label: 'Out of Stock',
    color: 'bg-red-500 text-white border-red-500',
    variant: 'destructive' as const,
  },
  DISCONTINUED: {
    label: 'Discontinued',
    color: 'bg-red-200 text-red-800 border-red-300',
    variant: 'destructive' as const,
  },
} as const
