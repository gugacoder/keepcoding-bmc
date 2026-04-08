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
  Plus,
  Tag,
  Trash,
} from '@phosphor-icons/react'
import type { Agent, AgentStatus, MemoryItem } from '@/data/types'
import { useAgents } from '@/contexts/AgentsContext'
import { AgentAvatar } from '@/components/AgentAvatar'

const STATUS_COLOR: Record<AgentStatus, string> = {
  Working: 'bg-success/10 text-success',
  Idle: 'bg-muted text-muted-foreground',
  'Waiting on data': 'bg-warning/10 text-warning',
}

const STATUS_DOT: Record<AgentStatus, string> = {
  Working: 'bg-success animate-pulse',
  Idle: 'bg-muted-foreground',
  'Waiting on data': 'bg-warning',
}

const ACTIVITY_ICON: Record<string, React.ElementType> = {
  action: ArrowRight,
  decision: Brain,
  alert: Warning,
  completed: CheckCircle,
}

const ACTIVITY_COLOR: Record<string, string> = {
  action: 'text-info bg-info/10',
  decision: 'text-violet bg-violet/10',
  alert: 'text-warning bg-warning/10',
  completed: 'text-success bg-success/10',
}

const CATEGORY_LABELS: Record<MemoryItem['category'], string> = {
  operações: 'Operações',
  preferências: 'Preferências',
  regras: 'Regras',
}

const CATEGORY_COLORS: Record<MemoryItem['category'], string> = {
  operações: 'bg-info/10 text-info border-info/20',
  preferências: 'bg-violet/10 text-violet border-violet/20',
  regras: 'bg-rose/10 text-rose border-rose/20',
}

const CATEGORY_BADGE: Record<MemoryItem['category'], string> = {
  operações: 'bg-info/10 text-info',
  preferências: 'bg-violet/10 text-violet',
  regras: 'bg-rose/10 text-rose',
}

const CATEGORIES: MemoryItem['category'][] = ['operações', 'preferências', 'regras']

type Tab = 'status' | 'atividades' | 'treinamento' | 'memória'

