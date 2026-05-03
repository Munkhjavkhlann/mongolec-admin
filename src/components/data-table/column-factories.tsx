import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * Helper to create a selection column for row selection
 */
export function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

/**
 * Helper to create an index/row number column
 */
export function createIndexColumn<TData>(
  pageIndex: number = 0,
  pageSize: number = 10
): ColumnDef<TData> {
  return {
    id: 'index',
    header: 'No.',
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{pageIndex * pageSize + row.index + 1}</span>
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
  }
}
