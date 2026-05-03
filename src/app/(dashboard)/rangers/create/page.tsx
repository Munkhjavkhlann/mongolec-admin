'use client'

import { useState } from 'react'
import { RangerForm } from '@/features/rangers/components/ranger-form'
import { PageHeader } from '@/components/admin'

export default function CreateRangerPage() {
  const [language, setLanguage] = useState<'en' | 'mn'>('en')

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title="Add Park Partner"
        description="Register a new park partnership"
        backHref="/rangers"
        lang={language}
        onLangChange={setLanguage}
      />
      <RangerForm mode="create" language={language} />
    </div>
  )
}
