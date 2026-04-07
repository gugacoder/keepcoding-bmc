import '@/lib/i18n'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import { AppLayout } from '@/layouts/AppLayout'
import { MonitorPage } from '@/pages/MonitorPage'
import { ContentPage } from '@/pages/ContentPage'
import { ContentCalendarPage } from '@/pages/ContentCalendarPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { AgentsWorkflowsPage } from '@/pages/AgentsWorkflowsPage'
import { AgentsChatPage } from '@/pages/AgentsChatPage'
import { AgentsConnectorsPage } from '@/pages/AgentsConnectorsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { WorkflowProvider } from '@/contexts/WorkflowContext'

function App() {
  return (
    <Suspense fallback={null}>
      <WorkflowProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/monitor" replace />} />
              <Route path="/monitor" element={<MonitorPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/content/calendar" element={<ContentCalendarPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/workflows" element={<AgentsWorkflowsPage />} />
              <Route path="/agents/chat" element={<AgentsChatPage />} />
              <Route path="/agents/connectors" element={<AgentsConnectorsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkflowProvider>
    </Suspense>
  )
}

export default App
