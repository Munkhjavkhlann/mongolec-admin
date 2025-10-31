export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING' | 'ARCHIVED'
export type TenantPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE'

export interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  isActive: boolean
  status: TenantStatus
  plan: TenantPlan
  createdAt: string
  updatedAt: string
}

export interface CreateTenantInput {
  name: string
  slug: string
  domain?: string
  isActive?: boolean
  status?: TenantStatus
  plan?: TenantPlan
}

export interface UpdateTenantInput {
  name?: string
  slug?: string
  domain?: string
  isActive?: boolean
  status?: TenantStatus
  plan?: TenantPlan
}

export const tenantStatusConfig = {
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
  SUSPENDED: {
    label: 'Suspended',
    color: 'bg-red-500 text-white border-red-500',
    variant: 'destructive' as const,
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-500 text-white border-yellow-500',
    variant: 'outline' as const,
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'bg-gray-300 text-gray-800 border-gray-300',
    variant: 'outline' as const,
  },
} as const

export const tenantPlanConfig = {
  FREE: {
    label: 'Free',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    variant: 'outline' as const,
  },
  BASIC: {
    label: 'Basic',
    color: 'bg-green-100 text-green-800 border-green-200',
    variant: 'outline' as const,
  },
  PRO: {
    label: 'Pro',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    variant: 'outline' as const,
  },
  ENTERPRISE: {
    label: 'Enterprise',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    variant: 'outline' as const,
  },
} as const
