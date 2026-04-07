import { agents } from '@/data'

const statusColor: Record<string, string> = {
  'Working': 'bg-emerald-100 text-emerald-700',
  'Idle': 'bg-slate-100 text-slate-600',
  'Waiting on data': 'bg-amber-100 text-amber-700',
}

const statusDot: Record<string, string> = {
  'Working': 'bg-emerald-400 animate-pulse',
  'Idle': 'bg-slate-400',
  'Waiting on data': 'bg-amber-400 animate-pulse',
}

export function AgentsPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* Header */}
      <div className="col-span-full flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Agent Core</h1>
          <p className="text-sm text-slate-500 mt-0.5">Central de agentes autônomos por departamento</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium text-slate-900">{agents.filter(a => a.heartbeat).length}</span> ativos de {agents.length}
        </div>
      </div>

      {/* Agent cards */}
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="bg-white rounded-md border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          {/* Agent header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{agent.role}</p>
            </div>
            <span
              className={`flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full font-medium ${statusColor[agent.status] ?? 'bg-slate-100 text-slate-600'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot[agent.status] ?? 'bg-slate-400'}`} />
              {agent.status}
            </span>
          </div>

          {/* Department */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded font-medium">
              {agent.department}
            </span>
            {agent.heartbeat && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                heartbeat ativo
              </span>
            )}
          </div>

          {/* Training progress */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Treinamento</span>
              <span>{agent.trainingProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${agent.trainingProgress}%` }}
              />
            </div>
          </div>

          {/* Last active */}
          <p className="text-xs text-slate-400 mt-2">
            Último ativo: {new Date(agent.lastActive).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        </div>
      ))}
    </div>
  )
}
