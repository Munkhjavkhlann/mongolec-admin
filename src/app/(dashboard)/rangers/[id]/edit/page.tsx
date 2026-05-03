'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { RangerForm } from '@/features/rangers/components/ranger-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, MapPin } from 'lucide-react'
import { GET_PARK_PARTNERSHIP } from '@/graphql/queries/rangers'
import { PageHeader, EmptyState } from '@/components/admin'

interface GetParkPartnershipData {
  getParkPartnership: any
}

const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field.en || field.mn || ''
}

export default function RangerEditPage() {
  const params = useParams()
  const rangerId = params.id as string
  const [language, setLanguage] = useState<'en' | 'mn'>('en')

  const { data, loading, error } = useQuery<GetParkPartnershipData>(
    GET_PARK_PARTNERSHIP,
    { variables: { id: rangerId }, skip: !rangerId }
  )

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState icon={MapPin} title="Loading park partner…" className="py-20" />
      </div>
    )
  }

  const ranger = data?.getParkPartnership

  if (error || !ranger) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <PageHeader title="Edit Park Partner" backHref="/rangers" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || 'Park partner not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title={getDisplayName(ranger.parkName)}
        description="Update park partner information"
        backHref="/rangers"
        lang={language}
        onLangChange={setLanguage}
      />
      <RangerForm mode="edit" language={language} initialData={ranger} rangerId={rangerId} />
    </div>
  )
}
