'use client'

import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useAuthStore } from '@/stores/auth-store'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const user = useAuthStore((s) => s.user)

  const isSuperAdmin = user?.roles?.some((r) => r.role.name === 'super_admin') ?? false
  const isRallyTenant = user?.tenant?.slug === 'rally-for-rangers'
  const canSeeRally = isSuperAdmin || isRallyTenant

  const filteredNavGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.title === 'Rally') return canSeeRally
      return true
    }),
  }))

  const navUser = {
    name: user
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email
      : sidebarData.user.name,
    email: user?.email ?? sidebarData.user.email,
    avatar: sidebarData.user.avatar,
  }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                M
              </div>
              <div className="grid leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-sm text-sidebar-foreground">Mongolec</span>
                <span className="truncate text-xs text-sidebar-foreground/50">Admin Dashboard</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
