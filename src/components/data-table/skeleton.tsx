import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function TableSkeleton({ rows = 10, cols = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={`${rowIndex}-${colIndex}`}
              className="h-10 flex-1"
              style={{
                animationDelay: `${(rowIndex * cols + colIndex) * 30}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ToolbarSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-48" style={{ animationDelay: '0ms' }} />
        <Skeleton className="h-9 w-32" style={{ animationDelay: '30ms' }} />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-32" style={{ animationDelay: '60ms' }} />
        <Skeleton className="h-8 w-32" style={{ animationDelay: '90ms' }} />
        <Skeleton className="h-8 w-24" style={{ animationDelay: '120ms' }} />
      </div>
    </div>
  )
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" style={{ animationDelay: '0ms' }} />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="h-8 w-8"
            style={{ animationDelay: `${(idx + 1) * 30}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export function DataTableSkeleton({ rows = 10, cols = 6 }) {
  return (
    <div className="space-y-4">
      <ToolbarSkeleton />
      <TableSkeleton rows={rows} cols={cols} />
      <PaginationSkeleton />
    </div>
  )
}

export { Skeleton }
