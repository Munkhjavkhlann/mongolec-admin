import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div className="text-sm font-medium text-foreground">{title}</div>
      {description && (
        <div className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
