import { useState, useEffect } from 'react'
import { Robot } from '@phosphor-icons/react'
import { useAgents } from '@/contexts/AgentsContext'
import { AgentDetailPanel } from '@/components/AgentDetailPanel'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonAgentCard } from '@/components/Skeleton'
import { AgentAvatar } from '@/components/AgentAvatar'
import type { Agent, AgentStatus, Department } from '@/data/types'

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

const DEPARTMENTS: Department[] = ['Financeiro', 'Marketing', 'RH', 'Operações', 'Atendimento']

export function AgentsPage() {
  const { agents } = useAgents()
  const [selected, setSelected] = useState<Agent | null>(null)
  const [deptFilter, setDeptFilter] = useState<Department | 'Todos'>('Todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const visible = deptFilter === 'Todos'
    ? agents
    : agents.filter((a) => a.department === deptFilter)

  const activeDepts = new Set(agents.map((a) => a.department))

  return (
    <div className="flex h-full">
      {/* Main list */}
      <div className={`flex flex-col flex-1 min-w-0 ${selected ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Agent Core</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Central de agentes autônomos por departamento
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-900">
                {agents.filter((a) => a.heartbeat).length}
              </span>{' '}
              ativos de {agents.length}
            </div>
          </div>

          {/* Department filter */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setDeptFilter('Todos')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                deptFilter === 'Todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            {DEPARTMENTS.filter((d) => activeDepts.has(d)).map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                  deptFilter === dept
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Agent list */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonAgentCard key={i} />)}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Robot}
              title="Nenhum agente neste departamento"
              description="Ative agentes via workflows para que apareçam aqui."
            />
          ) : null}

          {/* Agent table — desktop */}
          {!loading && visible.length > 0 && (
          <div className="hidden md:block bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Agente
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Departamento
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Heartbeat
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Treino
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((agent) => (
                  <tr
                    key={agent.id}
                    onClick={() => setSelected(agent)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      selected?.id === agent.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AgentAvatar agent={agent} size="sm" />
                        <div>
                          <div className="font-medium text-slate-900">{agent.name}</div>
                          <div className="text-xs text-slate-500">{agent.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded font-medium">
                        {agent.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLOR[agent.status]}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[agent.status]}`}
                        />
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {agent.heartbeat ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          Ativo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${agent.trainingProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{agent.trainingProgress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )} {/* end !loading && visible.length > 0 desktop */}

          {/* Agent cards — mobile */}
          {!loading && visible.length > 0 && (
          <div className="md:hidden grid grid-cols-1 gap-3">
            {visible.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelected(agent)}
                className="bg-white rounded-md border border-slate-200 p-4 shadow-sm active:shadow-md cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AgentAvatar agent={agent} size="sm" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{agent.role}</p>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLOR[agent.status]}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[agent.status]}`} />
                    {agent.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded font-medium">
                    {agent.department}
                  </span>
                  {agent.heartbeat && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      heartbeat
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${agent.trainingProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{agent.trainingProgress}%</span>
                </div>
              </div>
            ))}
          </div>
          )} {/* end !loading && visible.length > 0 mobile */}
        </div>
      </div>

      {/* Detail panel — side by side on desktop, full-screen on mobile */}
      {selected && (
        <>
          {/* Desktop side panel */}
          <div className="hidden md:flex w-96 flex-shrink-0 h-full overflow-hidden">
            <AgentDetailPanel agent={selected} onClose={() => setSelected(null)} />
          </div>

          {/* Mobile overlay */}
          <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col">
            <AgentDetailPanel agent={selected} onClose={() => setSelected(null)} />
          </div>
        </>
      )}
    </div>
  )
}
