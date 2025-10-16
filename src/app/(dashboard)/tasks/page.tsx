import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

interface TasksPageProps {
  searchParams: {
    page?: string
    pageSize?: string
    status?: string[]
    priority?: string[]
    assignee?: string
  }
}

function TasksStats() {
  // TODO: Replace with real data from GraphQL
  const stats = [
    {
      title: 'Total Tasks',
      value: 0,
      description: 'All tasks',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: 0,
      description: 'Finished tasks',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'In Progress',
      value: 0,
      description: 'Active tasks',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'High Priority',
      value: 0,
      description: 'Urgent tasks',
      icon: AlertCircle,
      color: 'text-red-600',
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

export default function TasksPage({ searchParams }: TasksPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Task Management
          </h2>
          <p className='text-muted-foreground'>
            Organize and track tasks, projects, and team productivity.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild>
            <Link href='/tasks/create'>
              <Plus className='mr-2 h-4 w-4' />
              Create Task
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <TasksStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Track and manage tasks and projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Server-side tasks datatable will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}