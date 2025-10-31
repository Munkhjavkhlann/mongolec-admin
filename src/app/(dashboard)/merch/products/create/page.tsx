'use client'

import { useState } from 'react'
import { MerchProductForm } from '@/features/merch/components/merch-product-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MerchProductCreatePage() {
  const [language, setLanguage] = useState<'en' | 'mn'>('en')

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
            <p className="text-muted-foreground mt-2">
              Add a new product to your merchandise store
            </p>
          </div>

          <Tabs value={language} onValueChange={(value) => setLanguage(value as 'en' | 'mn')}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="mn">Монгол</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <MerchProductForm language={language} />
      </div>
    </div>
  )
}
