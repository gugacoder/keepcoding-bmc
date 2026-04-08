import { useState, useEffect } from 'react'
import { Plus, GitBranch } from '@phosphor-icons/react'
import { useWorkflows } from '@/contexts/WorkflowContext'
import { WorkflowWizard } from '@/components/WorkflowWizard'
import { WorkflowDetailPanel } from '@/components/WorkflowDetailPanel'
import { useAgents } from '@/contexts/AgentsContext'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonTable } from '@/components/Skeleton'
import type { Workflow, WorkflowStatus } from '@/data/types'

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; className: string }> = {
  mapeado: {
    label: 'Mapeado',
    className: 'bg-muted text-muted-foreground border-border',
  },
  app_em_criacao: {
    label: 'App em criação',
    className: 'bg-violet/10 text-violet border-violet/20',
  },
  app_pronto: {
    label: 'App pronto',
    className: 'bg-cyan/10 text-cyan border-cyan/20',
  },
  implantado: {
    label: 'Implantado',
    className: 'bg-orange/10 text-orange border-orange/20',
  },
  agente_treinando: {
    label: 'Agente treinando',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  agente_pronto: {
    label: 'Agente pronto',
    className: 'bg-cyan/10 text-cyan border-cyan/20',
  },
  agente_ativo: {
    label: 'Agente ativo',
    className: 'bg-success/10 text-success border-success/20',
  },
}

function StatusBadge({ status }: { status: WorkflowStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      {status === 'agente_ativo' && (
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse mr-1.5" />
      )}
      {status === 'agente_treinando' && (
        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse mr-1.5" />
      )}
      {status === 'agente_pronto' && (
        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse mr-1.5" />
      )}
      {config.label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function AgentsWorkflowsPage() {
  const { workflows } = useWorkflows()
  const { agents } = useAgents()
  const [wizardOpen, setWizardOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  // Keep selectedWorkflow in sync with live state from context
  const liveSelected = selectedWorkflow
    ? (workflows.find((w) => w.id === selectedWorkflow.id) ?? null)
    : null

  return (
    <div className="flex h-full">
      {/* Main list */}
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${liveSelected ? 'max-w-none' : ''}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Workflows</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Processos mapeados e automatizados pela equipe
              </p>
            </div>
            <button
              onClick={() => setWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus size={16} weight="bold" />
              Novo Workflow
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <SkeletonTable rows={4} />
          ) : workflows.length === 0 ? (
            <EmptyState
              icon={GitBranch}
              title="Nenhum workflow ainda"
              description="Mapeie o que a equipe faz repetidamente. O agente aprende e assume."
              ctaLabel="Criar primeiro workflow"
              onCta={() => setWizardOpen(true)}
            />
          ) : (
            <div className="bg-card rounded-md border border-border shadow-sm overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Nome
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Departamento
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Agente
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Criado em
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {workflows.map((wf) => {
                      const agent = wf.agentId ? agents.find((a) => a.id === wf.agentId) : null
                      const isSelected = liveSelected?.id === wf.id
                      return (
                        <tr
                          key={wf.id}
                          onClick={() => setSelectedWorkflow(wf)}
                          className={`hover:bg-accent transition-colors cursor-pointer ${isSelected ? 'bg-info/10 hover:bg-info/10' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground">{wf.name}</span>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{wf.description}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 text-xs font-medium bg-info/10 text-info rounded border border-info/20">
                              {wf.department}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={wf.status} />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {agent ? (
                              <span className="text-sm">{agent.name}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {formatDate(wf.createdAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-border">
                {workflows.map((wf) => {
                  const agent = wf.agentId ? agents.find((a) => a.id === wf.agentId) : null
                  const isSelected = liveSelected?.id === wf.id
                  return (
                    <div
                      key={wf.id}
                      onClick={() => setSelectedWorkflow(wf)}
                      className={`p-4 cursor-pointer active:bg-accent ${isSelected ? 'bg-info/10' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-foreground text-sm leading-snug">{wf.name}</p>
                        <StatusBadge status={wf.status} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-xs font-medium bg-info/10 text-info rounded border border-info/20">
                          {wf.department}
                        </span>
                        {agent && (
                          <span className="text-xs text-muted-foreground">{agent.name}</span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">{formatDate(wf.createdAt)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {liveSelected && (
        <>
          {/* Mobile overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setSelectedWorkflow(null)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm z-40 shadow-xl md:relative md:inset-auto md:w-80 lg:w-96 md:z-auto md:shadow-none md:border-l md:border-border overflow-y-auto">
            <WorkflowDetailPanel
              workflow={liveSelected}
              onClose={() => setSelectedWorkflow(null)}
            />
          </div>
        </>
      )}

      <WorkflowWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  )
}
