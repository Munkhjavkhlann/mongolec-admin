import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function StoriesHeader() {
  return (
    <div className='mb-6 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          Stories Management
        </h2>
        <p className='text-muted-foreground'>
          Create and manage rally impact stories, rider profiles, and field moments.
        </p>
      </div>
      <div className='flex gap-2'>
        <Button asChild>
          <Link href='/stories/create'>
            <Plus className='mr-2 h-4 w-4' />
            Create Story
          </Link>
        </Button>
      </div>
    </div>
  )
}
