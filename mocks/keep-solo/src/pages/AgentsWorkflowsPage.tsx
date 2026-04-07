import { useState } from 'react'
import { Plus, GitBranch, Pulse, X } from '@phosphor-icons/react'
import { useWorkflows } from '@/contexts/WorkflowContext'
import { WorkflowWizard } from '@/components/WorkflowWizard'
import { WorkflowDetailPanel } from '@/components/WorkflowDetailPanel'
import type { Workflow, WorkflowStatus } from '@/data/types'

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; className: string; pulse?: boolean }> = {
  mapeado: {
    label: 'Mapeado',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  },
  app_em_criacao: {
    label: 'App em criação',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
    pulse: true,
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
    label: 'Treinando',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    pulse: true,
  },
  agente_pronto: {
    label: 'Pronto',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
    pulse: true,
  },
  agente_ativo: {
    label: 'Agente ativo',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pulse: true,
  },
}

function StatusBadge({ status }: { status: WorkflowStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            status === 'agente_ativo'
              ? 'bg-emerald-500'
              : status === 'agente_pronto'
              ? 'bg-orange-500'
              : status === 'agente_treinando'
              ? 'bg-amber-500'
              : 'bg-purple-500'
          }`}
        />
      )}
      {config.label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function AgentsWorkflowsPage() {
  const { workflows } = useWorkflows()
  const [wizardOpen, setWizardOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  // sync selected workflow with latest state
  const liveSelected = selectedWorkflow
    ? (workflows.find((w) => w.id === selectedWorkflow.id) ?? selectedWorkflow)
    : null

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Workflows</h1>
          <p className="text-sm text-stone-400 mt-0.5">Processos que você faz repetidamente</p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
        >
          <Plus size={16} weight="bold" />
          Novo Workflow
        </button>
      </div>

      {/* Layout: cards + detail panel side-by-side on desktop */}
      <div className={`flex gap-5 ${liveSelected ? 'items-start' : ''}`}>
        {/* Cards grid */}
        <div className={`${liveSelected ? 'hidden lg:block lg:w-80 shrink-0' : 'flex-1'}`}>
          {workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                <GitBranch size={32} weight="duotone" className="text-amber-400" />
              </div>
              <p className="text-stone-600 font-medium">Nenhum workflow ainda</p>
              <p className="text-sm text-stone-400 mt-1">
                Descreva o que você faz repetidamente — seu agente vai aprender.
              </p>
              <button
                onClick={() => setWizardOpen(true)}
                className="mt-5 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <Plus size={15} weight="bold" />
                Criar primeiro workflow
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 items-start ${liveSelected ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
              {workflows.map((wf) => {
                const isSelected = liveSelected?.id === wf.id
                const live = workflows.find((w) => w.id === wf.id) ?? wf
                return (
                  <button
                    key={wf.id}
                    onClick={() => setSelectedWorkflow(live)}
                    className={`w-full text-left bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-200'
                        : 'border-amber-100 hover:border-amber-200'
                    }`}
                  >
                    {/* Top: name + status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <GitBranch size={18} weight="duotone" className="text-amber-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2">
                          {wf.name}
                        </h3>
                      </div>
                      <StatusBadge status={live.status} />
                    </div>

                    {/* Description */}
                    {wf.description && wf.description !== wf.name && (
                      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-3">
                        {wf.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-amber-50">
                      <span className="text-xs text-stone-400">{formatDate(wf.createdAt)}</span>
                      {live.status === 'agente_ativo' && (
                        <div className="flex items-center gap-1.5">
                          <Pulse size={14} weight="duotone" className="text-emerald-500 animate-pulse" />
                          <span className="text-xs font-medium text-emerald-600">Heartbeat</span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel — desktop side-by-side, mobile overlay */}
        {liveSelected && (
          <>
            {/* Desktop: side panel */}
            <div className="hidden lg:block flex-1 min-h-[520px]">
              <WorkflowDetailPanel
                workflow={liveSelected}
                onClose={() => setSelectedWorkflow(null)}
              />
            </div>

            {/* Mobile: full-screen overlay */}
            <div className="fixed inset-0 z-40 lg:hidden flex flex-col bg-black/30 backdrop-blur-sm">
              <div className="mt-auto bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
                {/* drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 bg-stone-200 rounded-full" />
                </div>
                <WorkflowDetailPanel
                  workflow={liveSelected}
                  onClose={() => setSelectedWorkflow(null)}
                />
              </div>
              {/* tap backdrop to close */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow"
                onClick={() => setSelectedWorkflow(null)}
              >
                <X size={18} className="text-stone-600" />
              </button>
            </div>
          </>
        )}
      </div>

      <WorkflowWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  )
}
