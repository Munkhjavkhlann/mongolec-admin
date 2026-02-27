'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RallyForm } from '@/features/rallies/components/rally-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RallyCreatePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'en' | 'mn'>('en')

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Rally</h1>
            <p className="text-muted-foreground mt-2">
              Create a new rally and manage its details
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
          mode="create"
          language={language}
        />
      </div>
    </div>
  )
}
