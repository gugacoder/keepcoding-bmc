import { Eye, TrendUp, Users, CurrencyDollar, ArrowRight } from '@phosphor-icons/react'
import { leads } from '@/data'

const kpis = [
  { label: 'Novos leads', value: '12', trend: '+3 esta semana', icon: Users, color: 'amber' },
  { label: 'Conversões', value: '4', trend: '+1 este mês', icon: TrendUp, color: 'green' },
  { label: 'Receita', value: 'R$ 2.160', trend: '+R$ 360 hoje', icon: CurrencyDollar, color: 'orange' },
]

const statusLabel: Record<string, string> = {
  visitante: 'Visitante',
  lead: 'Lead',
  contato: 'Contato',
  proposta: 'Proposta',
  cliente: 'Cliente',
}

const statusColor: Record<string, string> = {
  visitante: 'bg-stone-100 text-stone-600',
  lead: 'bg-amber-100 text-amber-700',
  contato: 'bg-orange-100 text-orange-700',
  proposta: 'bg-yellow-100 text-yellow-700',
  cliente: 'bg-green-100 text-green-700',
}

export function MonitorPage() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
          <Eye size={22} weight="duotone" className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Monitor</h1>
          <p className="text-sm text-stone-400">Seu funil pessoal de hoje</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} weight="duotone" className="text-amber-500" />
                <span className="text-xs text-stone-400 font-medium">{kpi.label}</span>
              </div>
              <div className="text-2xl font-bold text-stone-800">{kpi.value}</div>
              <div className="text-xs text-amber-600 mt-1">{kpi.trend}</div>
            </div>
          )
        })}
      </div>

      {/* Leads recentes */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-amber-50">
          <h2 className="font-semibold text-stone-700">Leads recentes</h2>
        </div>
        <div className="divide-y divide-amber-50">
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between px-5 py-4 hover:bg-amber-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-semibold">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-700">{lead.name}</p>
                  <p className="text-xs text-stone-400">{lead.origin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[lead.status] ?? 'bg-stone-100 text-stone-600'}`}>
                  {statusLabel[lead.status] ?? lead.status}
                </span>
                <ArrowRight size={14} className="text-stone-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
