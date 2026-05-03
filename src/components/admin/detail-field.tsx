import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DetailFieldProps {
  label: string
  value?: ReactNode
  icon?: React.ElementType
  className?: string
  empty?: string
}

export function DetailField({ label, value, icon: Icon, className, empty = '—' }: DetailFieldProps) {
  return (
    <div className={cn('space-y-0.5', className)}>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-sm text-foreground">
        {value != null && value !== '' ? (
          Icon ? (
            <span className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {value}
            </span>
          ) : value
        ) : (
          <span className="text-muted-foreground">{empty}</span>
        )}
      </div>
    </div>
  )
}
