'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

function getUserInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'U'

  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''

  return `${firstInitial}${lastInitial}` || 'U'
}

interface User {
  firstName?: string
  lastName?: string
  email?: string
  profileImage?: string
  isActive?: boolean
  tenant?: {
    name: string
  }
}

export function ProfileDropdown() {
  const router = useRouter()
  const [signOutOpen, setSignOutOpen] = useState(false)

  // TODO: Get actual user from auth context or session
  const user: User = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@mongolec.com',
    isActive: true,
  }

  const userInitials = getUserInitials(user?.firstName, user?.lastName)
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Loading...'

  const handleSignOut = async () => {
    // TODO: Implement sign out logic
    router.push('/login')
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.profileImage || '/avatars/default.png'} alt={fullName} />
              <AvatarFallback className="text-xs font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-64' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <div className="flex items-center justify-between">
                <p className='text-sm leading-none font-medium'>{fullName}</p>
                {user?.isActive && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Active
                  </Badge>
                )}
              </div>
              <p className='text-muted-foreground text-xs leading-none'>
                {user?.email || 'No email'}
              </p>
              {user?.tenant && (
                <div className="mt-1 flex items-center gap-1">
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {user.tenant.name}
                  </Badge>
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href='/settings'>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings'>
                Account Settings
                <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings'>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSignOutOpen(true)}>
            Sign out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOutOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
