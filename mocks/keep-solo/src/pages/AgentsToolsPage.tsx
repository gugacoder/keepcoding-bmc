import { Wrench, CheckCircle, XCircle } from '@phosphor-icons/react'
import { connectors } from '@/data'

export function AgentsToolsPage() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Wrench size={22} weight="duotone" className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-800">Ferramentas</h1>
            <p className="text-sm text-stone-400">Conectores do seu agente</p>
          </div>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          Adicionar
        </button>
      </div>

      {/* Connectors list */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-amber-50">
          {connectors.map((conn) => (
            <div key={conn.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-base">
                  {conn.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-700">{conn.name}</p>
                  <p className="text-xs text-stone-400">{conn.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {conn.status === 'connected' ? (
                  <CheckCircle size={18} weight="duotone" className="text-green-500" />
                ) : (
                  <XCircle size={18} weight="duotone" className="text-stone-300" />
                )}
                <span className={`text-xs font-medium ${conn.status === 'connected' ? 'text-green-600' : 'text-stone-400'}`}>
                  {conn.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
