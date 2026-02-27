export interface Nomination {
  id: string
  country: string
  parkNames: string | { en: string; mn: string }
  parkWebsites?: string | { en: string; mn: string }
  parkContactFirstName?: string
  parkContactLastName?: string
  parkContactEmail?: string
  partnerOrganizationName?: string
  partnerContactFirstName?: string
  partnerContactLastName?: string
  partnerContactEmail?: string
  partnerWebsite?: string
  partnerAddress?: string
  primaryMission?: string
  motorcycleSupport?: string
  partnerLogisticsSupport?: string
  otherInfo?: string
  status: NominationStatus
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export type NominationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SELECTED'
  | 'NOT_SELECTED'

export interface NominationStats {
  total: number
  pending: number
  underReview: number
  approved: number
  rejected: number
  selected: number
  notSelected: number
}

export const nominationStatusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-200 text-yellow-800 border-yellow-300',
    variant: 'outline' as const,
    icon: 'Clock',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'bg-blue-200 text-blue-800 border-blue-300',
    variant: 'outline' as const,
    icon: 'FileText',
  },
  APPROVED: {
    label: 'Approved',
    color: 'bg-green-500 text-white border-green-500',
    variant: 'default' as const,
    icon: 'Check',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-500 text-white border-red-500',
    variant: 'destructive' as const,
    icon: 'X',
  },
  SELECTED: {
    label: 'Selected for Rally',
    color: 'bg-purple-500 text-white border-purple-500',
    variant: 'default' as const,
    icon: 'Trophy',
  },
  NOT_SELECTED: {
    label: 'Not Selected',
    color: 'bg-gray-200 text-gray-800 border-gray-300',
    variant: 'outline' as const,
    icon: 'X',
  },
} as const
