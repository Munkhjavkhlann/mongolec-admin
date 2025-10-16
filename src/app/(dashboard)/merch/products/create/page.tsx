import { Metadata } from 'next'
import { MerchProductForm } from '@/features/merch/components/merch-product-form'

export const metadata: Metadata = {
  title: 'Create Product',
  description: 'Create a new merchandise product',
}

export default function MerchProductCreatePage() {
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground mt-2">
            Add a new product to your merchandise store
          </p>
        </div>

        <MerchProductForm />
      </div>
    </div>
  )
}
