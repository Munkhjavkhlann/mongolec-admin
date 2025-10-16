'use client'

import { Check, Layout, LayoutGrid, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LayoutSettings() {
  const { layout, setLayout, fluid, setFluid } = useLayout()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <LayoutGrid className='size-[1.2rem]' />
          <span className='sr-only'>Layout settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className="w-48">
        <DropdownMenuLabel>Layout Style</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setLayout('default')}>
          <Layout className="mr-2 h-4 w-4" />
          Default
          <Check
            size={14}
            className={cn('ms-auto', layout !== 'default' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLayout('fixed')}>
          <Monitor className="mr-2 h-4 w-4" />
          Fixed
          <Check
            size={14}
            className={cn('ms-auto', layout !== 'fixed' && 'hidden')}
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Container</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setFluid(false)}>
          Boxed
          <Check
            size={14}
            className={cn('ms-auto', fluid && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFluid(true)}>
          Fluid
          <Check
            size={14}
            className={cn('ms-auto', !fluid && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
