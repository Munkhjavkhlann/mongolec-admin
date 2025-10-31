'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { MerchProductForm } from '@/features/merch/components/merch-product-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GET_MERCH_PRODUCT_BY_ID } from '@/graphql/queries/merch'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface GetMerchProductByIdData {
  merchProductById: any;
}

export default function MerchProductEditPage() {
  const params = useParams()
  const productId = params.id as string
  const [language, setLanguage] = useState<'en' | 'mn'>('en')

  const { data, loading, error } = useQuery<GetMerchProductByIdData>(GET_MERCH_PRODUCT_BY_ID, {
    variables: { id: productId, language },
    skip: !productId,
  })

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading product...</span>
        </div>
      </div>
    )
  }

  if (error || !data?.merchProductById) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Product not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const product = data.merchProductById

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground mt-2">
              Update product information and settings
            </p>
          </div>

          <Tabs value={language} onValueChange={(value) => setLanguage(value as 'en' | 'mn')}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="mn">Монгол</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <MerchProductForm
          mode="edit"
          language={language}
          productId={productId}
          initialData={product}
        />
      </div>
    </div>
  )
}
