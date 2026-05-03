import { getNewsStats } from '../lib/news-api'
import { StatBar } from '@/components/admin'

export async function NewsStats() {
  const s = await getNewsStats()

  const stats = [
    { label: 'Total Articles', value: s.total },
    { label: 'Published', value: s.published, accent: 'green' as const },
    { label: 'Breaking', value: s.breaking, accent: 'red' as const },
    { label: 'Featured', value: s.featured, accent: 'amber' as const },
    { label: 'Drafts', value: s.drafts },
    { label: 'Scheduled', value: s.scheduled, accent: 'blue' as const },
  ]

  return <StatBar stats={stats} />
}
