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
import { FileText, Loader2, Search } from 'lucide-react'
import { ApplicationsTable } from '@/features/applications/components/applications-table'
import { GET_APPLICATIONS, GET_APPLICATION_STATS } from '@/graphql/queries/applications'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GET_RALLIES } from '@/graphql/queries/rallies'

interface GetApplicationsData {
  applications: any[]
}

interface GetApplicationStatsData {
  applicationStats: {
    total: number
    pending: number
    underReview: number
    approved: number
    waitlisted: number
    rejected: number
    cancelled: number
    confirmed: number
  }
}

interface GetRalliesData {
  rallies: any[]
}

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [rallyFilter, setRallyFilter] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: statsData, loading: statsLoading } = useQuery<GetApplicationStatsData>(
    GET_APPLICATION_STATS,
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  const { data: ralliesData } = useQuery<GetRalliesData>(GET_RALLIES, {
    variables: {
      language: 'en',
      limit: 100,
      offset: 0,
    },
  })

  const { data, loading, error, refetch } = useQuery<GetApplicationsData>(GET_APPLICATIONS, {
    variables: {
      status: statusFilter,
      rallyId: rallyFilter,
      limit: 100,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
  })

  const applications = data?.applications?.applications || []
  const stats = statsData?.applicationStats || {
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    waitlisted: 0,
    rejected: 0,
    cancelled: 0,
    confirmed: 0,
  }

  const rallies = ralliesData?.rallies?.rallies || []

  // Helper to extract string from multilingual field
  const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field.en || field.mn || ''
  }

  // Filter applications by search query
  const filteredApplications = applications.filter((app: any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const fullName = `${app.firstName} ${app.lastName}`.toLowerCase()
    const email = app.email.toLowerCase()
    const rallyTitle = getDisplayName(app.rally?.title).toLowerCase()

    return (
      fullName.includes(query) ||
      email.includes(query) ||
      rallyTitle.includes(query)
    )
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage rally applications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All applications</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
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
                <p className="text-xs text-muted-foreground">{stats.confirmed} confirmed</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlisted</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.waitlisted}</div>
                <p className="text-xs text-muted-foreground">{stats.rejected} rejected</p>
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
            Failed to load applications: {error.message}
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
            <TabsTrigger value="confirmed" onClick={() => setStatusFilter('CONFIRMED')}>
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="waitlisted" onClick={() => setStatusFilter('WAITLIST')}>
              Waitlisted
            </TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => setStatusFilter('REJECTED')}>
              Rejected
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {/* Rally Filter */}
            <Select value={rallyFilter} onValueChange={setRallyFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by rally" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All Rallies</SelectItem>
                {rallies.map((rally) => (
                  <SelectItem key={rally.id} value={rally.id}>
                    {getDisplayName(rally.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applicant..."
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
                  <span className="ml-2 text-muted-foreground">Loading applications...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ApplicationsTable
              applications={filteredApplications}
              loading={loading}
              onActionComplete={() => refetch()}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <ApplicationsTable
            applications={filteredApplications}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="under_review" className="space-y-4">
          <ApplicationsTable
            applications={filteredApplications}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <ApplicationsTable
            applications={filteredApplications}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <ApplicationsTable
            applications={filteredApplications}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="waitlisted" className="space-y-4">
          <ApplicationsTable
            applications={filteredApplications}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <ApplicationsTable
            applications={filteredApplications}
            loading={loading}
            onActionComplete={() => refetch()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
