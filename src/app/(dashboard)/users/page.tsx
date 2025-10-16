import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Shield, Users as UsersIcon, UserCheck, UserX } from 'lucide-react'
import Link from 'next/link'

interface UsersPageProps {
  searchParams: {
    page?: string
    pageSize?: string
    status?: string[]
    role?: string[]
    username?: string
  }
}

function UsersStats() {
  // TODO: Replace with real data from GraphQL
  const stats = [
    {
      title: 'Total Users',
      value: 0,
      description: 'All registered users',
      icon: UsersIcon,
      color: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: 0,
      description: 'Currently active',
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      title: 'Inactive Users',
      value: 0,
      description: 'Inactive accounts',
      icon: UserX,
      color: 'text-red-600',
    },
    {
      title: 'Administrators',
      value: 0,
      description: 'Admin access',
      icon: Shield,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className='mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-muted-foreground text-xs'>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            User Management
          </h2>
          <p className='text-muted-foreground'>
            Manage user accounts, roles, and permissions across your organization.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild>
            <Link href='/users/invite'>
              <Plus className='mr-2 h-4 w-4' />
              Invite User
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <UsersStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Server-side users datatable will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}