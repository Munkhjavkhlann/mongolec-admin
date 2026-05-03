'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { type Column, type Table } from '@tanstack/react-table'

const STORAGE_PREFIX = 'datatable-column-widths'

interface ColumnWidths {
  [columnId: string]: number
}

/**
 * Hook to manage column resizing functionality for data tables
 *
 * Features:
 * - Drag to resize columns
 * - Persist widths in localStorage
 * - Min/max width constraints
 * - Smooth visual feedback during resize
 * - Syncs with TanStack Table's internal state
 */
export function useColumnResizing<TData>(
  table: Table<TData>,
  tableId?: string,
  minColumnWidth = 120 // Configurable minimum, default 120px
) {
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({})
  const tableRef = useRef<HTMLTableElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)
  const columnIdRef = useRef<string>('')
  // Track per-column natural widths (initial rendered width becomes the floor)
  const naturalWidthsRef = useRef<Record<string, number>>({})

  // Keep table ref updated
  tableRef.current = table as unknown as HTMLTableElement

  // Load saved widths from localStorage on mount
  useEffect(() => {
    if (!tableId) return

    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}-${tableId}`)
      if (saved) {
        const widths = JSON.parse(saved) as ColumnWidths
        // Ensure minimum width constraint when loading saved widths
        const validatedWidths: ColumnWidths = {}
        for (const [key, value] of Object.entries(widths)) {
          validatedWidths[key] = Math.max(value, minColumnWidth)
        }
        setColumnWidths(validatedWidths)

        // Apply saved widths to TanStack Table columns
        table.setColumnSizing(prev => ({
          ...prev,
          ...validatedWidths,
        }))
      }
    } catch (error) {
      console.warn('[useColumnResizing] Failed to load saved widths:', error)
    }
  }, [tableId, table, minColumnWidth])

  // Save widths to localStorage when they change
  const saveWidths = useCallback(
    (widths: ColumnWidths) => {
      if (!tableId) return

      try {
        localStorage.setItem(`${STORAGE_PREFIX}-${tableId}`, JSON.stringify(widths))
      } catch (error) {
        console.warn('[useColumnResizing] Failed to save widths:', error)
      }
    },
    [tableId]
  )

  // Use refs for event handlers to avoid dependency issues
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>(null)
  const handleMouseUpRef = useRef<() => void>(null)

  /**
   * Start column resize
   */
  const handleResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const headerCell = (e.target as HTMLElement).closest('th')
    if (!headerCell) return

    // Capture the natural rendered width
    const renderedWidth = headerCell.getBoundingClientRect().width

    // Store as this column's floor — only if not already set
    // Once set, the column can never shrink below its initial natural width
    if (!naturalWidthsRef.current[columnId]) {
      naturalWidthsRef.current[columnId] = renderedWidth
    }

    setResizingColumn(columnId)
    columnIdRef.current = columnId
    startXRef.current = e.clientX
    startWidthRef.current = renderedWidth

    // Add global event listeners for drag
    const mouseMoveHandler = handleMouseMoveRef.current
    const mouseUpHandler = handleMouseUpRef.current
    if (mouseMoveHandler && mouseUpHandler) {
      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    }

    // Add cursor style to body
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  /**
   * Handle mouse move during resize
   */
  handleMouseMoveRef.current = useCallback(
    (e: MouseEvent) => {
      const columnId = columnIdRef.current
      if (!columnId) return

      const deltaX = e.clientX - startXRef.current
      // Floor against the column's natural width, or fall back to minColumnWidth
      const floor = naturalWidthsRef.current[columnId] ?? minColumnWidth
      const newWidth = Math.max(floor, startWidthRef.current + deltaX)

      // Update the column width state
      setColumnWidths(prev => ({
        ...prev,
        [columnId]: newWidth,
      }))

      // Also sync with TanStack Table's internal state
      const table = tableRef.current as unknown as Table<TData>
      if (table) {
        table.setColumnSizing(prev => ({
          ...prev,
          [columnId]: newWidth,
        }))
      }
    },
    [minColumnWidth]
  )

  /**
   * Handle mouse up to end resize
   */
  handleMouseUpRef.current = useCallback(() => {
    const columnId = columnIdRef.current
    if (!columnId) return

    setResizingColumn(null)
    columnIdRef.current = ''

    // Save the new widths
    setColumnWidths(prev => {
      saveWidths(prev)
      return prev
    })

    // Remove global event listeners
    if (handleMouseMoveRef.current) {
      document.removeEventListener('mousemove', handleMouseMoveRef.current)
    }
    if (handleMouseUpRef.current) {
      document.removeEventListener('mouseup', handleMouseUpRef.current)
    }

    // Reset cursor style
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [saveWidths])

  /**
   * Reset all columns to auto width
   */
  const resetColumnWidths = useCallback(() => {
    setColumnWidths({})
    if (tableId) {
      localStorage.removeItem(`${STORAGE_PREFIX}-${tableId}`)
    }
  }, [tableId])

  /**
   * Get the width style for a column
   * Only applies styles when a width has been explicitly set by user
   * Otherwise returns undefined to let browser auto-size naturally
   */
  const getColumnWidthStyle = useCallback(
    (column: Column<TData, unknown>): React.CSSProperties | undefined => {
      const width = columnWidths[column.id]
      if (!width) return undefined // No style = browser auto-sizes naturally
      const safeWidth = Math.max(width, minColumnWidth)
      return {
        width: `${safeWidth}px`,
        minWidth: `${safeWidth}px`,
        maxWidth: `${safeWidth}px`,
      }
    },
    [columnWidths, minColumnWidth]
  )

  return {
    resizingColumn,
    handleResizeStart,
    resetColumnWidths,
    getColumnWidthStyle,
    columnWidths,
    tableRef,
  }
}
