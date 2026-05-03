import { serverGraphQL } from '@/lib/server-graphql'
import type { UsersResponse, UserStatus } from '../types'

const USERS_QUERY = `
  query GetUsers($page: Int, $limit: Int, $search: String, $status: UserStatus, $orderBy: String, $orderDirection: String) {
    getUsers(page: $page, limit: $limit, search: $search, status: $status, orderBy: $orderBy, orderDirection: $orderDirection) {
      users {
        id
        email
        firstName
        lastName
        isActive
        emailVerified
        createdAt
        updatedAt
        approvedAt
        approvedBy
        rejectedAt
        rejectedBy
        rejectionReason
        tenant { id name slug }
        roles { id role { id name } assignedAt }
      }
      pagination {
        page limit total totalPages currentPage perPage hasNextPage hasPreviousPage
      }
    }
  }
`

interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  status?: UserStatus
  orderBy?: string
  orderDirection?: string
}

const EMPTY_RESPONSE: UsersResponse = {
  users: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0, currentPage: 1, perPage: 20, hasNextPage: false, hasPreviousPage: false },
}

export async function getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
  try {
    const data = await serverGraphQL<{ getUsers: UsersResponse }>({
      query: USERS_QUERY,
      variables: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        search: params.search || undefined,
        status: params.status || undefined,
        orderBy: params.orderBy || 'createdAt',
        orderDirection: params.orderDirection || 'desc',
      },
    })
    return data.getUsers
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication required')) {
      throw error
    }
    console.error('[getUsers]', error)
    return EMPTY_RESPONSE
  }
}

const USER_APPROVAL_STATS_QUERY = `
  query GetUserApprovalStats {
    getUserApprovalStats {
      totalUsers
      activeUsers
      pendingUsers
      rejectedUsers
      inactiveUsers
    }
  }
`

export async function getUserStats() {
  try {
    const data = await serverGraphQL<{
      getUserApprovalStats: {
        totalUsers: number
        activeUsers: number
        pendingUsers: number
        rejectedUsers: number
        inactiveUsers: number
      }
    }>({ query: USER_APPROVAL_STATS_QUERY })
    const s = data.getUserApprovalStats
    return {
      total: s.totalUsers,
      active: s.activeUsers,
      pending: s.pendingUsers,
      inactive: s.inactiveUsers,
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication required')) {
      throw error
    }
    console.error('[getUserStats]', error)
    return { total: 0, active: 0, pending: 0, inactive: 0 }
  }
}
