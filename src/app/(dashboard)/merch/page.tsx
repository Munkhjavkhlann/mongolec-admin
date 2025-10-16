import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'
import Link from 'next/link'
import { MerchProductsTable } from '@/features/merch/components/merch-products-table'
import type { MerchProduct } from '@/features/merch/types'

interface MerchPageProps {
  searchParams: {
    tab?: string
    page?: string
    limit?: string
    search?: string
    category?: string
    status?: string
  }
}

// Mock data - replace with actual API call
const mockProducts: MerchProduct[] = [
  {
    id: '1',
    name: 'T-Shirt Classic',
    slug: 't-shirt-classic',
    sku: 'TS-001',
    description: 'Classic cotton t-shirt',
    price: 29.99,
    compareAtPrice: 39.99,
    currency: 'USD',
    status: 'ACTIVE',
    featuredImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    inventory: 150,
    trackInventory: true,
    minStock: 20,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Hoodie Premium',
    slug: 'hoodie-premium',
    sku: 'HD-002',
    price: 59.99,
    currency: 'USD',
    status: 'ACTIVE',
    inventory: 75,
    trackInventory: true,
    minStock: 10,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Cap Vintage',
    slug: 'cap-vintage',
    sku: 'CAP-003',
    price: 24.99,
    currency: 'USD',
    status: 'OUT_OF_STOCK',
    inventory: 0,
    trackInventory: true,
    minStock: 15,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function MerchPage({ searchParams }: MerchPageProps) {
  const activeTab = searchParams.tab || 'products'

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchandise</h1>
          <p className="text-muted-foreground">
            Manage your products, categories, and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/merch/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/merch/categories">
              <Package className="mr-2 h-4 w-4" />
              Categories
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 active products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Featured on homepage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Items in stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="space-y-4">
          <MerchProductsTable products={mockProducts} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Organize your products with categories and subcategories
              </CardDescription>
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