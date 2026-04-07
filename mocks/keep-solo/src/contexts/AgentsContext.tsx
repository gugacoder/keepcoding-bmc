import { createContext, useContext, useState, type ReactNode } from 'react'
import { agents as initialAgents } from '@/data/agents'
import type { Agent, MemoryItem, Workflow } from '@/data/types'

interface AgentsContextValue {
  agent: Agent
  updateAgent: (patch: Partial<Agent>) => void
  activateFromWorkflow: (workflow: Workflow) => void
  addMemoryItem: (item: Omit<MemoryItem, 'id' | 'addedAt'>) => void
  removeMemoryItem: (itemId: string) => void
}

const AgentsContext = createContext<AgentsContextValue | null>(null)

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<Agent>(initialAgents[0]!)

  const updateAgent = (patch: Partial<Agent>) => {
    setAgent((prev) => ({ ...prev, ...patch }))
  }

  const activateFromWorkflow = (workflow: Workflow) => {
    const now = new Date().toISOString()
    setAgent((prev) => ({
      ...prev,
      workflowId: workflow.id,
      status: 'Working',
      heartbeat: true,
      trainingProgress: 100,
      lastActive: now,
      activities: [
        {
          id: `act-wf-${Date.now()}`,
          description: `Workflow "${workflow.name}" ativado — assumindo operação autônoma`,
          timestamp: now,
          type: 'completed',
        },
        ...prev.activities,
      ],
    }))
  }

  const addMemoryItem = (item: Omit<MemoryItem, 'id' | 'addedAt'>) => {
    const newItem: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      addedAt: new Date().toISOString(),
    }
    setAgent((prev) => ({ ...prev, memory: [...prev.memory, newItem] }))
  }

  const removeMemoryItem = (itemId: string) => {
    setAgent((prev) => ({ ...prev, memory: prev.memory.filter((m) => m.id !== itemId) }))
  }

  return (
    <AgentsContext.Provider value={{ agent, updateAgent, activateFromWorkflow, addMemoryItem, removeMemoryItem }}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used within AgentsProvider')
  return ctx
}
