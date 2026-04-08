import { Buildings } from '@phosphor-icons/react'

const agents = [
  { name: 'Vendas', task: 'Qualificando leads...' },
  { name: 'Suporte', task: 'Respondendo tickets' },
  { name: 'Conteúdo', task: 'Gerando relatório' },
]

export function OrchestratorBarDemo() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-900 text-white overflow-hidden shadow-2xl w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-slate-800">
        <div className="flex items-center gap-2">
          <Buildings size={16} weight="duotone" className="text-blue-400" />
          <span className="text-xs font-semibold tracking-wide">KeepBiz</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="orchestrator-status w-2.5 h-2.5 rounded-full" />
          <span className="text-xs text-white/60">
            Team Status: <span className="orchestrator-label text-white/90">Operacional</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
      </div>

      {/* Agent rows */}
      <div className="p-3 flex flex-col gap-2">
        {agents.map((agent, i) => (
          <div
            key={agent.name}
            className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <div className="w-7 h-7 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-blue-300">{agent.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white/90">{agent.name}</div>
              <div className="text-[10px] text-white/50 truncate">{agent.task}</div>
            </div>
            <div className="agent-pulse w-1.5 h-1.5 rounded-full bg-success shrink-0" />
          </div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-slate-800/50">
        <span className="text-[10px] text-white/40">3 agentes ativos</span>
        <span className="text-[10px] text-white/40">Última atualização: agora</span>
      </div>
    </div>
  )
}
