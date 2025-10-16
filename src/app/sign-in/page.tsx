import { Suspense } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '@/features/auth/auth-layout'
import { UserAuthForm } from '@/features/auth/components/user-auth-form-new'
import Link from 'next/link'

interface SignInPageProps {
  searchParams: {
    redirect?: string
  }
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect } = searchParams

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to log into <br /> your account.
            Don&apos;t have an account?{' '}
            <Link
              href='/sign-up'
              className='hover:text-primary underline underline-offset-4'
            >
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <UserAuthForm redirectTo={redirect} />
          </Suspense>
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking sign in, you agree to our{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}