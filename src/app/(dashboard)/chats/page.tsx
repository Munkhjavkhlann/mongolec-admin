import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Users, Clock, Archive } from 'lucide-react'

interface ChatsPageProps {
  searchParams: {
    page?: string
    pageSize?: string
    status?: string[]
    type?: string[]
  }
}

function ChatsStats() {
  // TODO: Replace with real data from GraphQL
  const stats = [
    {
      title: 'Total Conversations',
      value: 0,
      description: 'All chat threads',
      icon: MessageCircle,
      color: 'text-blue-600',
    },
    {
      title: 'Active Chats',
      value: 0,
      description: 'Ongoing conversations',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Pending',
      value: 0,
      description: 'Awaiting response',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Archived',
      value: 0,
      description: 'Closed chats',
      icon: Archive,
      color: 'text-gray-600',
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

export default function ChatsPage({ searchParams }: ChatsPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Chat Management
          </h2>
          <p className='text-muted-foreground'>
            Monitor and manage customer conversations and support tickets.
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <ChatsStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>
            Manage customer conversations and support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Server-side chats datatable will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}