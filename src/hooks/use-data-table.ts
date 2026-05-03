'use client'

import { useCallback, useState } from 'react'
import {
  type ColumnDef, type ColumnFiltersState, type OnChangeFn,
  type PaginationState, type RowSelectionState, type SortingState,
  type TableState, type Updater, type VisibilityState,
  getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel,
  getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable,
} from '@tanstack/react-table'

interface UseDataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  initialState?: Omit<Partial<TableState>, 'sorting' | 'pagination'> & {
    sorting?: SortingState
    pagination?: PaginationState
  }
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  pageCount?: number
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  enableColumnPinning?: boolean
}

export function useDataTable<TData>({
  data, columns, searchValue, onSearchChange,
  pagination: externalPagination, onPaginationChange,
  sorting: externalSorting, onSortingChange,
  columnFilters: externalColumnFilters, onColumnFiltersChange,
  initialState, manualPagination = false, manualSorting = false,
  manualFiltering = false, enableRowSelection = true,
  enableMultiRowSelection = true, enableColumnPinning = false,
  pageCount = -1,
}: UseDataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    if (initialState?.columnVisibility) return initialState.columnVisibility
    const initialVis: VisibilityState = {}
    columns.forEach(column => {
      const id = (column as { id?: string }).id || (column as { accessorKey?: string }).accessorKey
      const meta = column.meta as { visible?: boolean; initiallyHidden?: boolean } | undefined
      if (id) {
        if (meta?.initiallyHidden === true) initialVis[id as string] = false
        else if (meta?.visible === false) initialVis[id as string] = false
      }
    })
    return initialVis
  })

  const [localPagination, setLocalPagination] = useState<PaginationState>(
    externalPagination || initialState?.pagination || { pageIndex: 0, pageSize: 10 }
  )
  const [localSorting, setLocalSorting] = useState<SortingState>(
    externalSorting || initialState?.sorting || []
  )
  const [localColumnFilters, setLocalColumnFilters] = useState<ColumnFiltersState>(
    externalColumnFilters || []
  )

  const paginationState = externalPagination || localPagination
  const sortingState = externalSorting || localSorting
  const columnFiltersState = externalColumnFilters || localColumnFilters
  const paginationHandler = onPaginationChange || setLocalPagination
  const sortingHandler = onSortingChange || setLocalSorting
  const columnFiltersHandler = onColumnFiltersChange || setLocalColumnFilters

  const handleRowSelectionChange = useCallback(
    (updaterOrValue: Updater<RowSelectionState>) => {
      const newSelection =
        typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue
      setRowSelection(newSelection)
    },
    [rowSelection]
  )

  const table = useReactTable({
    data, columns, initialState,
    pageCount: manualPagination ? pageCount : -1,
    state: {
      sorting: sortingState, columnVisibility, rowSelection,
      pagination: paginationState, columnFilters: columnFiltersState,
      globalFilter: searchValue || '',
    },
    enableRowSelection, enableMultiRowSelection, enableColumnPinning,
    manualPagination, manualSorting, manualFiltering,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: sortingHandler,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: paginationHandler,
    onColumnFiltersChange: columnFiltersHandler,
    onGlobalFilterChange: onSearchChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  const filteredSelectedRows = table?.getFilteredSelectedRowModel?.()?.rows || []

  return {
    table,
    selectedRows: filteredSelectedRows.map(row => row.original),
    selectedRowsCount: filteredSelectedRows.length,
    hasSelection: filteredSelectedRows.length > 0,
    searchValue: searchValue || '',
    onSearchChange,
    enableColumnPinning,
  }
}
