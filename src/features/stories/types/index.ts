export type StoryType =
  | 'IMPACT'
  | 'TESTIMONIAL'
  | 'RANGER_PROFILE'
  | 'RIDER_PROFILE'
  | 'FIELD_MOMENT'
  | 'BEFORE_AFTER'
  | 'UPDATE'
  | 'NEWS'

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED'

export interface Story {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  type: StoryType
  status: ContentStatus
  featured: boolean
  author?: string
  role?: string
  featuredImage?: string
  gallery?: string[]
  videoUrl?: string
  beforeAfterData?: {
    before?: {
      image?: string
      description?: string
      metrics?: Record<string, string | number>
    }
    after?: {
      image?: string
      description?: string
      metrics?: Record<string, string | number>
    }
  }
  impactSummary?: string
  tags?: string[]
  publishedAt?: string | null
  scheduledAt?: string | null
  rally?: {
    id: string
    name: string
    slug: string
    startDate: string
    endDate: string
  }
  relatedRallies?: Array<{
    id: string
    name: string
    slug: string
  }>
  createdAt: string
  updatedAt: string
}

export const storyTypeConfig = {
  IMPACT: {
    label: 'Impact Story',
    color: 'bg-green-500 text-white border-green-500',
    variant: 'default' as const,
    icon: 'BookOpen',
  },
  TESTIMONIAL: {
    label: 'Testimonial',
    color: 'bg-blue-500 text-white border-blue-500',
    variant: 'default' as const,
    icon: 'BookOpen',
  },
  RANGER_PROFILE: {
    label: 'Ranger Profile',
    color: 'bg-purple-500 text-white border-purple-500',
    variant: 'default' as const,
    icon: 'BookOpen',
  },
  RIDER_PROFILE: {
    label: 'Rider Profile',
    color: 'bg-orange-500 text-white border-orange-500',
    variant: 'default' as const,
    icon: 'BookOpen',
  },
  FIELD_MOMENT: {
    label: 'Field Moment',
    color: 'bg-yellow-500 text-black border-yellow-500',
    variant: 'outline' as const,
    icon: 'BookOpen',
  },
  BEFORE_AFTER: {
    label: 'Before/After',
    color: 'bg-teal-500 text-white border-teal-500',
    variant: 'default' as const,
    icon: 'BookOpen',
  },
  UPDATE: {
    label: 'Update',
    color: 'bg-gray-500 text-white border-gray-500',
    variant: 'secondary' as const,
    icon: 'BookOpen',
  },
  NEWS: {
    label: 'News',
    color: 'bg-red-500 text-white border-red-500',
    variant: 'destructive' as const,
    icon: 'BookOpen',
  },
} as const

export const statusConfig = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-200 text-gray-800 border-gray-300',
    variant: 'outline' as const,
  },
  PUBLISHED: {
    label: 'Published',
    color: 'bg-green-500 text-white border-green-500',
    variant: 'default' as const,
  },
  SCHEDULED: {
    label: 'Scheduled',
    color: 'bg-blue-500 text-white border-blue-500',
    variant: 'default' as const,
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'bg-red-200 text-red-800 border-red-300',
    variant: 'destructive' as const,
  },
} as const

export interface StoryFilters {
  search?: string
  type?: StoryType[]
  status?: ContentStatus[]
  rallyId?: string
  featured?: boolean
  tags?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  currentPage: number
  pageSize: number
  totalPages: number
}

export interface StoryStats {
  total: number
  published: number
  draft: number
  featured: number
  byType: Array<{
    type: StoryType
    count: number
  }>
}

export interface StoriesPageSearchParams {
  page?: string
  pageSize?: string
  search?: string
  type?: StoryType[]
  status?: ContentStatus[]
  rallyId?: string
  featured?: string
}
