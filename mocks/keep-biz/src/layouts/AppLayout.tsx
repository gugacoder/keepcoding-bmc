import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { BottomNav } from '@/components/BottomNav'
import { OrchestratorBar } from '@/components/OrchestratorBar'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
      {/* Orchestrator Bar — always visible at top */}
      <OrchestratorBar />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: desktop only (lg+) */}
        <div className="hidden lg:flex">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav: mobile only (< lg) */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
