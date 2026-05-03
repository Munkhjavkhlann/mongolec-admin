'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail } from 'lucide-react'
import { ContactMessagesTable } from '@/features/contact/components/contact-messages-table'
import { GET_CONTACT_MESSAGES } from '@/graphql/queries/contact'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { PageHeader, StatBar, EmptyState } from '@/components/admin'
import type { ContactMessage } from '@/features/contact/types'

interface GetContactMessagesData {
  getContactMessages: {
    items: ContactMessage[]
    total: number
    page: number
    limit: number
  }
}

const STATUS_TABS = [
  { value: 'all', label: 'All', filter: undefined },
  { value: 'new', label: 'New', filter: 'NEW' },
  { value: 'read', label: 'Read', filter: 'READ' },
  { value: 'replied', label: 'Replied', filter: 'REPLIED' },
]

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('all')

  const activeFilter = STATUS_TABS.find(t => t.value === activeTab)?.filter

  const { data, loading, error, refetch } = useQuery<GetContactMessagesData>(
    GET_CONTACT_MESSAGES,
    {
      variables: { status: activeFilter, page: 1, limit: 100 },
      fetchPolicy: 'cache-and-network',
    }
  )

  const messages = data?.getContactMessages?.items ?? []

  const stats = [
    { label: 'Total', value: loading ? '—' : messages.length },
    { label: 'New', value: loading ? '—' : messages.filter((m) => m.status === 'NEW').length, accent: 'amber' as const },
    { label: 'Read', value: loading ? '—' : messages.filter((m) => m.status === 'READ').length },
    { label: 'Replied', value: loading ? '—' : messages.filter((m) => m.status === 'REPLIED').length, accent: 'green' as const },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Contact Messages"
        description="View and manage incoming contact form submissions"
      />

      <StatBar stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load messages: {error.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-9">
          {STATUS_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-4">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {loading ? (
              <div className="rounded-xl border border-border/60 bg-card">
                <EmptyState icon={Mail} title="Loading messages…" className="py-12" />
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-card">
                <EmptyState icon={Mail} title="No messages found" description="Contact messages will appear here once submitted." />
              </div>
            ) : (
              <ContactMessagesTable messages={messages} loading={loading} onActionComplete={() => refetch()} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
