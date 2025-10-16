import { useAuth } from '@/context/auth-provider'

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
      </div>
    )
  }

  // If we reach here, user is authenticated (or redirected by AuthProvider)
  return <>{children}</>
}