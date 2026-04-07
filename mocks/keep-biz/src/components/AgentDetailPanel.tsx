import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Play,
  Pause,
  ChatCircle,
  Brain,
  Lightning,
  CheckCircle,
  Warning,
  Clock,
  ArrowRight,
} from '@phosphor-icons/react'
import type { Agent, AgentStatus } from '@/data/types'

const STATUS_COLOR: Record<AgentStatus, string> = {
  Working: 'bg-emerald-100 text-emerald-700',
  Idle: 'bg-slate-100 text-slate-600',
  'Waiting on data': 'bg-amber-100 text-amber-700',
}

const STATUS_DOT: Record<AgentStatus, string> = {
  Working: 'bg-emerald-400 animate-pulse',
  Idle: 'bg-slate-400',
  'Waiting on data': 'bg-amber-400',
}

const ACTIVITY_ICON: Record<string, React.ElementType> = {
  action: ArrowRight,
  decision: Brain,
  alert: Warning,
  completed: CheckCircle,
}

const ACTIVITY_COLOR: Record<string, string> = {
  action: 'text-blue-500 bg-blue-50',
  decision: 'text-violet-500 bg-violet-50',
  alert: 'text-amber-500 bg-amber-50',
  completed: 'text-emerald-500 bg-emerald-50',
}

type Tab = 'status' | 'atividades' | 'treinamento'

interface ConfirmDialogProps {
  action: 'play' | 'pause'
  agentName: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ action, agentName, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-80 mx-4">
        <div className="flex items-center gap-3 mb-4">
          {action === 'play' ? (
            <Play weight="duotone" size={24} className="text-emerald-500" />
          ) : (
            <Pause weight="duotone" size={24} className="text-amber-500" />
          )}
          <h3 className="font-semibold text-slate-900">
            {action === 'play' ? 'Ativar agente' : 'Pausar agente'}
          </h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          {action === 'play'
            ? `Confirma a ativação de "${agentName}"? O agente começará a executar tarefas automaticamente.`
            : `Confirma a pausa de "${agentName}"? As tarefas em andamento serão suspensas.`}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-sm text-white rounded transition-colors ${
              action === 'play'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {action === 'play' ? 'Ativar' : 'Pausar'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  agent: Agent
  onClose: () => void
}

export function AgentDetailPanel({ agent, onClose }: Props) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('status')
  const [isActive, setIsActive] = useState(agent.status === 'Working')
  const [confirm, setConfirm] = useState<'play' | 'pause' | null>(null)

  function handleToggle() {
    setConfirm(isActive ? 'pause' : 'play')
  }

  function handleConfirm() {
    setIsActive(!isActive)
    setConfirm(null)
  }

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: 'status', label: 'Status' },
    { id: 'atividades', label: 'Atividades' },
    { id: 'treinamento', label: 'Treinamento' },
  ]

  return (
    <>
      {confirm && (
        <ConfirmDialog
          action={confirm}
          agentName={agent.name}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex flex-col h-full bg-white border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{agent.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{agent.role}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status badge + Conversar */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLOR[agent.status]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[agent.status]}`} />
              {agent.status}
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
              {agent.department}
            </span>
          </div>
          <button
            onClick={() => navigate('/agents/chat', { state: { agentId: agent.id } })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
          >
            <ChatCircle weight="duotone" size={14} />
            Conversar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Play/Pause control */}
              <div className="bg-slate-50 rounded-md p-4">
                <p className="text-xs text-slate-500 mb-3">Controle do agente</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Pause weight="fill" size={14} />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play weight="fill" size={14} />
                        Ativar
                      </>
                    )}
                  </button>
                  <span className="text-xs text-slate-500">
                    {isActive ? 'Agente em execução' : 'Agente pausado'}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Heartbeat</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    {agent.heartbeat ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        Inativo
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Último ativo</span>
                  <span className="font-medium text-slate-700">
                    {new Date(agent.lastActive).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Treinamento</span>
                  <span className="font-medium text-slate-700">{agent.trainingProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'atividades' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-4">Ações recentes do agente</p>
              {agent.activities.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Sem atividades registradas</p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-200" />
                  <div className="space-y-4">
                    {agent.activities.map((act) => {
                      const Icon = ACTIVITY_ICON[act.type] ?? Lightning
                      const colors = ACTIVITY_COLOR[act.type] ?? 'text-slate-500 bg-slate-50'
                      return (
                        <div key={act.id} className="flex gap-3 relative">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}
                          >
                            <Icon size={14} weight="duotone" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {act.description}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                              <Clock size={10} />
                              {new Date(act.timestamp).toLocaleString('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'treinamento' && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-2">
                  <span className="font-medium">Progresso de treinamento</span>
                  <span className="font-semibold text-blue-600">{agent.trainingProgress}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${agent.trainingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {agent.trainingProgress < 60
                    ? 'Treinamento inicial em andamento'
                    : agent.trainingProgress < 85
                    ? 'Aprendendo padrões avançados'
                    : 'Treinamento avançado — quase autônomo'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 mb-3">Refine o comportamento do agente via chat</p>
                <button
                  onClick={() => navigate('/agents/chat', { state: { agentId: agent.id } })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                >
                  <ChatCircle weight="duotone" size={16} />
                  Refinar via chat
                </button>
              </div>

              {/* Memory preview */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-600 mb-3">
                  Memória ({agent.memory.length} itens)
                </p>
                <div className="space-y-2">
                  {agent.memory.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 text-xs">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium flex-shrink-0 capitalize">
                        {item.category}
                      </span>
                      <span className="text-slate-600 leading-relaxed">{item.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
