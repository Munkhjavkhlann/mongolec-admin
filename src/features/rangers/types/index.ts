export interface ParkPartnership {
  id: string
  parkName: string | { en: string; mn: string }
  country: string
  location: string | { en: string; mn: string }
  establishedDate?: string
  partnershipType: string | { en: string; mn: string }
  rangersCount?: number
  areaSize?: string | { en: string; mn: string }
  keyChallenges?: string | { en: string; mn: string }
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  photos?: string | string[]
  videos?: string | string[]
  rallies?: string | string[]
  status: PartnershipStatus
  createdAt: string
  updatedAt: string
}

export type PartnershipStatus = 'PROPOSED' | 'ACTIVE' | 'INACTIVE' | 'HISTORICAL'

export const partnershipStatusConfig = {
  PROPOSED: {
    label: 'Proposed',
    color: 'bg-yellow-200 text-yellow-800 border-yellow-300',
    variant: 'outline' as const,
    icon: 'Clock',
  },
  ACTIVE: {
    label: 'Active',
    color: 'bg-green-500 text-white border-green-500',
    variant: 'default' as const,
    icon: 'Check',
  },
  INACTIVE: {
    label: 'Inactive',
    color: 'bg-gray-200 text-gray-800 border-gray-300',
    variant: 'outline' as const,
    icon: 'X',
  },
  HISTORICAL: {
    label: 'Historical',
    color: 'bg-blue-200 text-blue-800 border-blue-300',
    variant: 'outline' as const,
    icon: 'Archive',
  },
} as const
