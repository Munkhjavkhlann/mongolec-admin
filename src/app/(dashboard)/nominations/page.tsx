'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Loader2, Search } from 'lucide-react'
import { NominationsTable } from '@/features/nominations/components/nominations-table'
import { GET_NOMINATIONS, GET_NOMINATION_STATS } from '@/graphql/queries/nominations'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface GetNominationsData {
  nominations: any[]
}

interface GetNominationStatsData {
  nominationStats: {
    total: number
    pending: number
    underReview: number
    approved: number
    rejected: number
    selected: number
    notSelected: number
  }
}

export default function NominationsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: statsData, loading: statsLoading } = useQuery<GetNominationStatsData>(
    GET_NOMINATION_STATS,
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  const { data, loading, error, refetch } = useQuery<GetNominationsData>(GET_NOMINATIONS, {
    variables: {
      status: statusFilter,
      country: countryFilter,
      limit: 100,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
  })

  const nominations = data?.nominations?.nominations || []
  const stats = statsData?.nominationStats || {
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    selected: 0,
    notSelected: 0,
  }

  // Common countries for filter
  const countries = ['Mongolia', 'Russia', 'China', 'Kazakhstan', 'Kyrgyzstan']

  // Helper function to get display name from JSON field
  const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field.en || field.mn || ''
  }

  // Filter nominations by search query
  const filteredNominations = nominations.filter((nomination: any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const parkNames = getDisplayName(nomination.parkNames).toLowerCase()
    const partner = nomination.partnerOrganizationName?.toLowerCase() || ''
    const country = nomination.country.toLowerCase()

    return (
      parkNames.includes(query) ||
      partner.includes(query) ||
      country.includes(query)
    )
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nominations</h1>
          <p className="text-muted-foreground">
            Review and manage park nominations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nominations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All nominations</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pending + stats.underReview}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.approved}</div>
                <p className="text-xs text-muted-foreground">{stats.selected} selected</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.rejected + stats.notSelected}</div>
                <p className="text-xs text-muted-foreground">Not accepted</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load nominations: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter(undefined)}>
              All
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter('PENDING')}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="under_review" onClick={() => setStatusFilter('UNDER_REVIEW')}>
              Under Review
            </TabsTrigger>
            <TabsTrigger value="approved" onClick={() => setStatusFilter('APPROVED')}>
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => setStatusFilter('REJECTED')}>
              Rejected
            </TabsTrigger>
            <TabsTrigger value="selected" onClick={() => setStatusFilter('SELECTED')}>
              Selected
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {/* Country Filter */}
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search nominations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading nominations...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <NominationsTable
              nominations={filteredNominations}
              loading={loading}
              onActionComplete={() => refetch()}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <NominationsTable
            nominations={filteredNominations}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="under_review" className="space-y-4">
          <NominationsTable
            nominations={filteredNominations}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <NominationsTable
            nominations={filteredNominations}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <NominationsTable
            nominations={filteredNominations}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="selected" className="space-y-4">
          <NominationsTable
            nominations={filteredNominations}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
