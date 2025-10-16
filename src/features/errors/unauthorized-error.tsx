'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function UnauthorizedError() {
  const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>Unauthorized Access!</span>
        <p className='text-muted-foreground text-center'>
          You need to be authenticated to access this resource. <br />
          Please sign in to continue.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
        </div>
      </div>
    </div>
  )
}
