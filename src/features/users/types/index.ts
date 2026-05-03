export type UserStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'INACTIVE'

export interface UserRole {
  id: string
  role: {
    id: string
    name: string
  }
  assignedAt: string
}

export interface UserTenant {
  id: string
  name: string
  slug: string
}

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  approvedAt: string | null
  approvedBy: string | null
  rejectedAt: string | null
  rejectedBy: string | null
  rejectionReason: string | null
  tenant: UserTenant | null
  roles: UserRole[]
}

export interface UserPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  currentPage: number
  perPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UsersResponse {
  users: User[]
  pagination: UserPagination
}

export interface UsersPageSearchParams {
  page?: string
  pageSize?: string
  search?: string
  status?: string
}
