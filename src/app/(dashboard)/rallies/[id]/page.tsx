'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, Calendar, MapPin, Users, Pencil } from 'lucide-react'
import Link from 'next/link'
import { GET_RALLY_BY_ID } from '@/graphql/queries/rallies'
import { PageHeader, FormSection, DetailField } from '@/components/admin'

interface GetRallyByIdData {
  getRally: any
}

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  UPCOMING: 'default',
  ONGOING: 'secondary',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
}

export default function RallyDetailPage() {
  const params = useParams()
  const rallyId = params.id as string

  const { data, loading, error } = useQuery<GetRallyByIdData>(GET_RALLY_BY_ID, {
    variables: { id: rallyId },
    skip: !rallyId,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading rally...</span>
      </div>
    )
  }

  if (error || !data?.getRally) {
    return (
      <div className="space-y-4">
        <PageHeader title="Rally" backHref="/rallies" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || 'Rally not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const rally = data.getRally

  const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field.en || field.mn || ''
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

  const spotsLeft = rally.maxParticipants
    ? rally.maxParticipants - (rally.currentParticipants || 0)
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title={getDisplayName(rally.title) || 'Rally Details'}
        description="Rally details and participant information"
        backHref="/rallies"
        actions={
          <Link href={`/rallies/${rallyId}/edit`}>
            <Button size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Rally
            </Button>
          </Link>
        }
      />

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card shadow-sm px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={STATUS_COLORS[rally.status] ?? 'outline'} className="capitalize">
              {rally.status?.toLowerCase()}
            </Badge>
            {rally.isRecruiting && (
              <Badge variant="secondary" className="text-xs">Recruiting</Badge>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card shadow-sm px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Participants</p>
          <p className="mt-1.5 text-2xl font-bold">
            {rally.currentParticipants || 0}
            {rally.maxParticipants && (
              <span className="text-sm font-normal text-muted-foreground"> / {rally.maxParticipants}</span>
            )}
          </p>
          {spotsLeft !== null && (
            <p className="text-xs text-muted-foreground mt-0.5">{spotsLeft} spots remaining</p>
          )}
        </div>

        <div className="rounded-xl border border-border/50 bg-card shadow-sm px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Duration</p>
          <p className="mt-1.5 text-2xl font-bold">{rally.duration || '—'}</p>
          {rally.duration && <p className="text-xs text-muted-foreground mt-0.5">days</p>}
        </div>
      </div>

      <FormSection title="Basic Information">
        <div className="grid grid-cols-2 gap-5">
          <DetailField label="Slug" value={rally.slug} />
          <DetailField label="Status" value={rally.status} />
        </div>
        {getDisplayName(rally.description) && (
          <DetailField label="Description" value={
            <p className="whitespace-pre-wrap leading-relaxed">{getDisplayName(rally.description)}</p>
          } />
        )}
      </FormSection>

      <FormSection title="Schedule & Location">
        <div className="grid grid-cols-2 gap-5">
          <DetailField label="Start Date" icon={Calendar} value={rally.startDate ? formatDate(rally.startDate) : undefined} />
          <DetailField label="End Date" icon={Calendar} value={rally.endDate ? formatDate(rally.endDate) : undefined} />
          <DetailField label="Location" icon={MapPin} value={getDisplayName(rally.location) || undefined} />
          {rally.applicationDeadline && (
            <DetailField label="Application Deadline" value={formatDate(rally.applicationDeadline)} />
          )}
        </div>
      </FormSection>

      <FormSection title="Participants">
        <div className="grid grid-cols-2 gap-5">
          <DetailField label="Target Audience" icon={Users} value={getDisplayName(rally.targetAudience) || undefined} />
          <DetailField label="Max Participants" value={rally.maxParticipants ?? undefined} />
          <DetailField label="Current Participants" value={rally.currentParticipants || 0} />
        </div>
      </FormSection>

      {(getDisplayName(rally.highlights) || getDisplayName(rally.rangerPartnerships)) && (
        <FormSection title="Highlights & Partnerships">
          {getDisplayName(rally.highlights) && (
            <DetailField label="Highlights" value={
              <p className="whitespace-pre-wrap leading-relaxed">{getDisplayName(rally.highlights)}</p>
            } />
          )}
          {getDisplayName(rally.rangerPartnerships) && (
            <DetailField label="Ranger Partnerships" value={
              <p className="whitespace-pre-wrap leading-relaxed">{getDisplayName(rally.rangerPartnerships)}</p>
            } />
          )}
        </FormSection>
      )}

      {(rally.heroImage || rally.heroVideo) && (
        <FormSection title="Media">
          {rally.heroImage && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hero Image</p>
              <img
                src={rally.heroImage}
                alt="Hero"
                className="h-60 w-full object-cover rounded-lg border border-border/50"
              />
            </div>
          )}
          {rally.heroVideo && (
            <DetailField label="Hero Video URL" value={rally.heroVideo} />
          )}
        </FormSection>
      )}

      <FormSection title="Metadata">
        <div className="grid grid-cols-2 gap-5">
          <DetailField label="Created" value={rally.createdAt ? formatDate(rally.createdAt) : undefined} />
          <DetailField label="Last Updated" value={rally.updatedAt ? formatDate(rally.updatedAt) : undefined} />
        </div>
      </FormSection>
    </div>
  )
}
