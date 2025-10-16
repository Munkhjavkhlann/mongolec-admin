import {
  Plus,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function NewsHeader() {
  return (
    <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          News Management
        </h2>
        <p className='text-muted-foreground'>
          Create, manage, and publish news articles across multiple
          languages.
        </p>
      </div>
      <div className='flex gap-2'>
        <Button asChild>
          <Link href='/news/create'>
            <Plus className='mr-2 h-4 w-4' />
            Create Article
          </Link>
        </Button>
        <Button variant='outline' asChild>
          <Link href='/news/categories'>
            <Settings className='mr-2 h-4 w-4' />
            Manage Categories
          </Link>
        </Button>
      </div>
    </div>
  )
}