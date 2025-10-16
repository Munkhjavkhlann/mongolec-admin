import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Smartphone, Globe, Download, Star } from 'lucide-react'
import Link from 'next/link'

interface AppsPageProps {
  searchParams: {
    page?: string
    pageSize?: string
    category?: string[]
    status?: string[]
  }
}

function AppsStats() {
  // TODO: Replace with real data from GraphQL
  const stats = [
    {
      title: 'Total Apps',
      value: 0,
      description: 'All applications',
      icon: Smartphone,
      color: 'text-blue-600',
    },
    {
      title: 'Published',
      value: 0,
      description: 'Live apps',
      icon: Globe,
      color: 'text-green-600',
    },
    {
      title: 'Downloads',
      value: 0,
      description: 'Total downloads',
      icon: Download,
      color: 'text-purple-600',
    },
    {
      title: 'Featured',
      value: 0,
      description: 'Featured apps',
      icon: Star,
      color: 'text-yellow-600',
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

export default function AppsPage({ searchParams }: AppsPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            App Management
          </h2>
          <p className='text-muted-foreground'>
            Manage mobile and web applications, releases, and distribution.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild>
            <Link href='/apps/create'>
              <Plus className='mr-2 h-4 w-4' />
              Add Application
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <AppsStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            Manage your mobile and web applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Server-side apps datatable will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}