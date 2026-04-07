import { connectors } from '@/data'

const categories = ['Todos', 'Produtividade', 'Comunicação', 'Finanças', 'CRM', 'ERP', 'Marketing']

export function AgentsConnectorsPage() {
  return (
    <div className="p-6 grid grid-cols-1 gap-6 items-start">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Conectores</h1>
          <p className="text-sm text-slate-500 mt-0.5">Integrações com ferramentas externas</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          + Adicionar Conector
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              i === 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Connectors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {connectors.map((connector) => (
          <div key={connector.id} className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{connector.name}</h3>
                <span className="text-xs text-slate-400">{connector.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connector.status === 'connected' ? 'bg-emerald-400' : 'bg-slate-300'
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    connector.status === 'connected' ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {connector.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-3">{connector.description}</p>

            {connector.connectedAt && (
              <p className="text-xs text-slate-400 mb-3">
                Conectado em {new Date(connector.connectedAt).toLocaleDateString('pt-BR')}
              </p>
            )}

            <div className="flex gap-2">
              {connector.status === 'connected' ? (
                <button className="flex-1 px-2 py-1.5 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors">
                  Desconectar
                </button>
              ) : (
                <button className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Conectar
                </button>
              )}
              <button className="px-2 py-1.5 text-xs border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-colors">
                Config
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
