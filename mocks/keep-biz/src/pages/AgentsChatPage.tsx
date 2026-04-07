import { agents } from '@/data'

const mockMessages = [
  { id: 1, from: 'user', text: 'Qual o status da conciliação de hoje?' },
  { id: 2, from: 'agent', agentId: 'agent-001', text: 'Processando 148 lançamentos. Encontrei 3 divergências que precisam de validação manual. Posso encaminhar o relatório para o seu email?' },
  { id: 3, from: 'user', text: 'Sim, por favor. E me avisa quando terminar.' },
  { id: 4, from: 'agent', agentId: 'agent-001', text: 'Perfeito. Relatório enviado para financeiro@empresa.com. Vou notificar assim que a conciliação for concluída — estimativa: 15 minutos.' },
]

export function AgentsChatPage() {
  const selectedAgent = agents[0]

  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start h-full">
      {/* Header */}
      <div className="col-span-full">
        <h1 className="text-xl font-semibold text-slate-900">Chat com Agentes</h1>
        <p className="text-sm text-slate-500 mt-0.5">Converse, dê feedback e refine o treinamento</p>
      </div>

      {/* Agent selector (sidebar) */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm">
        <div className="px-3 py-2 border-b border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Agentes</p>
        </div>
        <div className="divide-y divide-slate-50">
          {agents.map((agent, i) => (
            <div
              key={agent.id}
              className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${i === 0 ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${agent.heartbeat ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${i === 0 ? 'text-blue-700' : 'text-slate-700'}`}>
                  {agent.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{agent.department}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div className="xl:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col" style={{ minHeight: 420 }}>
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{selectedAgent.name}</p>
            <p className="text-xs text-slate-400">{selectedAgent.role} · {selectedAgent.department}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs xl:max-w-sm px-3 py-2 rounded-md text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-slate-50"
            readOnly
          />
          <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
