import { useState, useEffect, useRef, useMemo } from 'react'
import {
  X,
  MapPin,
  HardDrives,
  Package,
  CloudArrowUp,
  Brain,
  Heartbeat,
  Robot,
  Check,
  CircleNotch,
  ArrowRight,
  Lightning,
} from '@phosphor-icons/react'
import { useWorkflows } from '@/contexts/WorkflowContext'
import { useAgents } from '@/contexts/AgentsContext'
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
  { status: 'agente_treinando', label: 'Treinando', icon: Brain },
  { status: 'agente_pronto', label: 'Pronto', icon: Heartbeat },
  { status: 'agente_ativo', label: 'Ativo', icon: Robot },
]

const STATUS_ORDER: WorkflowStatus[] = [
  'mapeado',
  'app_em_criacao',
  'app_pronto',
  'implantado',
  'agente_treinando',
  'agente_pronto',
  'agente_ativo',
]

function stepIndex(status: WorkflowStatus) {
  return STATUS_ORDER.indexOf(status)
}

interface Particle {
  id: number
  color: string
  x: number
  y: number
  size: number
  rotation: number
  duration: number
  delay: number
}

const CONFETTI_COLORS = [
  '#f59e0b', '#f97316', '#ef4444',
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#84cc16',
]

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 250 + 50),
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 720,
    duration: Math.random() * 0.8 + 0.8,
    delay: Math.random() * 0.4,
  }))
}

interface Props {
  workflow: Workflow
  onClose: () => void
}