interface ConfirmDialogProps {
  action: 'play' | 'pause'
  agentName: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ action, agentName, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-md shadow-xl p-6 w-80 mx-4">
        <div className="flex items-center gap-3 mb-4">
          {action === 'play' ? (
            <Play weight="duotone" size={24} className="text-success" />
          ) : (
            <Pause weight="duotone" size={24} className="text-warning" />
          )}
          <h3 className="font-semibold text-foreground">
            {action === 'play' ? 'Ativar agente' : 'Pausar agente'}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {action === 'play'
            ? `Confirma a ativação de "${agentName}"? O agente começará a executar tarefas automaticamente.`
            : `Confirma a pausa de "${agentName}"? As tarefas em andamento serão suspensas.`}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-sm text-white rounded transition-colors ${
              action === 'play'
                ? 'bg-success hover:bg-success/90'
                : 'bg-warning hover:bg-warning/90'
            }`}
          >
            {action === 'play' ? 'Ativar' : 'Pausar'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface RemoveMemoryDialogProps {
  item: MemoryItem
  onConfirm: () => void
  onCancel: () => void
}

function RemoveMemoryDialog({ item, onConfirm, onCancel }: RemoveMemoryDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-md shadow-xl p-6 w-80 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <Trash weight="duotone" size={22} className="text-rose" />
          <h3 className="font-semibold text-foreground">Remover memória</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">Tem certeza que deseja remover este item?</p>
        <p className="text-xs text-muted-foreground bg-muted rounded p-2 mb-6 leading-relaxed">
          "{item.content}"
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-sm text-white bg-rose hover:bg-rose/90 rounded transition-colors"
          >
            Remover
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
  const { agents, addMemoryItem, removeMemoryItem } = useAgents()

  // Get live agent data from context (reflects memory mutations)
  const liveAgent = agents.find((a) => a.id === agent.id) ?? agent

  const [activeTab, setActiveTab] = useState<Tab>('status')
  const [isActive, setIsActive] = useState(agent.status === 'Working')
  const [confirm, setConfirm] = useState<'play' | 'pause' | null>(null)
  const [removeTarget, setRemoveTarget] = useState<MemoryItem | null>(null)

  // "Ensinar algo novo" form state
  const [teachOpen, setTeachOpen] = useState(false)
  const [teachCategory, setTeachCategory] = useState<MemoryItem['category']>('operações')
  const [teachText, setTeachText] = useState('')

  function handleToggle() {
    setConfirm(isActive ? 'pause' : 'play')
  }

  function handleConfirm() {
    setIsActive(!isActive)
    setConfirm(null)
  }

  function handleRemoveConfirm() {
    if (removeTarget) {
      removeMemoryItem(liveAgent.id, removeTarget.id)
      setRemoveTarget(null)
    }
  }

  function handleTeachSubmit() {
    const text = teachText.trim()
    if (!text) return
    addMemoryItem(liveAgent.id, { category: teachCategory, content: text })
    setTeachText('')
    setTeachOpen(false)
  }

  // Group memory by category
  const memoriesByCategory = liveAgent.memory.reduce<Record<string, MemoryItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category]!.push(item)
      return acc
    },
    {}
  )

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: 'status', label: 'Status' },
    { id: 'atividades', label: 'Atividades' },
    { id: 'treinamento', label: 'Treino' },
    { id: 'memória', label: 'Memória' },
  ]

  return (
    <>
      {confirm && (
        <ConfirmDialog
          action={confirm}
          agentName={liveAgent.name}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {removeTarget && (
        <RemoveMemoryDialog
          item={removeTarget}
          onConfirm={handleRemoveConfirm}
          onCancel={() => setRemoveTarget(null)}
        />
      )}

      <div className="flex flex-col h-full bg-card border-l border-border">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <AgentAvatar agent={liveAgent} size="md" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">{liveAgent.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{liveAgent.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status badge + Conversar */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLOR[liveAgent.status]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[liveAgent.status]}`} />
              {liveAgent.status}
            </span>
            <span className="text-xs px-2 py-0.5 bg-info/10 text-info rounded font-medium">
              {liveAgent.department}
            </span>
          </div>
          <button
            onClick={() => navigate('/agents/chat', { state: { agentId: liveAgent.id } })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-info/10 hover:bg-info/10 rounded transition-colors"
          >
            <ChatCircle weight="duotone" size={14} />
            Conversar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
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
              <div className="bg-muted rounded-md p-4">
                <p className="text-xs text-muted-foreground mb-3">Controle do agente</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-warning hover:bg-warning/90 text-white'
                        : 'bg-success hover:bg-success/90 text-white'
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
                  <span className="text-xs text-muted-foreground">
                    {isActive ? 'Agente em execução' : 'Agente pausado'}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Heartbeat</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    {liveAgent.heartbeat ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        Inativo
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Último ativo</span>
                  <span className="font-medium text-foreground">
                    {new Date(liveAgent.lastActive).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Treinamento</span>
                  <span className="font-medium text-foreground">{liveAgent.trainingProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'atividades' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-4">Ações recentes do agente</p>
              {liveAgent.activities.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Sem atividades registradas</p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-4">
                    {liveAgent.activities.map((act) => {
                      const Icon = ACTIVITY_ICON[act.type] ?? Lightning
                      const colors = ACTIVITY_COLOR[act.type] ?? 'text-muted-foreground bg-muted'
                      return (
                        <div key={act.id} className="flex gap-3 relative">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}
                          >
                            <Icon size={14} weight="duotone" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-xs text-foreground leading-relaxed">
                              {act.description}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
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
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-medium">Progresso de treinamento</span>
                  <span className="font-semibold text-primary">{liveAgent.trainingProgress}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-info rounded-full transition-all"
                    style={{ width: `${liveAgent.trainingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {liveAgent.trainingProgress < 60
                    ? 'Treinamento inicial em andamento'
                    : liveAgent.trainingProgress < 85
                    ? 'Aprendendo padrões avançados'
                    : 'Treinamento avançado — quase autônomo'}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-3">Refine o comportamento do agente via chat</p>
                <button
                  onClick={() => navigate('/agents/chat', { state: { agentId: liveAgent.id } })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded transition-colors"
                >
                  <ChatCircle weight="duotone" size={16} />
                  Refinar via chat
                </button>
              </div>
            </div>
          )}

          {activeTab === 'memória' && (
            <div className="space-y-5">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain weight="duotone" size={16} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {liveAgent.memory.length} {liveAgent.memory.length === 1 ? 'item' : 'itens'} armazenados
                  </span>
                </div>
                <button
                  onClick={() => setTeachOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-info/10 hover:bg-info/10 rounded transition-colors"
                >
                  <Plus size={12} weight="bold" />
                  Ensinar algo novo
                </button>
              </div>

              {/* "Ensinar algo novo" form */}
              {teachOpen && (
                <div className="bg-muted rounded-md p-4 space-y-3 border border-border">
                  <p className="text-xs font-medium text-foreground">Novo item de memória</p>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Categoria</label>
                    <select
                      value={teachCategory}
                      onChange={(e) => setTeachCategory(e.target.value as MemoryItem['category'])}
                      className="w-full text-xs border border-border rounded px-2 py-1.5 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">O que o agente deve saber?</label>
                    <textarea
                      value={teachText}
                      onChange={(e) => setTeachText(e.target.value)}
                      rows={3}
                      placeholder="Ex: Relatórios devem ser enviados sempre em PDF..."
                      className="w-full text-xs border border-border rounded px-2 py-1.5 bg-card text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setTeachOpen(false); setTeachText('') }}
                      className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent rounded transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleTeachSubmit}
                      disabled={!teachText.trim()}
                      className="px-3 py-1.5 text-xs text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {/* Memory by category */}
              {CATEGORIES.map((category) => {
                const items = memoriesByCategory[category] ?? []
                return (
                  <div key={category}>
                    <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${CATEGORY_COLORS[category]}`}>
                      <Tag size={11} weight="duotone" />
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_BADGE[category]}`}>
                        {CATEGORY_LABELS[category]}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">{items.length} itens</span>
                    </div>
                    {items.length === 0 ? (
                      <p className="text-xs text-muted-foreground pl-1 py-2">Nenhum item nesta categoria</p>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-2 group bg-muted hover:bg-accent rounded-md p-2.5 transition-colors"
                          >
                            <p className="flex-1 text-xs text-foreground leading-relaxed">{item.content}</p>
                            <button
                              onClick={() => setRemoveTarget(item)}
                              className="flex-shrink-0 p-1 text-muted-foreground hover:text-rose hover:bg-rose/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Remover"
                            >
                              <X size={12} weight="bold" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {liveAgent.memory.length === 0 && (
                <div className="text-center py-8">
                  <Brain weight="duotone" size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-xs text-muted-foreground">Nenhuma memória registrada ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">Use "Ensinar algo novo" para começar</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
