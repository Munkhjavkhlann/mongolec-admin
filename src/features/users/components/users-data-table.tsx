import { getUsers } from '../lib/users-api'
import { UsersDataTableClient } from './users-data-table-client'
import type { UsersPageSearchParams } from '../types'

interface UsersDataTableProps {
  searchParams: Promise<UsersPageSearchParams>
}

export async function UsersDataTable({ searchParams }: UsersDataTableProps) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1', 10)
  const pageSize = parseInt(params.pageSize ?? '20', 10)

  const data = await getUsers({
    page,
    limit: pageSize,
    search: params.search,
    status: params.status as 'ACTIVE' | 'PENDING' | 'REJECTED' | 'INACTIVE' | undefined,
  })

  return (
    <UsersDataTableClient
      users={data.users}
      totalItems={data.pagination.total}
      currentPage={page}
      pageSize={pageSize}
    />
  )
}
