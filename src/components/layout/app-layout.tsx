'use client'

import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { LayoutSettings } from '@/components/layout-settings'

type AppLayoutProps = {
  children?: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  // TODO: Get from cookies in real implementation
  const defaultOpen = true

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-[[data-layout=fixed]]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            <Header fixed>
              <div className="flex-1">
                <h1 className="text-lg font-semibold">Mongolec Admin</h1>
              </div>
              <div className="flex items-center gap-2">
                <LayoutSettings />
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </Header>
            <Main fixed={false} fluid={false}>
              {children}
            </Main>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}