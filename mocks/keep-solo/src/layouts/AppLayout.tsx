import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'
import { DesktopHeader } from '@/components/DesktopHeader'

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden transition-colors">
      {/* Header: desktop only */}
      <DesktopHeader />

      {/* Main content — pb-16 prevents bottom nav from covering last content on mobile */}
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav: mobile only */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
