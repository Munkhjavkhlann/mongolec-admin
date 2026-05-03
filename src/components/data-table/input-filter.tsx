'use client'

import * as React from 'react'

import { type Column } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/* eslint-disable react-hooks/exhaustive-deps */

type DataTableInputFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  debounceMs?: number
  fullWidth?: boolean
}

export function DataTableInputFilter<TData, TValue>({
  column,
  title,
  value: controlledValue,
  onValueChange,
  debounceMs = 300,
  fullWidth = false,
}: DataTableInputFilterProps<TData, TValue>) {
  const externalValue = column ? (column.getFilterValue() as string | undefined) : controlledValue
  const [inputValue, setInputValue] = React.useState<string>('')
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (externalValue == null || externalValue === '') {
      setInputValue('')
    } else if (externalValue !== inputValue) {
      setInputValue(externalValue)
    }
  }, [externalValue])

  const applyFilter = React.useCallback(
    (value: string) => {
      if (column) {
        column.setFilterValue(value || undefined)
      }
      onValueChange?.(value)
    },
    [column, onValueChange]
  )

  const debouncedApply = React.useCallback(
    (value: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      debounceTimeoutRef.current = setTimeout(() => {
        applyFilter(value)
      }, debounceMs)
    },
    [applyFilter, debounceMs]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    debouncedApply(val)
  }

  const clearFilter = () => {
    setInputValue('')
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    applyFilter('')
  }

  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <div className={cn('relative', fullWidth ? 'w-full' : 'w-auto')}>
        <Input
          id={`filter-${title?.toLowerCase().replace(/\s+/g, '-') || 'input'}`}
          name={`filter-${title?.toLowerCase().replace(/\s+/g, '-') || 'input'}`}
          placeholder=""
          value={inputValue}
          onChange={handleChange}
          className={cn(
            'bg-background focus-visible:ring-primary h-8 focus-visible:ring-1',
            fullWidth ? 'w-[full]' : 'w-[150px] lg:w-[200px]',
            'pl-8' // Add padding for the search icon
          )}
        />
        <div className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2">
          <svg
            className="h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {inputValue && (
          <Button
            variant="ghost"
            onClick={clearFilter}
            className="absolute top-0 right-0 h-full px-2 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
