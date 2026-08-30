'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { EXPORT_MERCH_ORDERS } from '@/graphql/mutations/merch-orders'
import { downloadBase64File } from '@/lib/download'

interface ExportResult {
  exportMerchOrders: { filename: string; mimeType: string; base64: string; count: number }
}

const daysAgoIso = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}
const monthsAgoIso = (months: number) => {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}

// Number of rows the orders table shows per page (its default page size).
const PAGE_SIZE = 25

export function OrdersExportButton({ orders }: { orders: { id: string }[] }) {
  const [exportOrders, { loading }] = useMutation<ExportResult>(EXPORT_MERCH_ORDERS)
  const [customOpen, setCustomOpen] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const run = async (input: Record<string, unknown>, label: string) => {
    try {
      const { data } = await exportOrders({ variables: { input } })
      const r = data?.exportMerchOrders
      if (!r) throw new Error('No file returned')
      if (r.count === 0) {
        toast.info('No orders found for that selection')
        return
      }
      downloadBase64File(r.base64, r.filename, r.mimeType)
      toast.success(`Exported ${r.count} order${r.count === 1 ? '' : 's'} (${label})`)
    } catch (e) {
      toast.error(`Export failed: ${(e as Error).message}`)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-1.5" />
            )}
            Export Excel
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Download orders (.xlsx)</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => run({ orderIds: orders.slice(0, PAGE_SIZE).map((o) => o.id) }, 'this page')}
          >
            This page ({Math.min(PAGE_SIZE, orders.length)})
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => run({ startDate: daysAgoIso(3) }, 'last 3 days')}>
            Last 3 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => run({ startDate: daysAgoIso(7) }, 'last 7 days')}>
            Last 7 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => run({ startDate: monthsAgoIso(3) }, 'last 3 months')}>
            Last 3 months
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => run({ startDate: monthsAgoIso(12) }, 'last year')}>
            Last 1 year
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCustomOpen(true)}>Custom range…</DropdownMenuItem>
          <DropdownMenuItem onClick={() => run({}, 'all time')}>All time</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export a custom date range</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="export-from">From</Label>
              <Input
                id="export-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="export-to">To</Label>
              <Input id="export-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!from && !to}
              onClick={() => {
                const input: Record<string, unknown> = {}
                if (from) input.startDate = new Date(from).toISOString()
                if (to) {
                  const t = new Date(to)
                  t.setHours(23, 59, 59, 999)
                  input.endDate = t.toISOString()
                }
                setCustomOpen(false)
                run(input, 'custom range')
              }}
            >
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
