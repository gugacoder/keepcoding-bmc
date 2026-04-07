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
import { useState, useEffect } from 'react'
import type { MemoryItem } from '@/data/types'

const CATEGORY_LABELS: Record<MemoryItem['category'], string> = {
  operações: 'Operações',
  preferências: 'Preferências',
  regras: 'Regras',
}

const CATEGORY_COLORS: Record<MemoryItem['category'], string> = {
  operações: 'bg-amber-100 text-amber-700',
  preferências: 'bg-orange-100 text-orange-700',
  regras: 'bg-rose-100 text-rose-700',
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
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Trash weight="duotone" size={18} className="text-rose-500" />
              </div>
              <h3 className="font-bold text-stone-800">Remover memória</h3>
            </div>
            <p className="text-sm text-stone-500 mb-2">Tem certeza que deseja remover este item?</p>
            <p className="text-sm text-stone-700 bg-amber-50 rounded-2xl p-3 mb-6 leading-relaxed">
              "{removeTarget.content}"
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRemoveTarget(null)}
                className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded-2xl transition-colors"
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
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Robot size={22} weight="duotone" className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-800">Meu Agente</h1>
            <p className="text-sm text-stone-400">Assistente pessoal de negócios</p>
          </div>
        </div>

        {/* Main Agent Card */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
          {/* Card header with gradient */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 pb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Robot size={28} weight="duotone" className="text-white" />
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
                    ? 'bg-stone-100 text-stone-500'
                    : 'bg-white text-amber-600'
                }`}
              >
                <Pulse
                  size={16}
                  weight="duotone"
                  className={isPaused ? 'text-stone-400' : 'text-amber-500 animate-pulse'}
                />
                {isPaused ? 'Heartbeat pausado' : 'Heartbeat ativo'}
              </div>
            </div>
          </div>

          {/* Training progress */}
          <div className="px-6 pt-5 pb-2">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Treinamento</span>
              <span className="font-semibold text-amber-600">{agent.trainingProgress}%</span>
            </div>
            <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
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
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
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
              className="flex-1 flex items-center justify-center gap-2 border border-amber-200 hover:bg-amber-50 text-amber-700 text-sm font-semibold py-3 rounded-2xl transition-all"
            >
              Conversar
            </Link>
          </div>
        </div>

        {/* Memory Section — expandable */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setMemoryExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between p-5 hover:bg-amber-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <Brain size={16} weight="duotone" className="text-amber-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-stone-800">Memória</h3>
                <p className="text-xs text-stone-400">{agentSource.memory.length} itens armazenados</p>
              </div>
            </div>
            {memoryExpanded ? (
              <CaretUp size={16} weight="bold" className="text-stone-400" />
            ) : (
              <CaretDown size={16} weight="bold" className="text-stone-400" />
            )}
          </button>

          {memoryExpanded && (
            <div className="border-t border-amber-50">
              {/* Ensinar algo novo */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {agentSource.memory.length} {agentSource.memory.length === 1 ? 'item' : 'itens'}
                </span>
                <button
                  onClick={() => setTeachOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Plus size={12} weight="bold" />
                  Ensinar algo novo
                </button>
              </div>

              {/* Teach form */}
              {teachOpen && (
                <div className="mx-5 mb-4 bg-amber-50 rounded-2xl p-4 space-y-3 border border-amber-100">
                  <p className="text-xs font-semibold text-stone-700">Novo item de memória</p>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Categoria</label>
                    <select
                      value={teachCategory}
                      onChange={(e) => setTeachCategory(e.target.value as MemoryItem['category'])}
                      className="w-full text-xs border border-amber-200 rounded-xl px-3 py-1.5 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">O que o agente deve saber?</label>
                    <textarea
                      value={teachText}
                      onChange={(e) => setTeachText(e.target.value)}
                      rows={3}
                      placeholder="Ex: Clientes preferem atendimento por WhatsApp..."
                      className="w-full text-xs border border-amber-200 rounded-xl px-3 py-2 bg-white text-stone-700 resize-none focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-stone-300"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setTeachOpen(false); setTeachText('') }}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:bg-amber-100 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleTeachSubmit}
                      disabled={!teachText.trim()}
                      className="px-3 py-1.5 text-xs text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors font-semibold"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="divide-y divide-amber-50">
                {CATEGORIES.map((category) => {
                  const items = memoriesByCategory[category] ?? []
                  return (
                    <div key={category} className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={12} weight="duotone" className="text-stone-400" />
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[category]}`}
                        >
                          {CATEGORY_LABELS[category]}
                        </span>
                        <span className="text-xs text-stone-300 ml-auto">{items.length}</span>
                      </div>
                      {items.length === 0 ? (
                        <p className="text-xs text-stone-300 pl-1">Nenhum item ainda</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-2 group bg-amber-50/50 hover:bg-amber-50 rounded-xl p-3 transition-colors"
                            >
                              <p className="flex-1 text-sm text-stone-600 leading-relaxed">{item.content}</p>
                              <button
                                onClick={() => setRemoveTarget(item)}
                                className="flex-shrink-0 p-1 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
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
          className="block bg-white rounded-3xl border border-amber-100 shadow-sm p-5 hover:shadow-md hover:border-amber-200 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <GitBranch size={18} weight="duotone" className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-800">Workflows</h3>
                <p className="text-xs text-stone-400">
                  {workflows.length} processo{workflows.length !== 1 ? 's' : ''} mapeado
                  {workflows.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ArrowRight size={18} weight="bold" className="text-stone-300" />
          </div>
        </Link>
      </div>

      {/* RIGHT COLUMN — Hints + Recent activities */}
      <div className="col-span-1 space-y-5">
        {/* Hints Section */}
        {activeHints.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Lightbulb size={16} weight="duotone" className="text-amber-500" />
              <h3 className="text-sm font-semibold text-stone-600">Sugestões autônomas</h3>
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                {activeHints.length}
              </span>
            </div>
            {activeHints.map((hint) => (
              <div
                key={hint.id}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-100 shadow-sm"
              >
                <p className="text-sm text-stone-700 leading-relaxed">{hint.suggestion}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setAcceptedHints((prev) => new Set([...prev, hint.id]))}
                    className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors font-semibold shadow-sm"
                  >
                    <Check size={13} weight="bold" />
                    Sim, pode assumir
                  </button>
                  <button
                    onClick={() => setDismissedHints((prev) => new Set([...prev, hint.id]))}
                    className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 px-3 py-2 rounded-xl transition-colors hover:bg-stone-100"
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
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-amber-50">
            <h3 className="font-semibold text-stone-700 text-sm">Atividades recentes</h3>
          </div>
          <div className="divide-y divide-amber-50">
            {agent.activities.map((act) => (
              <div key={act.id} className="px-5 py-4 flex items-start gap-3">
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    act.type === 'completed'
                      ? 'bg-green-400'
                      : act.type === 'alert'
                        ? 'bg-rose-400'
                        : 'bg-amber-400'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm text-stone-700 leading-snug">{act.description}</p>
                  <p className="text-xs text-stone-400 mt-1">
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