export function WorkflowDetailPanel({ workflow, onClose }: Props) {
  const { updateWorkflowStatus } = useWorkflows()
  const { activateFromWorkflow } = useAgents()

  const [loading, setLoading] = useState(false)
  const [loadingLabel, setLoadingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [activating, setActivating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const particles = useMemo(() => generateParticles(40), [])

  useEffect(() => {
    if (workflow.status === 'agente_ativo') {
      setProgress(100)
    }
  }, [workflow.id, workflow.status])

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
        advance('agente_pronto')
      }
    }, 100)
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

  async function handleAtivarHeartbeat() {
    setActivating(true)
    setShowConfetti(true)
    await delay(2600)
    advance('agente_ativo')
    activateFromWorkflow(workflow)
    setShowConfetti(false)
    setActivating(false)
  }

  const currentIndex = stepIndex(workflow.status)
  const heartbeatActive = workflow.status === 'agente_ativo'

  return (
    <div className="flex flex-col h-full bg-card rounded-3xl border border-border shadow-lg relative overflow-hidden">
      {/* Heartbeat activation overlay */}
      {activating && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card/95 backdrop-blur-sm rounded-3xl">
          <div className="relative flex items-center justify-center mb-6">
            <span
              className="absolute rounded-full bg-amber-400"
              style={{
                width: 120, height: 120,
                opacity: 0,
                animation: 'ks-heartbeat-ring 1.2s ease-out 0s 2 forwards',
              }}
            />
            <span
              className="absolute rounded-full bg-orange-400"
              style={{
                width: 120, height: 120,
                opacity: 0,
                animation: 'ks-heartbeat-ring 1.2s ease-out 0.25s 2 forwards',
              }}
            />
            <span
              className="absolute rounded-full bg-amber-300"
              style={{
                width: 120, height: 120,
                opacity: 0,
                animation: 'ks-heartbeat-ring 1.2s ease-out 0.5s 2 forwards',
              }}
            />
            <div
              className="relative w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
              style={{ animation: 'ks-heartbeat-flash 0.4s ease-out 0.3s forwards' }}
            >
              <Robot size={36} weight="duotone" className="text-white" />
            </div>
          </div>

          <p className="text-base font-semibold text-secondary-foreground animate-pulse">Ativando heartbeat…</p>
          <p className="text-sm text-muted-foreground mt-1">Agente assumindo operação autônoma</p>

          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              {particles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: 'absolute',
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    borderRadius: p.size > 8 ? '4px' : '50%',
                    animation: `ks-confetti-fly ${p.duration}s ease-out ${p.delay}s forwards`,
                    // @ts-ignore
                    '--tx': `${p.x}px`,
                    '--ty': `${p.y}px`,
                    '--rot': `${p.rotation}deg`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CSS keyframes */}
      <style>{`
        @keyframes ks-heartbeat-ring {
          0% { transform: scale(0.3); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes ks-heartbeat-flash {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245,158,11,0.8); }
          50% { transform: scale(1.25); box-shadow: 0 0 0 30px rgba(245,158,11,0); }
          100% { transform: scale(1); }
        }
        @keyframes ks-confetti-fly {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border">
        <div>
          <h2 className="text-base font-semibold text-foreground leading-tight">{workflow.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{workflow.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ml-3 shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Stepper */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Pipeline de deploy</p>

        <div className="relative">
          {/* connector line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-accent" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
            style={{ width: currentIndex === 0 ? 0 : `calc(${(currentIndex / 6) * 100}% - 8px)` }}
          />

          <div className="relative flex justify-between">
            {PIPELINE_STEPS.map((step, idx) => {
              const done = idx < currentIndex
              const active = idx === currentIndex
              const future = idx > currentIndex
              const isHeartbeatStep = step.status === 'agente_ativo'
              const Icon = step.icon

              return (
                <div key={step.status} className="flex flex-col items-center gap-1.5" style={{ width: '14.28%' }}>
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${done ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-orange-500' : ''}
                      ${active && isHeartbeatStep ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-orange-500 shadow-sm' : ''}
                      ${active && !isHeartbeatStep ? 'bg-card border-primary shadow-sm' : ''}
                      ${future ? 'bg-card border-border' : ''}
                    `}
                  >
                    {done ? (
                      <Check size={14} weight="bold" className="text-white" />
                    ) : active && isHeartbeatStep ? (
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-8 h-8 rounded-full bg-amber-400 opacity-40 animate-ping" style={{ animationDuration: '1.5s' }} />
                        <span className="absolute w-6 h-6 rounded-full bg-orange-400 opacity-50 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                        <Icon size={15} weight="duotone" className="text-white relative z-10" />
                      </div>
                    ) : (
                      <Icon
                        size={15}
                        weight="duotone"
                        className={active ? 'text-accent-foreground' : 'text-muted-foreground/50'}
                      />
                    )}
                  </div>

                  <span
                    className={`text-center leading-tight text-[10px] font-medium
                      ${active && isHeartbeatStep ? 'text-orange-700 dark:text-orange-400' : ''}
                      ${active && !isHeartbeatStep ? 'text-secondary-foreground' : ''}
                      ${done ? 'text-muted-foreground' : ''}
                      ${future ? 'text-muted-foreground/50' : ''}
                    `}
                    style={{ maxWidth: '44px' }}
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
          <div className="flex items-center gap-2 py-3 text-sm text-accent-foreground">
            <CircleNotch size={16} className="animate-spin" />
            <span>{loadingLabel}</span>
          </div>
        )}

        {/* Progress bar during agente_treinando */}
        {workflow.status === 'agente_treinando' && !loading && (
          <div className="mt-2 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-secondary-foreground">Treinamento em andamento</span>
              <span className="text-xs text-accent-foreground font-mono">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Seu agente está aprendendo os padrões do workflow…
            </p>
          </div>
        )}

        {/* agente_pronto — show Ativar Heartbeat */}
        {workflow.status === 'agente_pronto' && !activating && (
          <div className="mt-4 mb-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Treinamento completo</span>
                <span className="text-xs text-orange-600 dark:text-orange-400 font-mono">100%</span>
              </div>
              <div className="w-full h-3 bg-orange-100 dark:bg-orange-950/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Agente treinado e pronto para operar de forma autônoma.
              </p>
            </div>

            <button
              onClick={handleAtivarHeartbeat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl hover:from-amber-600 hover:to-orange-600 active:from-amber-700 active:to-orange-700 transition-all shadow-md"
            >
              <Heartbeat size={18} weight="duotone" />
              Ativar Heartbeat
              <Lightning size={15} weight="fill" className="text-amber-200" />
            </button>
          </div>
        )}

        {/* agente ativo — continuous heartbeat */}
        {heartbeatActive && !activating && (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-20 h-20 rounded-full bg-amber-300 opacity-20 animate-ping" style={{ animationDuration: '1.8s' }} />
              <span className="absolute w-14 h-14 rounded-full bg-orange-300 opacity-30 animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.4s' }} />
              <span className="absolute w-10 h-10 rounded-full bg-amber-400 opacity-40 animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.8s' }} />
              <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                <Robot size={28} weight="duotone" className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-orange-700 dark:text-orange-400">Agente ativo</p>
              <p className="text-sm text-muted-foreground mt-0.5">Heartbeat pulsando — operando de forma autônoma</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!loading && !activating && (
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
      <div className="px-5 py-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
        <span>
          Criado em{' '}
          {new Date(workflow.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        <ArrowRight size={11} />
        <span className="text-primary font-medium">{workflow.name}</span>
      </div>
    </div>
  )
}

function ActionButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
    >
      {label}
      <ArrowRight size={15} weight="bold" />
    </button>
  )
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
