export interface TeamMember {
  id: string
  tenantId: string
  name: string
  role: string
  bio?: string
  photo?: string
  email?: string
  linkedinUrl?: string
  twitterUrl?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
