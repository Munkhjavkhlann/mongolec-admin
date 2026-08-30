'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { FormSection } from '@/components/admin'
import { AutocompleteSelectFilter } from '@/components/data-table/autocomplete-select-filter'
import {
  CREATE_MERCH_DISCOUNT,
  UPDATE_MERCH_DISCOUNT,
} from '@/graphql/mutations/merch'
import { GET_MERCH_DISCOUNTS, GET_MERCH_PRODUCTS } from '@/graphql/queries/merch'
import type { MerchDiscountType } from '../types'

interface MerchDiscountFormProps {
  mode?: 'create' | 'edit'
  discountId?: string
  initialData?: {
    id: string
    name?: string
    type?: MerchDiscountType
    value?: number
    startDate?: string
    endDate?: string
    isActive?: boolean
    productIds?: string[]
  }
}

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return ''
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

export function MerchDiscountForm({
  mode = 'create',
  discountId,
  initialData,
}: MerchDiscountFormProps) {
  const router = useRouter()

  const [name, setName] = useState(initialData?.name ?? '')
  const [type, setType] = useState<MerchDiscountType>(initialData?.type ?? 'PERCENT')
  const [value, setValue] = useState(String(initialData?.value ?? ''))
  const [startDate, setStartDate] = useState(toDateInputValue(initialData?.startDate))
  const [endDate, setEndDate] = useState(toDateInputValue(initialData?.endDate))
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [productIds, setProductIds] = useState<string[]>(initialData?.productIds ?? [])

  const refetchQueries = [{ query: GET_MERCH_DISCOUNTS }]

  const [createDiscount, { loading: creating }] = useMutation(CREATE_MERCH_DISCOUNT, {
    refetchQueries,
    onCompleted: () => {
      toast.success('Discount created successfully')
      router.push('/merch/discounts')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create discount')
    },
  })

  const [updateDiscount, { loading: updating }] = useMutation(UPDATE_MERCH_DISCOUNT, {
    refetchQueries,
    onCompleted: () => {
      toast.success('Discount updated successfully')
      router.push('/merch/discounts')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update discount')
    },
  })

  const loading = creating || updating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    const numericValue = parseFloat(value)
    if (isNaN(numericValue) || numericValue < 0) {
      toast.error('Value must be a positive number')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Start and end dates are required')
      return
    }

    const input = {
      name: name.trim(),
      type,
      value: numericValue,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive,
      productIds,
    }

    if (mode === 'edit' && discountId) {
      await updateDiscount({ variables: { id: discountId, input } })
    } else {
      await createDiscount({ variables: { input } })
    }
  }

  // Product names are localized JSON ({en,mn}); map to plain-string labels so
  // the picker shows readable names instead of "[object Object]".
  const localizedName = (field: unknown): string => {
    if (typeof field === 'string') return field
    const f = field as { en?: string; mn?: string } | null
    return f?.en || f?.mn || ''
  }
  const { data: productsData } = useQuery<{
    getMerchProducts: { id: string; name: unknown }[]
  }>(GET_MERCH_PRODUCTS)
  const productOptions = (productsData?.getMerchProducts ?? []).map((p) => ({
    value: p.id,
    label: localizedName(p.name),
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection
        title="Discount Information"
        description="Name, type, and value for this discount"
      >
        <div className="space-y-1.5">
          <Label htmlFor="discount-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="discount-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Sale 20%"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="discount-type">
              Type <span className="text-destructive">*</span>
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as MerchDiscountType)}>
              <SelectTrigger id="discount-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT">Percent (%)</SelectItem>
                <SelectItem value="AMOUNT">Fixed Amount ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="discount-value">
              Value {type === 'PERCENT' ? '(%)' : '(amount)'}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="discount-value"
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'PERCENT' ? '20' : '10.00'}
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Schedule"
        description="Set when this discount is valid"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="start-date">
              Start Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="end-date">
              End Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enable this discount immediately
            </p>
          </div>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
      </FormSection>

      <FormSection
        title="Products"
        description="Attach this discount to specific products (optional)"
      >
        <div className="space-y-1.5">
          <Label>Products</Label>
          <AutocompleteSelectFilter
            value={productIds}
            onChange={(v) => setProductIds(Array.isArray(v) ? v : v ? [v] : [])}
            options={productOptions}
            isMulti
            placeholder="Search and select products…"
          />
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 py-4">
          <Button type="submit" disabled={loading} className="min-w-[160px]">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {mode === 'edit' ? 'Update Discount' : 'Create Discount'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
