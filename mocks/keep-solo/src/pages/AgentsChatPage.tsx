import { Robot, PaperPlaneTilt } from '@phosphor-icons/react'
import { agents } from '@/data'

const agent = agents[0]!

const mockMessages = [
  { id: 1, from: 'agent', text: 'Oi! Acabei de confirmar a consulta da Camila para amanhã às 14h. Posso te ajudar com mais alguma coisa?' },
  { id: 2, from: 'user', text: 'Quantos leads novos temos essa semana?' },
  { id: 3, from: 'agent', text: 'Você tem 3 novos leads esta semana: Renata (Instagram), Paulo (indicação) e Sofia (Google). Renata respondeu ontem — quer que eu faça follow-up?' },
]

export function AgentsChatPage() {
  return (
    <div className="flex flex-col h-full max-w-2xl">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-6 border-b border-amber-100 bg-white">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Robot size={18} weight="duotone" className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-stone-800">{agent.name}</p>
          <p className="text-xs text-green-500 font-medium">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mockMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                msg.from === 'user'
                  ? 'bg-amber-500 text-white rounded-br-md'
                  : 'bg-white border border-amber-100 text-stone-700 rounded-bl-md shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-amber-100 bg-white">
        <div className="flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
          <input
            type="text"
            placeholder="Manda uma mensagem..."
            className="flex-1 bg-transparent text-sm text-stone-700 placeholder-stone-400 outline-none"
          />
          <button className="w-8 h-8 bg-amber-500 hover:bg-amber-600 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
            <PaperPlaneTilt size={16} weight="duotone" className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
