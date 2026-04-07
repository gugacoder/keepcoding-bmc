import { createContext, useContext, useState, type ReactNode } from 'react'
import { agents as initialAgents } from '@/data/agents'
import type { Agent, AgentStatus, Workflow } from '@/data/types'

interface AgentsContextValue {
  agents: Agent[]
  addAgentFromWorkflow: (workflow: Workflow) => Agent
  updateAgentStatus: (id: string, status: AgentStatus) => void
}

const AgentsContext = createContext<AgentsContextValue | null>(null)

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)

  const addAgentFromWorkflow = (workflow: Workflow): Agent => {
    const now = new Date().toISOString()
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: `Agente ${workflow.name.split(' ').slice(0, 3).join(' ')}`,
      role: workflow.name,
      department: workflow.department,
      status: 'Working' as AgentStatus,
      heartbeat: true,
      lastActive: now,
      workflowId: workflow.id,
      trainingProgress: 100,
      activities: [
        {
          id: `act-${Date.now()}`,
          description: `Ativado via pipeline de deploy do workflow "${workflow.name}"`,
          timestamp: now,
          type: 'action',
        },
      ],
      memory: [
        {
          id: `mem-${Date.now()}`,
          category: 'operações',
          content: `Criado a partir do workflow: ${workflow.name}`,
          addedAt: now,
        },
      ],
    }
    setAgents((prev) => [newAgent, ...prev])
    return newAgent
  }

  const updateAgentStatus = (id: string, status: AgentStatus) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  return (
    <AgentsContext.Provider value={{ agents, addAgentFromWorkflow, updateAgentStatus }}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used within AgentsProvider')
  return ctx
}
