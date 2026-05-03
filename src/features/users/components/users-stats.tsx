import { getUserStats } from '../lib/users-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, Clock, UserX } from 'lucide-react'

const statConfig = [
  { key: 'total' as const,    label: 'Total Users', icon: Users,     iconColor: 'text-[#ED5016]' },
  { key: 'active' as const,   label: 'Active',      icon: UserCheck, iconColor: 'text-emerald-600' },
  { key: 'pending' as const,  label: 'Pending',     icon: Clock,     iconColor: 'text-amber-600' },
  { key: 'inactive' as const, label: 'Inactive',    icon: UserX,     iconColor: 'text-slate-500' },
]

export async function UsersStats() {
  const stats = await getUserStats()

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      {statConfig.map(({ key, label, icon: Icon, iconColor }) => (
        <Card key={key}>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>{label}</CardTitle>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
