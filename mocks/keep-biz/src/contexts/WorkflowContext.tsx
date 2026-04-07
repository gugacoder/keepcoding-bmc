import { createContext, useContext, useState, type ReactNode } from 'react'
import { workflows as initialWorkflows } from '@/data/workflows'
import type { Workflow, WorkflowStatus, Department } from '@/data/types'

interface WorkflowContextValue {
  workflows: Workflow[]
  addWorkflow: (data: { name: string; description: string; department: Department; connectorIds: string[] }) => void
  updateWorkflowStatus: (id: string, status: WorkflowStatus, agentId?: string) => void
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)

  const addWorkflow = (data: { name: string; description: string; department: Department; connectorIds: string[] }) => {
    const now = new Date().toISOString()
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: data.name,
      description: data.description,
      department: data.department,
      status: 'mapeado' as WorkflowStatus,
      agentId: null,
      createdAt: now,
      updatedAt: now,
    }
    setWorkflows((prev) => [newWorkflow, ...prev])
  }

  const updateWorkflowStatus = (id: string, status: WorkflowStatus, agentId?: string) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id
          ? { ...wf, status, agentId: agentId ?? wf.agentId, updatedAt: new Date().toISOString() }
          : wf
      )
    )
  }

  return (
    <WorkflowContext.Provider value={{ workflows, addWorkflow, updateWorkflowStatus }}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflows() {
  const ctx = useContext(WorkflowContext)
  if (!ctx) throw new Error('useWorkflows must be used within WorkflowProvider')
  return ctx
}
