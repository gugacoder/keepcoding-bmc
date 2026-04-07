import { useState } from 'react'
import { Plus, GitBranch } from '@phosphor-icons/react'
import { useWorkflows } from '@/contexts/WorkflowContext'
import { WorkflowWizard } from '@/components/WorkflowWizard'
import { WorkflowDetailPanel } from '@/components/WorkflowDetailPanel'
import { agents } from '@/data'
import type { Workflow, WorkflowStatus } from '@/data/types'

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; className: string }> = {
  mapeado: {
    label: 'Mapeado',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  app_em_criacao: {
    label: 'App em criação',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  app_pronto: {
    label: 'App pronto',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  implantado: {
    label: 'Implantado',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  agente_treinando: {
    label: 'Agente treinando',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  agente_ativo: {
    label: 'Agente ativo',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
}

function StatusBadge({ status }: { status: WorkflowStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      {status === 'agente_ativo' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
      )}
      {status === 'agente_treinando' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5" />
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
  const [wizardOpen, setWizardOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

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
              <h1 className="text-xl font-semibold text-slate-900">Workflows</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Processos mapeados e automatizados pela equipe
              </p>
            </div>
            <button
              onClick={() => setWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={16} weight="bold" />
              Novo Workflow
            </button>
          </div>

          {/* Table */}
          {workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <GitBranch size={40} weight="duotone" className="text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Nenhum workflow ainda</p>
              <p className="text-sm text-slate-400 mt-1">Crie o primeiro workflow para começar.</p>
            </div>
          ) : (
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Nome
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Departamento
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Agente
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Criado em
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workflows.map((wf) => {
                      const agent = wf.agentId ? agents.find((a) => a.id === wf.agentId) : null
                      const isSelected = liveSelected?.id === wf.id
                      return (
                        <tr
                          key={wf.id}
                          onClick={() => setSelectedWorkflow(wf)}
                          className={`hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-slate-900">{wf.name}</span>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{wf.description}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-100">
                              {wf.department}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={wf.status} />
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {agent ? (
                              <span className="text-sm">{agent.name}</span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs">
                            {formatDate(wf.createdAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {workflows.map((wf) => {
                  const agent = wf.agentId ? agents.find((a) => a.id === wf.agentId) : null
                  const isSelected = liveSelected?.id === wf.id
                  return (
                    <div
                      key={wf.id}
                      onClick={() => setSelectedWorkflow(wf)}
                      className={`p-4 cursor-pointer active:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-slate-900 text-sm leading-snug">{wf.name}</p>
                        <StatusBadge status={wf.status} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-100">
                          {wf.department}
                        </span>
                        {agent && (
                          <span className="text-xs text-slate-500">{agent.name}</span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto">{formatDate(wf.createdAt)}</span>
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
          <div className="fixed inset-y-0 right-0 w-full max-w-sm z-40 shadow-xl md:relative md:inset-auto md:w-80 lg:w-96 md:z-auto md:shadow-none md:border-l md:border-slate-200 overflow-y-auto">
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
