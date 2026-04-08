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
import { ProfilesPage } from '@/pages/ProfilesPage'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { WorkflowProvider } from '@/contexts/WorkflowContext'
import { AgentsProvider } from '@/contexts/AgentsContext'
import { ContentProvider } from '@/contexts/ContentContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { RouteGuard } from '@/components/RouteGuard'

function App() {
  return (
    <Suspense fallback={null}>
      <ThemeProvider>
      <AuthProvider>
      <AgentsProvider>
      <ContentProvider>
      <WorkflowProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route index element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<Navigate to="/landing#pricing" replace />} />

            {/* Protected routes */}
            <Route element={<RouteGuard><ProfileProvider><AppLayout /></ProfileProvider></RouteGuard>}>
              <Route path="/monitor" element={<MonitorPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/content/calendar" element={<ContentCalendarPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/workflows" element={<AgentsWorkflowsPage />} />
              <Route path="/agents/chat" element={<AgentsChatPage />} />
              <Route path="/agents/connectors" element={<AgentsConnectorsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profiles" element={<ProfilesPage />} />
              <Route path="/profiles/new" element={<ProfilesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkflowProvider>
      </ContentProvider>
      </AgentsProvider>
      </AuthProvider>
      </ThemeProvider>
    </Suspense>
  )
}

export default App
