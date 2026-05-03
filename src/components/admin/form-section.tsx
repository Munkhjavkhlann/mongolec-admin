import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

export function FormSection({ title, description, children, className, actions }: FormSectionProps) {
  return (
    <div className={cn('rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden', className)}>
      <div className="flex items-start justify-between px-5 py-3.5 border-b border-border/40 bg-muted/30">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {actions && <div className="ml-4 shrink-0">{actions}</div>}
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  )
}
