import {
  BookOpen,
  Star,
  Eye,
  FileText,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getStoryStats } from '../lib/stories-api'

export async function StoriesStats() {
  const stats = await getStoryStats()

  const statCards = [
    {
      title: 'Total Stories',
      value: stats.total,
      description: 'All rally stories',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Published',
      value: stats.published,
      description: 'Live on website',
      icon: Eye,
      color: 'text-green-600',
    },
    {
      title: 'Drafts',
      value: stats.draft,
      description: 'Work in progress',
      icon: FileText,
      color: 'text-gray-600',
    },
    {
      title: 'Featured',
      value: stats.featured,
      description: 'Homepage featured',
      icon: Star,
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className='mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {statCards.map((stat) => {
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
