import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'
import { DesktopHeader } from '@/components/DesktopHeader'

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-amber-50/30 overflow-hidden">
      {/* Header: desktop only */}
      <DesktopHeader />

      {/* Main content — pb-16 prevents bottom nav from covering last content on mobile */}
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav: mobile only */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
