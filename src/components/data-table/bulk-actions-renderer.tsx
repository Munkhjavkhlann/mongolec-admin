import React from 'react'
import { Table } from '@tanstack/react-table'
import { BulkAction, BulkActionProps } from './bulk-action'

interface BulkActionsRendererProps<TData> {
  table: Table<TData>
  actions: BulkActionProps[]
}

export function BulkActionsRenderer<TData>({
  table,
  actions,
}: BulkActionsRendererProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedData = selectedRows.map((row) => row.original)

  return (
    <>
      {actions.map((action, idx) => (
        <BulkAction
          key={idx}
          {...action}
          onClick={(e) => {
            action.onClick?.(e)
          }}
        />
      ))}
    </>
  )
}
