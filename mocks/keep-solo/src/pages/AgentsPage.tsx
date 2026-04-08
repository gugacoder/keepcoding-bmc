// React imports moved below
import {
  Robot,
  Pulse,
  Lightbulb,
  GitBranch,
  ArrowRight,
  Brain,
  CaretDown,
  CaretUp,
  Check,
  X,
  PauseCircle,
  PlayCircle,
  Tag,
  Plus,
  Trash,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useAgents } from '@/contexts/AgentsContext'
import { useWorkflows } from '@/contexts/WorkflowContext'
import { SkeletonPanel } from '@/components/Skeleton'
import { Badge, IconBubble, type BadgeColor } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import type { MemoryItem } from '@/data/types'

const CATEGORY_CONFIG: Record<MemoryItem['category'], { label: string; color: BadgeColor }> = {
  operações: { label: 'Operações', color: 'blue' },
  preferências: { label: 'Preferências', color: 'orange' },
  regras: { label: 'Regras', color: 'rose' },
}

const CATEGORIES: MemoryItem['category'][] = ['operações', 'preferências', 'regras']

export function AgentsPage() {
  const { agent: agentSource, addMemoryItem, removeMemoryItem } = useAgents()
  const { workflows } = useWorkflows()
  const [isPaused, setIsPaused] = useState(false)
  const [memoryExpanded, setMemoryExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set())
  const [acceptedHints, setAcceptedHints] = useState<Set<string>>(new Set())

  // Memory management state
  const [removeTarget, setRemoveTarget] = useState<MemoryItem | null>(null)
  const [teachOpen, setTeachOpen] = useState(false)
  const [teachCategory, setTeachCategory] = useState<MemoryItem['category']>('operações')
  const [teachText, setTeachText] = useState('')

  const agent = { ...agentSource, status: isPaused ? ('Idle' as const) : agentSource.status }
  const activeHints = agentSource.hints.filter(
    (h) => !h.dismissed && !dismissedHints.has(h.id) && !acceptedHints.has(h.id)
  )

  // Group memory by category
  const memoriesByCategory = agentSource.memory.reduce<Record<string, typeof agentSource.memory>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category]!.push(item)
      return acc
    },
    {}
  )

  function handleTeachSubmit() {
    const text = teachText.trim()
    if (!text) return
    addMemoryItem({ category: teachCategory, content: text })
    setTeachText('')
    setTeachOpen(false)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <SkeletonPanel />
        <SkeletonPanel />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* Remove memory confirm dialog */}
      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-3xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <IconBubble color="rose" size="lg">
                <Trash weight="duotone" size={18} />
              </IconBubble>
              <h3 className="font-bold text-foreground">Remover memória</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Tem certeza que deseja remover este item?</p>
            <p className="text-sm text-foreground bg-secondary rounded-2xl p-3 mb-6 leading-relaxed">
              "{removeTarget.content}"
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRemoveTarget(null)}
                className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { removeMemoryItem(removeTarget.id); setRemoveTarget(null) }}
                className="px-4 py-2 text-sm text-white bg-rose-500 hover:bg-rose-600 rounded-2xl transition-colors font-semibold"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
      {/* LEFT COLUMN — Agent card + Memory + Activities */}
      <div className="col-span-1 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <IconBubble color="amber" size="xl">
            <Robot size={22} weight="duotone" />
          </IconBubble>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Meu Agente</h1>
            <p className="text-sm text-muted-foreground">Assistente pessoal de negócios</p>
          </div>
        </div>

        {/* Main Agent Card */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          {/* Card header with gradient */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 pb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <Robot size={28} weight="duotone" className="text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{agent.name}</h2>
                  <p className="text-sm text-amber-100">{agent.role}</p>
                </div>
              </div>
              {/* Status badge */}
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                {isPaused ? (
                  <PauseCircle size={14} weight="fill" className="text-white" />
                ) : (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200" />
                  </span>
                )}
                <span className="text-xs font-semibold text-white">
                  {isPaused ? 'Pausado' : agent.status}
                </span>
              </div>
            </div>
          </div>

          {/* Heartbeat visual — 3 rings (only when active) */}
          <div className="relative -mt-5 flex justify-center">
            <div className="relative">
              {!isPaused && (
                <>
                  <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-amber-200 opacity-30 -top-1 -left-1" />
                  <span
                    className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-300 opacity-20"
                    style={{ animationDelay: '0.3s', top: 0, left: 0 }}
                  />
                </>
              )}
              <div
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md ${
                  isPaused
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-card text-accent-foreground'
                }`}
              >
                <Pulse
                  size={16}
                  weight="duotone"
                  className={isPaused ? 'text-muted-foreground' : 'text-primary animate-pulse'}
                />
                {isPaused ? 'Heartbeat pausado' : 'Heartbeat ativo'}
              </div>
            </div>
          </div>

          {/* Training progress */}
          <div className="px-6 pt-5 pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Treinamento</span>
              <span className="font-semibold text-accent-foreground">{agent.trainingProgress}%</span>
            </div>
            <div className="h-2.5 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${agent.trainingProgress}%` }}
              />
            </div>
          </div>

          {/* Controls — Pause/Resume toggle (no dialog) */}
          <div className="px-6 pt-4 pb-6 flex gap-3">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-2xl transition-all ${
                isPaused
                  ? 'bg-primary hover:bg-primary/80 text-primary-foreground shadow-sm'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {isPaused ? (
                <>
                  <PlayCircle size={18} weight="duotone" />
                  Retomar
                </>
              ) : (
                <>
                  <PauseCircle size={18} weight="duotone" />
                  Pausar
                </>
              )}
            </button>
            <Link
              to="/agents/chat"
              className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-secondary text-secondary-foreground text-sm font-semibold py-3 rounded-2xl transition-all"
            >
              Conversar
            </Link>
          </div>
        </div>

        {/* Memory Section — expandable */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <button
            onClick={() => setMemoryExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between p-5 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconBubble color="amber">
                <Brain size={16} weight="duotone" />
              </IconBubble>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">Memória</h3>
                <p className="text-xs text-muted-foreground">{agentSource.memory.length} itens armazenados</p>
              </div>
            </div>
            {memoryExpanded ? (
              <CaretUp size={16} weight="bold" className="text-muted-foreground" />
            ) : (
              <CaretDown size={16} weight="bold" className="text-muted-foreground" />
            )}
          </button>

          {memoryExpanded && (
            <div className="border-t border-border/50">
              {/* Ensinar algo novo */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {agentSource.memory.length} {agentSource.memory.length === 1 ? 'item' : 'itens'}
                </span>
                <button
                  onClick={() => setTeachOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-secondary-foreground bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Plus size={12} weight="bold" />
                  Ensinar algo novo
                </button>
              </div>

              {/* Teach form */}
              {teachOpen && (
                <div className="mx-5 mb-4 bg-secondary rounded-2xl p-4 space-y-3 border border-border">
                  <p className="text-xs font-semibold text-foreground">Novo item de memória</p>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Categoria</label>
                    <select
                      value={teachCategory}
                      onChange={(e) => setTeachCategory(e.target.value as MemoryItem['category'])}
                      className="w-full text-xs border border-border rounded-xl px-3 py-1.5 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_CONFIG[cat].label}
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
                      placeholder="Ex: Clientes preferem atendimento por WhatsApp..."
                      className="w-full text-xs border border-border rounded-xl px-3 py-2 bg-card text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setTeachOpen(false); setTeachText('') }}
                      className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleTeachSubmit}
                      disabled={!teachText.trim()}
                      className="px-3 py-1.5 text-xs text-primary-foreground bg-primary hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors font-semibold"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="divide-y divide-border/50">
                {CATEGORIES.map((category) => {
                  const items = memoriesByCategory[category] ?? []
                  return (
                    <div key={category} className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={12} weight="duotone" className="text-muted-foreground" />
                        <Badge color={CATEGORY_CONFIG[category].color}>
                          {CATEGORY_CONFIG[category].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground/50 ml-auto">{items.length}</span>
                      </div>
                      {items.length === 0 ? (
                        <p className="text-xs text-muted-foreground/50 pl-1">Nenhum item ainda</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-2 group bg-secondary/50 hover:bg-secondary rounded-xl p-3 transition-colors"
                            >
                              <p className="flex-1 text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                              <button
                                onClick={() => setRemoveTarget(item)}
                                className="flex-shrink-0 p-1 text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
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
              </div>
            </div>
          )}
        </div>

        {/* Workflows shortcut */}
        <Link
          to="/agents/workflows"
          className="block bg-card rounded-3xl border border-border shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBubble color="amber" size="lg">
                <GitBranch size={18} weight="duotone" />
              </IconBubble>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Workflows</h3>
                <p className="text-xs text-muted-foreground">
                  {workflows.length} processo{workflows.length !== 1 ? 's' : ''} mapeado
                  {workflows.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ArrowRight size={18} weight="bold" className="text-muted-foreground/50" />
          </div>
        </Link>
      </div>

      {/* RIGHT COLUMN — Hints + Recent activities */}
      <div className="col-span-1 space-y-5">
        {/* Hints Section */}
        {activeHints.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Lightbulb size={16} weight="duotone" className="text-primary" />
              <h3 className="text-sm font-semibold text-muted-foreground">Sugestões autônomas</h3>
              <Badge color="amber" className="ml-auto">
                {activeHints.length}
              </Badge>
            </div>
            {activeHints.map((hint) => (
              <div
                key={hint.id}
                className="bg-secondary rounded-3xl p-5 border border-border shadow-sm"
              >
                <p className="text-sm text-foreground leading-relaxed">{hint.suggestion}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setAcceptedHints((prev) => new Set([...prev, hint.id]))}
                    className="flex items-center gap-1.5 text-xs bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-xl transition-colors font-semibold shadow-sm"
                  >
                    <Check size={13} weight="bold" />
                    Sim, pode assumir
                  </button>
                  <button
                    onClick={() => setDismissedHints((prev) => new Set([...prev, hint.id]))}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl transition-colors hover:bg-muted"
                  >
                    <X size={13} weight="bold" />
                    Não agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border/50">
            <h3 className="font-semibold text-foreground text-sm">Atividades recentes</h3>
          </div>
          <div className="divide-y divide-border/50">
            {agent.activities.map((act) => (
              <div key={act.id} className="px-5 py-4 flex items-start gap-3">
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    act.type === 'completed'
                      ? 'bg-green-400'
                      : act.type === 'alert'
                        ? 'bg-rose-400'
                        : 'bg-primary'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm text-foreground leading-snug">{act.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(act.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
