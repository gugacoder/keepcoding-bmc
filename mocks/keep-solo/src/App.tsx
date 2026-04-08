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
import { AgentsWorkflowsPage } from '@/pages/AgentsWorkflowsPage'
import { ConfigPage } from '@/pages/ConfigPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { WorkflowProvider } from '@/contexts/WorkflowContext'
import { AgentsProvider } from '@/contexts/AgentsContext'
import { ContentProvider } from '@/contexts/ContentContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { RouteGuard } from '@/components/RouteGuard'
import { SoloProfileProvider } from '@/contexts/ProfileContext'

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

            {/* Protected routes — single SoloProfileProvider + RouteGuard wrapper */}
            <Route element={<SoloProfileProvider><RouteGuard /></SoloProfileProvider>}>
              {/* Standard app routes — with AppLayout (BottomNav + header) */}
              <Route element={<AppLayout />}>
                <Route path="/monitor" element={<MonitorPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/create/calendar" element={<CreateCalendarPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/agents/workflows" element={<AgentsWorkflowsPage />} />
                <Route path="/agents/chat" element={<AgentsChatPage />} />
                <Route path="/agents/tools" element={<AgentsToolsPage />} />
                <Route path="/config" element={<ConfigPage />} />
              </Route>

              {/* Fullscreen routes — no AppLayout, no BottomNav/header */}
              <Route path="/onboarding" element={<OnboardingPage />} />
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
