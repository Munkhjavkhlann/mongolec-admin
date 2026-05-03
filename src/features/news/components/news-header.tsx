import { Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function NewsHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>News</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Manage articles, categories, and publications
        </p>
      </div>
      <div className='flex gap-2'>
        <Button variant='outline' asChild size='sm'>
          <Link href='/news/categories'>
            <Settings className='mr-1.5 h-4 w-4' />
            Categories
          </Link>
        </Button>
        <Button asChild size='sm'>
          <Link href='/news/create'>
            <Plus className='mr-1.5 h-4 w-4' />
            New Article
          </Link>
        </Button>
      </div>
    </div>
  )
}
