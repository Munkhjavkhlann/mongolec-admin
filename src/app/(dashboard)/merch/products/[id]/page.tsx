'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { MerchProductForm } from '@/features/merch/components/merch-product-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { GET_MERCH_PRODUCT_BY_ID } from '@/graphql/queries/merch'
import { Loader2, AlertCircle, Edit, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

interface GetMerchProductByIdData {
  merchProductById: any;
}

export default function MerchProductViewPage() {
  const params = useParams()
  const router = useRouter()
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">View Product</h1>
              <p className="text-muted-foreground mt-2">
                Product details (read-only)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={language} onValueChange={(value) => setLanguage(value as 'en' | 'mn')}>
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="mn">Монгол</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button asChild>
              <Link href={`/merch/products/${productId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Link>
            </Button>
          </div>
        </div>

        <MerchProductForm
          mode="view"
          language={language}
          productId={productId}
          initialData={product}
        />
      </div>
    </div>
  )
}
