import { Robot, Pulse, Lightbulb, GitBranch, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { agents } from '@/data'
import { useWorkflows } from '@/contexts/WorkflowContext'

const agent = agents[0]!

export function AgentsPage() {
  const { workflows } = useWorkflows()
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
          <Robot size={22} weight="duotone" className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Agentes</h1>
          <p className="text-sm text-stone-400">Seu assistente de negócios</p>
        </div>
      </div>

      {/* Agent card */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Robot size={24} weight="duotone" className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-800">{agent.name}</h2>
              <p className="text-sm text-stone-400">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pulse size={16} className="text-green-500 animate-pulse" weight="duotone" />
            <span className="text-xs font-medium text-green-600">{agent.status}</span>
          </div>
        </div>

        {/* Training progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Treinamento</span>
            <span className="font-medium text-amber-600">{agent.trainingProgress}%</span>
          </div>
          <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
              style={{ width: `${agent.trainingProgress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 rounded-xl transition-colors">
            Pausar
          </button>
          <button className="flex-1 border border-amber-200 hover:bg-amber-50 text-amber-700 text-sm font-medium py-2 rounded-xl transition-colors">
            Conversar
          </button>
        </div>
      </div>

      {/* Hints */}
      {agent.hints && agent.hints.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
            <Lightbulb size={16} weight="duotone" className="text-amber-500" />
            Sugestões autônomas
          </h3>
          {agent.hints.filter(h => !h.dismissed).map((hint) => (
            <div key={hint.id} className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-sm text-stone-700">{hint.suggestion}</p>
              <div className="flex gap-2 mt-3">
                <button className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
                  Sim, pode assumir
                </button>
                <button className="text-xs text-stone-400 hover:text-stone-600 px-3 py-1.5 rounded-lg transition-colors">
                  Não agora
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workflows shortcut */}
      <Link
        to="/agents/workflows"
        className="block bg-white rounded-2xl border border-amber-100 shadow-sm p-5 hover:shadow-md hover:border-amber-200 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <GitBranch size={18} weight="duotone" className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800">Workflows</h3>
              <p className="text-xs text-stone-400">{workflows.length} processo{workflows.length !== 1 ? 's' : ''} mapeado{workflows.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <ArrowRight size={18} weight="bold" className="text-stone-300" />
        </div>
      </Link>

      {/* Recent activities */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-amber-50">
          <h3 className="font-semibold text-stone-700">Atividades recentes</h3>
        </div>
        <div className="divide-y divide-amber-50">
          {agent.activities.map((act) => (
            <div key={act.id} className="px-5 py-4">
              <p className="text-sm text-stone-700">{act.description}</p>
              <p className="text-xs text-stone-400 mt-1">
                {new Date(act.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
