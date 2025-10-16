'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function ForbiddenError() {
  const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>Access Forbidden!</span>
        <p className='text-muted-foreground text-center'>
          You don't have permission to access this resource. <br />
          Please contact your administrator if you believe this is an error.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
