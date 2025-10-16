export interface NewsArticle {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'breaking'
  category: string
  author: {
    id: string
    name: string
    email: string
  }
  publishedAt: string | null
  scheduledAt?: string | null
  createdAt: string
  updatedAt: string
  views: number
  featured: boolean
  isBreaking?: boolean
  isFeatured?: boolean
  language: 'en' | 'mn'
}

export const priorityConfig = {
  breaking: {
    label: 'Breaking',
    color: 'bg-red-500 text-white border-red-500',
    variant: 'destructive' as const,
  },
  urgent: {
    label: 'Urgent',
    color: 'bg-orange-500 text-white border-orange-500',
    variant: 'default' as const,
  },
  high: {
    label: 'High',
    color: 'bg-yellow-500 text-black border-yellow-500',
    variant: 'outline' as const,
  },
  normal: {
    label: 'Normal',
    color: 'bg-blue-500 text-white border-blue-500',
    variant: 'default' as const,
  },
  low: {
    label: 'Low',
    color: 'bg-gray-500 text-white border-gray-500',
    variant: 'secondary' as const,
  },
} as const

export const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-200 text-gray-800 border-gray-300',
    variant: 'outline' as const,
  },
  published: {
    label: 'Published',
    color: 'bg-green-500 text-white border-green-500',
    variant: 'default' as const,
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-500 text-white border-blue-500',
    variant: 'default' as const,
  },
  archived: {
    label: 'Archived',
    color: 'bg-red-200 text-red-800 border-red-300',
    variant: 'destructive' as const,
  },
} as const

export interface NewsFilters {
  search?: string
  status?: string[]
  priority?: string[]
  category?: string[]
  language?: string
  featured?: boolean
  author?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  currentPage: number
  pageSize: number
  totalPages: number
}

export interface NewsStats {
  total: number
  published: number
  breaking: number
  featured: number
  drafts: number
  scheduled: number
}

export interface NewsPageSearchParams {
  page?: string
  pageSize?: string
  search?: string
  status?: string[]
  priority?: string[]
  category?: string[]
}