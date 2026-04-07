import { useState, useEffect, useRef } from 'react'
import {
  X,
  MapPin,
  HardDrives,
  Package,
  CloudArrowUp,
  Brain,
  Robot,
  Check,
  CircleNotch,
  ArrowRight,
} from '@phosphor-icons/react'
import { useWorkflows } from '@/contexts/WorkflowContext'
import type { Workflow, WorkflowStatus } from '@/data/types'

const PIPELINE_STEPS: Array<{
  status: WorkflowStatus
  label: string
  icon: React.ElementType
}> = [
  { status: 'mapeado', label: 'Mapeado', icon: MapPin },
  { status: 'app_em_criacao', label: 'App em criação', icon: HardDrives },
  { status: 'app_pronto', label: 'App pronto', icon: Package },
  { status: 'implantado', label: 'Implantado', icon: CloudArrowUp },
  { status: 'agente_treinando', label: 'Agente treinando', icon: Brain },
  { status: 'agente_ativo', label: 'Agente ativo', icon: Robot },
]

const STATUS_ORDER: WorkflowStatus[] = [
  'mapeado',
  'app_em_criacao',
  'app_pronto',
  'implantado',
  'agente_treinando',
  'agente_ativo',
]

function stepIndex(status: WorkflowStatus) {
  return STATUS_ORDER.indexOf(status)
}

interface Props {
  workflow: Workflow
  onClose: () => void
}

export function WorkflowDetailPanel({ workflow, onClose }: Props) {
  const { updateWorkflowStatus } = useWorkflows()
  const [loading, setLoading] = useState(false)
  const [loadingLabel, setLoadingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [heartbeatActive, setHeartbeatActive] = useState(workflow.status === 'agente_ativo')
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // sync heartbeat if the workflow arrives already active
  useEffect(() => {
    if (workflow.status === 'agente_ativo') setHeartbeatActive(true)
  }, [workflow.status])

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [])

  function advance(toStatus: WorkflowStatus) {
    updateWorkflowStatus(workflow.id, toStatus)
  }

  function startTrainingProgress() {
    setProgress(0)
    let current = 0
    progressInterval.current = setInterval(() => {
      current += 2
      setProgress(current)
      if (current >= 100) {
        clearInterval(progressInterval.current!)
        progressInterval.current = null
        advance('agente_ativo')
        setHeartbeatActive(true)
      }
    }, 100) // 100ms × 50 steps = 5s
  }

  async function handleGerarApp() {
    setLoading(true)
    setLoadingLabel('Gerando app…')
    await delay(2000)
    advance('app_em_criacao')
    setLoadingLabel('Compilando…')
    await delay(3000)
    advance('app_pronto')
    setLoading(false)
    setLoadingLabel('')
  }

  async function handleImplantar() {
    setLoading(true)
    setLoadingLabel('Implantando…')
    await delay(1000)
    advance('implantado')
    setLoading(false)
    setLoadingLabel('')
  }

  async function handleIniciarTreinamento() {
    setLoading(true)
    setLoadingLabel('Iniciando treinamento…')
    await delay(2000)
    advance('agente_treinando')
    setLoading(false)
    setLoadingLabel('')
    startTrainingProgress()
  }

  const currentIndex = stepIndex(workflow.status)

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 leading-tight">{workflow.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{workflow.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-3 shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Stepper */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Pipeline de deploy</p>

        {/* Horizontal stepper */}
        <div className="relative">
          {/* connector line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-blue-500 transition-all duration-700"
            style={{ width: currentIndex === 0 ? 0 : `calc(${(currentIndex / 5) * 100}% - 8px)` }}
          />

          <div className="relative flex justify-between">
            {PIPELINE_STEPS.map((step, idx) => {
              const done = idx < currentIndex
              const active = idx === currentIndex
              const future = idx > currentIndex

              const Icon = step.icon

              return (
                <div key={step.status} className="flex flex-col items-center gap-1.5" style={{ width: '16.67%' }}>
                  {/* Circle */}
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${done ? 'bg-blue-600 border-blue-600' : ''}
                      ${active ? 'bg-white border-blue-600 shadow-sm shadow-blue-100' : ''}
                      ${future ? 'bg-white border-slate-200' : ''}
                    `}
                  >
                    {done ? (
                      <Check size={14} weight="bold" className="text-white" />
                    ) : (
                      <Icon
                        size={15}
                        weight="duotone"
                        className={active ? 'text-blue-600' : 'text-slate-300'}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-center leading-tight text-[10px] font-medium
                      ${active ? 'text-blue-700' : done ? 'text-slate-600' : 'text-slate-300'}
                    `}
                    style={{ maxWidth: '52px' }}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action area */}
      <div className="px-5 flex-1 overflow-y-auto">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-2 py-3 text-sm text-blue-600">
            <CircleNotch size={16} className="animate-spin" />
            <span>{loadingLabel}</span>
          </div>
        )}

        {/* Progress bar during agente_treinando */}
        {workflow.status === 'agente_treinando' && !loading && (
          <div className="mt-2 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-amber-700">Treinamento em andamento</span>
              <span className="text-xs text-amber-600 font-mono">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              O agente está aprendendo os padrões do workflow…
            </p>
          </div>
        )}

        {/* Heartbeat — agente ativo */}
        {workflow.status === 'agente_ativo' && (
          <div className="flex flex-col items-center py-8 gap-4">
            {/* Heartbeat animation */}
            <div className="relative flex items-center justify-center">
              {heartbeatActive && (
                <>
                  <span className="absolute w-16 h-16 rounded-full bg-emerald-400 opacity-20 animate-ping" style={{ animationDuration: '1.5s' }} />
                  <span className="absolute w-12 h-12 rounded-full bg-emerald-400 opacity-30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                  <span className="absolute w-8 h-8 rounded-full bg-emerald-400 opacity-40 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }} />
                </>
              )}
              <div className="relative w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                <Robot size={28} weight="duotone" className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-emerald-700">Agente ativo</p>
              <p className="text-sm text-slate-500 mt-0.5">Heartbeat pulsando — operando autonomamente</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!loading && (
          <div className="mt-4">
            {workflow.status === 'mapeado' && (
              <ActionButton onClick={handleGerarApp} label="Gerar App" />
            )}
            {workflow.status === 'app_pronto' && (
              <ActionButton onClick={handleImplantar} label="Implantar" />
            )}
            {workflow.status === 'implantado' && (
              <ActionButton onClick={handleIniciarTreinamento} label="Iniciar Treinamento" />
            )}
          </div>
        )}
      </div>

      {/* Footer meta */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
        <span>Dept: <span className="font-medium text-slate-500">{workflow.department}</span></span>
        <ArrowRight size={12} />
        <span>
          Criado em{' '}
          {new Date(workflow.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  )
}

function ActionButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
    >
      {label}
      <ArrowRight size={15} weight="bold" />
    </button>
  )
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
