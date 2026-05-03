import React from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { getPageNumbers } from '@/lib/utils/get-page-numbers'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1
  const pageSize = table.getState().pagination.pageSize
  const totalRows = table.getFilteredRowModel().rows.length

  const startRow = (currentPage - 1) * pageSize + 1
  const endRow = Math.min(currentPage * pageSize, totalRows)

  const pageNumbers = getPageNumbers(currentPage, pageCount)

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-4 px-2 py-4 sm:flex-row">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Хуудасны хэмжээ</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50, 100].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center space-x-2 text-sm">
        <span>
          Нийт {totalRows} үр дүнгийн {startRow}-ээс {endRow}-ийг харуулж
          байна
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((pageNumber, idx) => {
          if (pageNumber === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="text-muted-foreground">
                ...
              </span>
            )
          }

          return (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? 'default' : 'outline'}
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
            >
              {pageNumber}
            </Button>
          )
        })}

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
