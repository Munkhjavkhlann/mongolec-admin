'use client'

import { useQuery } from '@apollo/client/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Plus, Package, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { MerchProductsTable } from '@/features/merch/components/merch-products-table'
import { GET_MERCH_PRODUCTS } from '@/graphql/queries/merch'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'

interface GetMerchProductsData {
  getMerchProducts: any[]
}

export default function MerchPage() {
  const { data, loading, error } = useQuery<GetMerchProductsData>(GET_MERCH_PRODUCTS, {
    variables: { language: 'en', limit: 100, offset: 0 },
  })

  const products = data?.getMerchProducts || []
  const categoryCount = new Set(
    products.filter((p: any) => p.category).map((p: any) => p.category.id)
  ).size

  const stats = [
    { label: 'Total Products', value: products.length, sub: `${products.filter((p: any) => p.status === 'ACTIVE').length} active` },
    { label: 'Featured', value: products.filter((p: any) => p.isFeatured).length, sub: 'On homepage', accent: 'blue' as const },
    { label: 'Categories', value: categoryCount },
    { label: 'Inventory', value: products.reduce((sum: number, p: any) => sum + (p.inventory || 0), 0), sub: 'Items in stock', accent: 'green' as const },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Merchandise"
        description="Manage your products, categories, and inventory"
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/merch/products/create">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Product
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/merch/orders">
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Orders
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/merch/categories">
                <Package className="h-4 w-4 mr-1.5" />
                Categories
              </Link>
            </Button>
          </div>
        }
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load products: {error.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          {loading ? (
            <EmptyState icon={Package} title="Loading products…" className="py-20" />
          ) : (
            <MerchProductsTable products={products} />
          )}
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Organize your products with categories and subcategories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Server-side datatable will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
