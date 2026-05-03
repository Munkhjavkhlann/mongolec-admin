import { Suspense } from 'react'
import { UsersStats, UsersDataTable } from '@/features/users'
import type { UsersPageSearchParams } from '@/features/users'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface UsersPageProps {
  searchParams: Promise<UsersPageSearchParams>
}

function StatsSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className='p-6'>
            <Skeleton className='h-4 w-20 mb-2' />
            <Skeleton className='h-8 w-12' />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className='rounded-md border'>
      <div className='p-4 border-b'>
        <Skeleton className='h-8 w-64' />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='flex items-center gap-4 px-4 py-3 border-b last:border-0'>
          <Skeleton className='h-5 w-2/5' />
          <Skeleton className='h-5 w-16' />
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-24' />
        </div>
      ))}
    </div>
  )
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button asChild size='sm'>
          <Link href='/users/invite'>
            <Plus className='mr-1.5 h-4 w-4' />
            Invite User
          </Link>
        </Button>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <UsersStats />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <UsersDataTable searchParams={Promise.resolve(params)} />
      </Suspense>
    </div>
  )
}
