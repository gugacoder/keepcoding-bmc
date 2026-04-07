import { mentions, alerts } from '@/data'

const sentimentColor: Record<string, string> = {
  positivo: 'bg-emerald-100 text-emerald-700',
  neutro: 'bg-slate-100 text-slate-600',
  negativo: 'bg-red-100 text-red-700',
}

const sentimentDot: Record<string, string> = {
  positivo: 'bg-emerald-400',
  neutro: 'bg-slate-400',
  negativo: 'bg-red-400',
}

export function MonitorPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* Header */}
      <div className="col-span-full">
        <h1 className="text-xl font-semibold text-slate-900">Social Monitor</h1>
        <p className="text-sm text-slate-500 mt-0.5">Monitoramento de menções e reputação da marca</p>
      </div>

      {/* Reputation Score */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Score de Reputação</p>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-4xl font-bold text-slate-900">8.4</span>
          <span className="text-sm text-emerald-600 font-medium mb-1">↑ +0.3 (30d)</span>
        </div>
        <div className="mt-3 flex gap-3 text-xs text-slate-500">
          <span>47 menções este mês</span>
          <span>•</span>
          <span>82% positivas</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Alertas Recentes</p>
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-2 p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-400' : alert.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                }`}
              />
              <p className="text-xs text-slate-700 leading-snug">{alert.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Period selector placeholder */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Volume de Menções</p>
          <div className="flex gap-1">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                className="px-2 py-0.5 text-xs rounded border border-slate-200 text-slate-600 hover:bg-slate-100 first:bg-blue-600 first:text-white first:border-blue-600"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-1 h-20">
          {[12, 8, 15, 22, 18, 25, 19].map((v, i) => (
            <div key={i} className="flex-1 bg-blue-100 rounded-sm" style={{ height: `${(v / 25) * 100}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
        </div>
      </div>

      {/* Mentions feed */}
      <div className="col-span-full bg-white rounded-md border border-slate-200 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Feed de Menções</p>
          <div className="flex gap-2">
            {['Todos', 'Twitter/X', 'Google Reviews', 'Instagram'].map((src, i) => (
              <button
                key={src}
                className={`px-2.5 py-0.5 text-xs rounded-full border transition-colors ${
                  i === 0
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {mentions.map((mention) => (
            <div key={mention.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${sentimentDot[mention.sentiment] ?? 'bg-slate-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-700">{mention.author}</span>
                  <span className="text-xs text-slate-400">{mention.source}</span>
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${sentimentColor[mention.sentiment] ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {mention.sentiment}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{mention.content}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(mention.date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
