import { cookies } from 'next/headers'

const GRAPHQL_URL = process.env.GRAPHQL_SERVER_URL || process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://127.0.0.1:4000/graphql'

interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
  tenantId?: string
}

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string; locations?: unknown; path?: unknown }>
}

export async function serverGraphQL<T>(
  { query, variables, tenantId }: GraphQLRequest
): Promise<T> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { Cookie: cookieHeader }),
      ...(tenantId && { 'X-Tenant-ID': tenantId }),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`)
  }

  const result = (await response.json()) as GraphQLResponse<T>

  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join('; '))
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL')
  }

  return result.data
}
