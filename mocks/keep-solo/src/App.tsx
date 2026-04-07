import '@/lib/i18n'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import { AppLayout } from '@/layouts/AppLayout'
import { MonitorPage } from '@/pages/MonitorPage'
import { CreatePage } from '@/pages/CreatePage'
import { CreateCalendarPage } from '@/pages/CreateCalendarPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { AgentsChatPage } from '@/pages/AgentsChatPage'
import { AgentsToolsPage } from '@/pages/AgentsToolsPage'
import { ConfigPage } from '@/pages/ConfigPage'

function App() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/monitor" replace />} />
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/create/calendar" element={<CreateCalendarPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/chat" element={<AgentsChatPage />} />
            <Route path="/agents/tools" element={<AgentsToolsPage />} />
            <Route path="/config" element={<ConfigPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
