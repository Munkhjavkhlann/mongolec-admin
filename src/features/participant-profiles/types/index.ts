export interface ParticipantProfile {
  id: string
  firstName: string
  lastName: string
  photo?: string
  country: string
  bio?: string
  isActive: boolean
  displayOrder: number
  rallyYears: number[]
  createdAt: string
  updatedAt: string
}
