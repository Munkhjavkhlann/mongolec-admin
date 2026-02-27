'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { RallyForm } from '@/features/rallies/components/rally-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GET_RALLY_BY_ID } from '@/graphql/queries/rallies'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface GetRallyByIdData {
  rallyById: any;
}

export default function RallyEditPage() {
  const params = useParams()
  const rallyId = params.id as string
  const [language, setLanguage] = useState<'en' | 'mn'>('en')

  const { data, loading, error } = useQuery<GetRallyByIdData>(GET_RALLY_BY_ID, {
    variables: { id: rallyId, language },
    skip: !rallyId,
  })

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading rally...</span>
        </div>
      </div>
    )
  }

  if (error || !data?.rallyById) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Rally not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const rally = data.rallyById

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Rally</h1>
            <p className="text-muted-foreground mt-2">
              Update rally information and settings
            </p>
          </div>

          <Tabs value={language} onValueChange={(value) => setLanguage(value as 'en' | 'mn')}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="mn">Монгол</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <RallyForm
          mode="edit"
          language={language}
          rallyId={rallyId}
          initialData={rally}
        />
      </div>
    </div>
  )
}
