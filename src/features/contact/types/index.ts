export interface ContactMessage {
  id: string
  tenantId: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactMessageStatus
  createdAt: string
  updatedAt: string
}

export type ContactMessageStatus = 'NEW' | 'READ' | 'REPLIED'

export const contactMessageStatusConfig = {
  NEW: {
    label: 'New',
    color: 'bg-red-200 text-red-800 border-red-300',
    variant: 'outline' as const,
    icon: 'Mail',
  },
  READ: {
    label: 'Read',
    color: 'bg-blue-200 text-blue-800 border-blue-300',
    variant: 'outline' as const,
    icon: 'MailOpen',
  },
  REPLIED: {
    label: 'Replied',
    color: 'bg-green-500 text-white border-green-500',
    variant: 'default' as const,
    icon: 'Check',
  },
} as const
