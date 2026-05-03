'use client'

import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import {
  MapPin,
  FileText,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { GET_NOMINATION_STATS } from '@/graphql/queries/nominations'
import { GET_APPLICATION_STATS } from '@/graphql/queries/applications'
import { GET_RALLIES } from '@/graphql/queries/rallies'

function StatCard({
  title,
  value,
  icon: Icon,
  sub,
  href,
  accent,
  loading,
}: {
  title: string
  value: number | string
  icon: React.ElementType
  sub?: string
  href: string
  accent?: 'orange' | 'green' | 'blue' | 'amber'
  loading?: boolean
}) {
  const accentClasses = {
    orange: 'text-primary',
    green: 'text-emerald-500',
    blue: 'text-sky-500',
    amber: 'text-amber-500',
  }
  const iconBg = {
    orange: 'bg-primary/10',
    green: 'bg-emerald-500/10',
    blue: 'bg-sky-500/10',
    amber: 'bg-amber-500/10',
  }

  const colorClass = accentClasses[accent ?? 'orange']
  const bgClass = iconBg[accent ?? 'orange']

  return (
    <Link href={href}>
      <Card className="group hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bgClass}`}>
            <Icon className={`h-4.5 w-4.5 ${colorClass}`} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16 mb-1" />
          ) : (
            <div className="text-3xl font-bold tracking-tight">{value}</div>
          )}
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          <div className="flex items-center gap-1 mt-3 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

type NominationStats = {
  getNominationStats: {
    total: number
    pending: number
    underReview: number
    approved: number
    rejected: number
    selected: number
    notSelected: number
  }
}

type ApplicationStats = {
  getApplicationStats: {
    totalApplications: number
    pendingApplications: number
    approvedApplications: number
    rejectedApplications: number
    waitlistedApplications: number
    confirmedApplications: number
    riderCount: number
    supporterCount: number
    totalRaising: number
  }
}

type RalliesData = {
  getRallies: {
    rallies: Array<{ id: string; title: string | { en?: string; mn?: string }; status: string }>
    pagination: { total: number }
  }
}

export default function DashboardPage() {
  const { data: nomData, loading: nomLoading } = useQuery<NominationStats>(GET_NOMINATION_STATS)
  const { data: appData, loading: appLoading } = useQuery<ApplicationStats>(GET_APPLICATION_STATS)
  const { data: rallyData, loading: rallyLoading } = useQuery<RalliesData>(GET_RALLIES, {
    variables: { status: 'ONGOING', limit: 10 },
  })

  const nom = nomData?.getNominationStats
  const app = appData?.getApplicationStats
  const activeRallies = rallyData?.getRallies?.rallies?.length ?? 0

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Rallies"
          value={rallyLoading ? '—' : activeRallies}
          icon={Trophy}
          sub="Currently running"
          href="/rallies"
          accent="orange"
          loading={rallyLoading}
        />
        <StatCard
          title="Applications"
          value={appLoading ? '—' : (app?.totalApplications ?? 0)}
          icon={FileText}
          sub={appLoading ? '' : `${app?.pendingApplications ?? 0} pending review`}
          href="/applications"
          accent="blue"
          loading={appLoading}
        />
        <StatCard
          title="Nominations"
          value={nomLoading ? '—' : (nom?.total ?? 0)}
          icon={MapPin}
          sub={nomLoading ? '' : `${nom?.pending ?? 0} pending review`}
          href="/nominations"
          accent="amber"
          loading={nomLoading}
        />
        <StatCard
          title="Approved Nominations"
          value={nomLoading ? '—' : (nom?.approved ?? 0)}
          icon={CheckCircle}
          sub={nomLoading ? '' : `${nom?.selected ?? 0} selected for rally`}
          href="/nominations"
          accent="green"
          loading={nomLoading}
        />
      </div>

      {/* Status breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" />
              Nomination Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nomLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))
            ) : (
              <>
                <PipelineRow label="Pending" value={nom?.pending ?? 0} color="bg-yellow-400" total={nom?.total ?? 1} />
                <PipelineRow label="Under Review" value={nom?.underReview ?? 0} color="bg-blue-400" total={nom?.total ?? 1} />
                <PipelineRow label="Approved" value={nom?.approved ?? 0} color="bg-emerald-400" total={nom?.total ?? 1} />
                <PipelineRow label="Selected" value={nom?.selected ?? 0} color="bg-primary" total={nom?.total ?? 1} />
                <PipelineRow label="Rejected" value={nom?.rejected ?? 0} color="bg-red-400" total={nom?.total ?? 1} />
              </>
            )}
            <div className="pt-2">
              <Link href="/nominations" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                Manage nominations <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-500" />
              Application Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))
            ) : (
              <>
                <PipelineRow label="Pending" value={app?.pendingApplications ?? 0} color="bg-yellow-400" total={app?.totalApplications ?? 1} />
                <PipelineRow label="Approved" value={app?.approvedApplications ?? 0} color="bg-emerald-400" total={app?.totalApplications ?? 1} />
                <PipelineRow label="Confirmed" value={app?.confirmedApplications ?? 0} color="bg-primary" total={app?.totalApplications ?? 1} />
                <PipelineRow label="Waitlisted" value={app?.waitlistedApplications ?? 0} color="bg-blue-400" total={app?.totalApplications ?? 1} />
                <PipelineRow label="Rejected" value={app?.rejectedApplications ?? 0} color="bg-red-400" total={app?.totalApplications ?? 1} />
              </>
            )}
            <div className="pt-2">
              <Link href="/applications" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                Manage applications <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participant breakdown */}
      {!appLoading && app && (app.riderCount > 0 || app.supporterCount > 0) && (
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Participant Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold">{app.riderCount}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Riders</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">{app.supporterCount}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Supporters</div>
              </div>
              {app.totalRaising > 0 && (
                <>
                  <div className="h-10 w-px bg-border" />
                  <div>
                    <div className="text-2xl font-bold">${app.totalRaising.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Total raising</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PipelineRow({ label, value, color, total }: { label: string; value: number; color: string; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium w-8 text-right">{value}</span>
    </div>
  )
}
