'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        <span className='font-medium'>Oops! Something went wrong!</span>
        <p className='text-muted-foreground text-center'>
          We apologize for the inconvenience. <br />
          Please try again or contact support if the problem persists.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => reset()}>Try Again</Button>
        </div>
      </div>
    </div>
  )
}
