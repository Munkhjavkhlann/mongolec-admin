'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { MerchProductForm } from '@/features/merch/components/merch-product-form'
import { GET_MERCH_PRODUCT_BY_ID } from '@/graphql/queries/merch'
import { Loader2, AlertCircle, Package } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader, EmptyState } from '@/components/admin'

interface GetMerchProductByIdData {
  merchProductById: any
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
      <div className="max-w-4xl mx-auto">
        <EmptyState icon={Package} title="Loading product…" className="py-20" />
      </div>
    )
  }

  if (error || !data?.merchProductById) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <PageHeader title="Edit Product" backHref="/merch" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || 'Product not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const product = data.merchProductById
  const title = typeof product.name === 'string' ? product.name : product.name?.en || 'Edit Product'

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title={title}
        description="Update product information and settings"
        backHref="/merch"
        lang={language}
        onLangChange={setLanguage}
      />
      <MerchProductForm
        mode="edit"
        language={language}
        productId={productId}
        initialData={product}
      />
    </div>
  )
}
