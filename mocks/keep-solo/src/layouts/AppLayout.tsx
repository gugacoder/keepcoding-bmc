import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'
import { DesktopHeader } from '@/components/DesktopHeader'

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-amber-50/30 overflow-hidden">
      {/* Header: desktop only */}
      <DesktopHeader />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom nav: mobile only */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
