import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BulkActionProps extends React.ComponentProps<'button'> {
  icon: React.ReactNode
  tooltip?: string
  shortcut?: string
  isPending?: boolean
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
}

export function BulkAction({
  icon,
  tooltip,
  shortcut,
  isPending,
  disabled,
  className,
  ...props
}: BulkActionProps) {
  const content = (
    <Button
      {...props}
      disabled={disabled || isPending}
      className={cn('h-9 w-9 p-0', className)}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    </Button>
  )

  if (!tooltip) {
    return content
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top" className="flex items-center gap-2">
          <span>{tooltip}</span>
          {shortcut && <kbd className="text-xs">{shortcut}</kbd>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export interface BulkActionIconProps
  extends Omit<BulkActionProps, 'icon'> {
  children: React.ReactNode
}

export function BulkActionIcon({
  children,
  ...props
}: BulkActionIconProps) {
  return <BulkAction {...props} icon={children} />
}
