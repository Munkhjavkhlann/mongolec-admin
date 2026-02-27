// Mock data for stories - replace with actual API calls
import type { Story, StoryFilters, PaginatedResponse, StoryStats } from '../types'

// Mock data - replace with actual database queries
const mockStories: Story[] = [
  {
    id: '1',
    title: 'Transforming Rural Healthcare: The 2024 Impact',
    slug: 'transforming-rural-healthcare-2024',
    excerpt: 'How the 2024 rally brought medical care to remote communities',
    content: '<p>Full story content here...</p>',
    type: 'IMPACT',
    status: 'PUBLISHED',
    featured: true,
    author: 'Dr. Sarah Johnson',
    role: 'Medical Director',
    featuredImage: 'https://example.com/image1.jpg',
    gallery: ['https://example.com/gallery1.jpg', 'https://example.com/gallery2.jpg'],
    tags: ['healthcare', 'rural', 'impact'],
    publishedAt: '2024-01-15T08:00:00Z',
    createdAt: '2024-01-14T16:30:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    rally: {
      id: 'rally-1',
      name: 'Mongolia Rally 2024',
      slug: 'mongolia-rally-2024',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
    },
  },
  {
    id: '2',
    title: 'Rider Profile: John\'s Journey Through the Gobi',
    slug: 'rider-profile-john-gobi',
    excerpt: 'An inspiring story of perseverance and adventure',
    content: '<p>Full story content here...</p>',
    type: 'RIDER_PROFILE',
    status: 'PUBLISHED',
    featured: false,
    author: 'John Smith',
    role: 'Rider',
    featuredImage: 'https://example.com/image2.jpg',
    tags: ['rider', 'profile', 'gobi'],
    publishedAt: '2024-01-14T12:00:00Z',
    createdAt: '2024-01-13T10:15:00Z',
    updatedAt: '2024-01-14T12:00:00Z',
    rally: {
      id: 'rally-1',
      name: 'Mongolia Rally 2024',
      slug: 'mongolia-rally-2024',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
    },
  },
  {
    id: '3',
    title: 'Field Moment: A Child\'s Smile',
    slug: 'field-moment-child-smile',
    excerpt: 'A touching moment during our visit to a rural school',
    content: '<p>Full story content here...</p>',
    type: 'FIELD_MOMENT',
    status: 'DRAFT',
    featured: false,
    author: 'Mike Chen',
    role: 'Photographer',
    featuredImage: 'https://example.com/image3.jpg',
    tags: ['field-moment', 'education'],
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-13T09:45:00Z',
    rally: {
      id: 'rally-2',
      name: 'Caucasus Rally 2024',
      slug: 'caucasus-rally-2024',
      startDate: '2024-07-01',
      endDate: '2024-07-20',
    },
  },
  {
    id: '4',
    title: 'Before/After: Community Center Renovation',
    slug: 'before-after-community-center',
    excerpt: 'See the incredible transformation of the local community center',
    content: '<p>Full story content here...</p>',
    type: 'BEFORE_AFTER',
    status: 'PUBLISHED',
    featured: true,
    author: 'Emily Davis',
    role: 'Project Manager',
    featuredImage: 'https://example.com/image4.jpg',
    beforeAfterData: {
      before: {
        image: 'https://example.com/before.jpg',
        description: 'The community center before renovation',
        metrics: {
          capacity: '50 people',
          condition: 'Poor',
        },
      },
      after: {
        image: 'https://example.com/after.jpg',
        description: 'The renovated community center',
        metrics: {
          capacity: '200 people',
          condition: 'Excellent',
        },
      },
    },
    tags: ['before-after', 'community', 'renovation'],
    publishedAt: '2024-01-16T18:00:00Z',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    rally: {
      id: 'rally-1',
      name: 'Mongolia Rally 2024',
      slug: 'mongolia-rally-2024',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
    },
  },
  {
    id: '5',
    title: 'Ranger Profile: Keeping Everyone Safe',
    slug: 'ranger-profile-safety-first',
    excerpt: 'Behind the scenes with our medical ranger team',
    content: '<p>Full story content here...</p>',
    type: 'RANGER_PROFILE',
    status: 'PUBLISHED',
    featured: false,
    author: 'Dr. Lisa Wong',
    role: 'Chief Ranger',
    featuredImage: 'https://example.com/image5.jpg',
    tags: ['ranger', 'safety', 'medical'],
    publishedAt: '2024-01-10T15:30:00Z',
    createdAt: '2024-01-09T13:15:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
    rally: {
      id: 'rally-2',
      name: 'Caucasus Rally 2024',
      slug: 'caucasus-rally-2024',
      startDate: '2024-07-01',
      endDate: '2024-07-20',
    },
  },
]

export async function getStories(
  page: number = 1,
  pageSize: number = 10,
  filters: StoryFilters = {}
): Promise<PaginatedResponse<Story>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))

  let filteredStories = [...mockStories]

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredStories = filteredStories.filter(story =>
      story.title.toLowerCase().includes(searchLower) ||
      story.excerpt?.toLowerCase().includes(searchLower) ||
      story.author?.toLowerCase().includes(searchLower) ||
      story.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Apply type filter
  if (filters.type && filters.type.length > 0) {
    filteredStories = filteredStories.filter(story =>
      filters.type!.includes(story.type)
    )
  }

  // Apply status filter
  if (filters.status && filters.status.length > 0) {
    filteredStories = filteredStories.filter(story =>
      filters.status!.includes(story.status)
    )
  }

  // Apply rally filter
  if (filters.rallyId) {
    filteredStories = filteredStories.filter(story =>
      story.rally?.id === filters.rallyId
    )
  }

  // Apply featured filter
  if (filters.featured !== undefined) {
    filteredStories = filteredStories.filter(story =>
      story.featured === filters.featured
    )
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    filteredStories = filteredStories.filter(story =>
      story.tags?.some(tag => filters.tags!.includes(tag))
    )
  }

  // Sort by creation date (newest first)
  filteredStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Apply pagination
  const totalItems = filteredStories.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedStories = filteredStories.slice(startIndex, endIndex)

  return {
    data: paginatedStories,
    totalItems,
    currentPage: page,
    pageSize,
    totalPages
  }
}

export async function getStoryById(id: string): Promise<Story | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50))

  return mockStories.find(story => story.id === id) || null
}

export async function getStoryStats(): Promise<StoryStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50))

  const typeCounts = mockStories.reduce((acc, story) => {
    acc[story.type] = (acc[story.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: mockStories.length,
    published: mockStories.filter(s => s.status === 'PUBLISHED').length,
    draft: mockStories.filter(s => s.status === 'DRAFT').length,
    featured: mockStories.filter(s => s.featured).length,
    byType: Object.entries(typeCounts).map(([type, count]) => ({
      type: type as any,
      count,
    })),
  }
}

export async function getPublishedStories(
  page: number = 1,
  pageSize: number = 10,
  filters: Omit<StoryFilters, 'status'> = {}
): Promise<PaginatedResponse<Story>> {
  return getStories(page, pageSize, { ...filters, status: ['PUBLISHED'] })
}

export async function getFeaturedStories(limit: number = 10): Promise<Story[]> {
  const result = await getStories(1, limit, { featured: true })
  return result.data
}
