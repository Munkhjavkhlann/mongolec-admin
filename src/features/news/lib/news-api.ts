// Mock data for news articles - replace with actual API calls
import type { NewsArticle, NewsFilters, PaginatedResponse, NewsStats } from '../types'

// Mock data - replace with actual database queries
const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Breaking: Major Economic Development Announced',
    slug: 'major-economic-development',
    status: 'published',
    priority: 'breaking',
    category: 'Economy',
    author: {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com'
    },
    publishedAt: '2024-01-15T08:00:00Z',
    createdAt: '2024-01-14T16:30:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    views: 1250,
    featured: true,
    language: 'en'
  },
  {
    id: '2',
    title: 'Technology Innovation Summit 2024',
    slug: 'tech-innovation-summit-2024',
    status: 'published',
    priority: 'high',
    category: 'Technology',
    author: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    publishedAt: '2024-01-14T12:00:00Z',
    createdAt: '2024-01-13T10:15:00Z',
    updatedAt: '2024-01-14T12:00:00Z',
    views: 890,
    featured: false,
    language: 'en'
  },
  {
    id: '3',
    title: 'Environmental Protection Initiative Launched',
    slug: 'environmental-protection-initiative',
    status: 'draft',
    priority: 'medium',
    category: 'Environment',
    author: {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@example.com'
    },
    publishedAt: null,
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-13T09:45:00Z',
    views: 0,
    featured: false,
    language: 'en'
  },
  {
    id: '4',
    title: 'Sports Championship Results',
    slug: 'sports-championship-results',
    status: 'scheduled',
    priority: 'medium',
    category: 'Sports',
    author: {
      id: '4',
      name: 'Lisa Davis',
      email: 'lisa@example.com'
    },
    publishedAt: '2024-01-16T18:00:00Z',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    views: 0,
    featured: true,
    language: 'en'
  },
  {
    id: '5',
    title: 'Cultural Festival Announcement',
    slug: 'cultural-festival-announcement',
    status: 'published',
    priority: 'low',
    category: 'Culture',
    author: {
      id: '5',
      name: 'David Wilson',
      email: 'david@example.com'
    },
    publishedAt: '2024-01-10T15:30:00Z',
    createdAt: '2024-01-09T13:15:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
    views: 567,
    featured: false,
    language: 'en'
  },
  // Add more mock articles for pagination testing
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 6}`,
    title: `Sample Article ${i + 6}: Lorem Ipsum Dolor Sit Amet`,
    slug: `sample-article-${i + 6}`,
    status: ['draft', 'published', 'scheduled'][i % 3] as NewsArticle['status'],
    priority: ['low', 'medium', 'high'][i % 3] as NewsArticle['priority'],
    category: ['Politics', 'Health', 'Education', 'Business'][i % 4],
    author: {
      id: `${(i % 3) + 1}`,
      name: ['John Smith', 'Sarah Johnson', 'Michael Brown'][i % 3],
      email: ['john@example.com', 'sarah@example.com', 'michael@example.com'][i % 3]
    },
    publishedAt: i % 3 === 1 ? `2024-01-${String(Math.max(1, 20 - i)).padStart(2, '0')}T12:00:00Z` : null,
    createdAt: `2024-01-${String(Math.max(1, 20 - i)).padStart(2, '0')}T10:00:00Z`,
    updatedAt: `2024-01-${String(Math.max(1, 20 - i)).padStart(2, '0')}T14:00:00Z`,
    views: Math.floor(Math.random() * 1000),
    featured: i % 7 === 0,
    language: 'en' as const
  }))
]

export async function getNewsArticles(
  page: number = 1,
  pageSize: number = 10,
  filters: NewsFilters = {}
): Promise<PaginatedResponse<NewsArticle>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))

  let filteredArticles = [...mockArticles]

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.category.toLowerCase().includes(searchLower) ||
      article.author.name.toLowerCase().includes(searchLower)
    )
  }

  // Apply status filter
  if (filters.status && filters.status.length > 0) {
    filteredArticles = filteredArticles.filter(article =>
      filters.status!.includes(article.status)
    )
  }

  // Apply priority filter
  if (filters.priority && filters.priority.length > 0) {
    filteredArticles = filteredArticles.filter(article =>
      filters.priority!.includes(article.priority)
    )
  }

  // Apply category filter
  if (filters.category && filters.category.length > 0) {
    filteredArticles = filteredArticles.filter(article =>
      filters.category!.includes(article.category)
    )
  }

  // Apply featured filter
  if (filters.featured !== undefined) {
    filteredArticles = filteredArticles.filter(article =>
      article.featured === filters.featured
    )
  }

  // Apply language filter
  if (filters.language) {
    filteredArticles = filteredArticles.filter(article =>
      article.language === filters.language
    )
  }

  // Sort by creation date (newest first)
  filteredArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Apply pagination
  const totalItems = filteredArticles.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  return {
    data: paginatedArticles,
    totalItems,
    currentPage: page,
    pageSize,
    totalPages
  }
}

export async function getNewsStats(): Promise<NewsStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50))

  return {
    total: mockArticles.length,
    published: mockArticles.filter(a => a.status === 'published').length,
    breaking: mockArticles.filter(a => a.priority === 'breaking').length,
    featured: mockArticles.filter(a => a.featured).length,
    drafts: mockArticles.filter(a => a.status === 'draft').length,
    scheduled: mockArticles.filter(a => a.status === 'scheduled').length,
  }
}