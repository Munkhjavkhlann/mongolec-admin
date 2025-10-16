'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function MaintenanceError() {
  const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>Under Maintenance!</span>
        <p className='text-muted-foreground text-center'>
          We're currently performing maintenance. <br />
          Please check back in a few minutes.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button onClick={() => router.refresh()}>Refresh Page</Button>
        </div>
      </div>
    </div>
  )
}
