'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, Plus } from 'lucide-react'
import { RangersTable } from '@/features/rangers/components/rangers-table'
import { GET_PARK_PARTNERSHIPS } from '@/graphql/queries/rangers'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'
import type { ParkPartnership } from '@/features/rangers/types'

interface GetParkPartnershipsData {
  getParkPartnerships: ParkPartnership[]
}

const COUNTRIES = ['Mongolia', 'Russia', 'China', 'Kazakhstan', 'Kyrgyzstan']

const STATUS_TABS = [
  { value: 'all', label: 'All', filter: undefined },
  { value: 'active', label: 'Active', filter: 'ACTIVE' },
  { value: 'proposed', label: 'Proposed', filter: 'PROPOSED' },
  { value: 'inactive', label: 'Inactive', filter: 'INACTIVE' },
]

const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field.en || field.mn || ''
}

export default function RangersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')

  const activeFilter = STATUS_TABS.find(t => t.value === activeTab)?.filter

  const { data, loading, error, refetch } = useQuery<GetParkPartnershipsData>(
    GET_PARK_PARTNERSHIPS,
    {
      variables: { status: activeFilter, country: countryFilter, limit: 100, page: 1 },
      fetchPolicy: 'cache-and-network',
    }
  )

  const rangers = data?.getParkPartnerships ?? []

  const filteredRangers = rangers.filter((ranger) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      getDisplayName(ranger.parkName).toLowerCase().includes(q) ||
      ranger.country.toLowerCase().includes(q) ||
      getDisplayName(ranger.partnershipType).toLowerCase().includes(q)
    )
  })

  const stats = [
    { label: 'Total', value: loading ? '—' : rangers.length },
    { label: 'Active', value: loading ? '—' : rangers.filter((r) => r.status === 'ACTIVE').length, accent: 'green' as const },
    { label: 'Proposed', value: loading ? '—' : rangers.filter((r) => r.status === 'PROPOSED').length, accent: 'amber' as const },
    { label: 'Inactive', value: loading ? '—' : rangers.filter((r) => r.status === 'INACTIVE').length },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Rangers"
        description="Manage park partnerships and ranger networks"
        actions={
          <Link href="/rangers/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Partnership
            </Button>
          </Link>
        }
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load rangers: {error.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList className="h-9">
            {STATUS_TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-4">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex gap-2 shrink-0">
            <Select value={countryFilter ?? 'all'} onValueChange={(v) => setCountryFilter(v === 'all' ? undefined : v)}>
              <SelectTrigger className="h-9 w-[160px] text-xs">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {COUNTRIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search rangers…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 w-[200px] text-xs"
              />
            </div>
          </div>
        </div>

        {STATUS_TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {loading ? (
              <div className="rounded-xl border border-border/60 bg-card">
                <EmptyState icon={MapPin} title="Loading rangers…" className="py-12" />
              </div>
            ) : filteredRangers.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-card">
                <EmptyState icon={MapPin} title="No rangers found" description="Rangers will appear here once added." />
              </div>
            ) : (
              <RangersTable rangers={filteredRangers} loading={loading} onActionComplete={() => refetch()} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
