import { useState } from 'react'
import {
  Eye,
  TrendUp,
  TrendDown,
  Users,
  CurrencyDollar,
  ChartBar,
  X,
  Phone,
  EnvelopeSimple,
  InstagramLogo,
  LinkedinLogo,
  GoogleLogo,
  WhatsappLogo,
  TiktokLogo,
  UserCircle,
  CalendarBlank,
  Note,
  ArrowRight,
} from '@phosphor-icons/react'
import { leads } from '@/data'
import type { Lead, LeadStatus } from '@/data/types'

// ─── Types ──────────────────────────────────────────────────────────────────

type Period = '7d' | '30d' | '90d'

// ─── Period data ─────────────────────────────────────────────────────────────

const PERIOD_DATA: Record<
  Period,
  {
    kpis: { label: string; value: string; trend: string; up: boolean }[]
    funnel: Record<string, number>
    contentMetrics: Record<string, { views: number; clicks: number; engagement: number }>
  }
> = {
  '7d': {
    kpis: [
      { label: 'Novos leads', value: '3', trend: '+2 vs semana anterior', up: true },
      { label: 'Conversões', value: '1', trend: 'Igual à semana anterior', up: true },
      { label: 'Receita', value: 'R$ 360', trend: '+R$ 120 vs semana anterior', up: true },
      { label: 'Engajamento', value: '94%', trend: '+5% vs semana anterior', up: true },
    ],
    funnel: { visitante: 1, lead: 1, contato: 1, cliente: 1 },
    contentMetrics: {
      'content-s-004': { views: 312, clicks: 22, engagement: 7.1 },
      'content-s-005': { views: 890, clicks: 54, engagement: 6.1 },
    },
  },
  '30d': {
    kpis: [
      { label: 'Novos leads', value: '8', trend: '+3 vs mês anterior', up: true },
      { label: 'Conversões', value: '3', trend: '+1 vs mês anterior', up: true },
      { label: 'Receita', value: 'R$ 1.260', trend: '+R$ 360 vs mês anterior', up: true },
      { label: 'Engajamento', value: '87%', trend: '+2% vs mês anterior', up: true },
    ],
    funnel: { visitante: 2, lead: 2, contato: 2, cliente: 2 },
    contentMetrics: {
      'content-s-004': { views: 1247, clicks: 89, engagement: 7.1 },
      'content-s-005': { views: 3890, clicks: 234, engagement: 6.0 },
    },
  },
  '90d': {
    kpis: [
      { label: 'Novos leads', value: '14', trend: '+5 vs trimestre anterior', up: true },
      { label: 'Conversões', value: '5', trend: '-1 vs trimestre anterior', up: false },
      { label: 'Receita', value: 'R$ 2.700', trend: '+R$ 540 vs trimestre anterior', up: true },
      { label: 'Engajamento', value: '82%', trend: '-1% vs trimestre anterior', up: false },
    ],
    funnel: { visitante: 3, lead: 3, contato: 3, cliente: 3 },
    contentMetrics: {
      'content-s-004': { views: 2890, clicks: 198, engagement: 6.9 },
      'content-s-005': { views: 7230, clicks: 512, engagement: 7.1 },
    },
  },
}

// ─── Funnel stages (4 main ones) ─────────────────────────────────────────────

const FUNNEL_STEPS: { key: LeadStatus; label: string; color: string; barColor: string }[] = [
  { key: 'visitante', label: 'Visitante', color: 'bg-stone-100 text-stone-600', barColor: 'bg-stone-300' },
  { key: 'lead', label: 'Lead', color: 'bg-amber-100 text-amber-700', barColor: 'bg-amber-400' },
  { key: 'contato', label: 'Contato', color: 'bg-orange-100 text-orange-700', barColor: 'bg-orange-400' },
  { key: 'cliente', label: 'Cliente', color: 'bg-green-100 text-green-700', barColor: 'bg-green-400' },
]

// ─── Status display helpers ───────────────────────────────────────────────────

const STATUS_LABEL: Record<LeadStatus, string> = {
  visitante: 'Visitante',
  lead: 'Lead',
  contato: 'Contato',
  proposta: 'Proposta',
  cliente: 'Cliente',
  perdido: 'Perdido',
}

const STATUS_COLOR: Record<LeadStatus, string> = {
  visitante: 'bg-stone-100 text-stone-600',
  lead: 'bg-amber-100 text-amber-700',
  contato: 'bg-orange-100 text-orange-700',
  proposta: 'bg-yellow-100 text-yellow-700',
  cliente: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-600',
}

// ─── Origin icon ─────────────────────────────────────────────────────────────

function OriginIcon({ origin }: { origin: string }) {
  const cls = 'shrink-0'
  switch (origin) {
    case 'Instagram': return <InstagramLogo size={14} weight="duotone" className={`${cls} text-pink-500`} />
    case 'LinkedIn': return <LinkedinLogo size={14} weight="duotone" className={`${cls} text-blue-600`} />
    case 'Google Ads': return <GoogleLogo size={14} weight="duotone" className={`${cls} text-blue-400`} />
    case 'WhatsApp': return <WhatsappLogo size={14} weight="duotone" className={`${cls} text-green-500`} />
    case 'TikTok': return <TiktokLogo size={14} weight="duotone" className={`${cls} text-stone-700`} />
    default: return <UserCircle size={14} weight="duotone" className={`${cls} text-stone-400`} />
  }
}

// ─── Lead Sheet ───────────────────────────────────────────────────────────────

function LeadSheet({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      {/* Sheet panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col rounded-l-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
              {lead.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-stone-800">{lead.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[lead.status]}`}>
                {STATUS_LABEL[lead.status]}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
          >
            <X size={16} className="text-stone-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Contato</h3>
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <EnvelopeSimple size={16} weight="duotone" className="text-amber-500 shrink-0" />
              <span>{lead.email}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Phone size={16} weight="duotone" className="text-amber-500 shrink-0" />
                <span>{lead.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <OriginIcon origin={lead.origin} />
              <span>{lead.origin}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Datas</h3>
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <CalendarBlank size={16} weight="duotone" className="text-amber-500 shrink-0" />
              <span>Captado em {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <CalendarBlank size={16} weight="duotone" className="text-orange-400 shrink-0" />
              <span>Último contato {new Date(lead.lastContactAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Value */}
          {lead.value !== null && (
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-xs text-stone-400 font-medium mb-1">Valor estimado</p>
              <p className="text-xl font-bold text-amber-700">
                {lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide flex items-center gap-1">
              <Note size={14} weight="duotone" className="text-amber-500" />
              Notas
            </h3>
            <p className="text-sm text-stone-600 bg-stone-50 rounded-2xl p-4 leading-relaxed">
              {lead.notes}
            </p>
          </div>

          {/* Funnel status */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Progresso no funil</h3>
            <div className="flex gap-1">
              {FUNNEL_STEPS.map((step, i) => {
                const currentIdx = FUNNEL_STEPS.findIndex((s) => s.key === lead.status)
                const isReached = i <= currentIdx
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`h-2 rounded-full w-full transition-colors ${
                        isReached ? step.barColor : 'bg-stone-100'
                      }`}
                    />
                    <span className={`text-[10px] font-medium ${isReached ? 'text-stone-600' : 'text-stone-300'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── KPI card ────────────────────────────────────────────────────────────────

const KPI_ICONS = [Users, TrendUp, CurrencyDollar, ChartBar]
const KPI_COLORS = ['amber', 'green', 'orange', 'blue']

function KpiCard({
  label,
  value,
  trend,
  up,
  index,
}: {
  label: string
  value: string
  trend: string
  up: boolean
  index: number
}) {
  const Icon = KPI_ICONS[index]!
  const color = KPI_COLORS[index]!
  return (
    <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-xl bg-${color}-100 flex items-center justify-center`}>
          <Icon size={16} weight="duotone" className={`text-${color}-500`} />
        </div>
        {up ? (
          <TrendUp size={14} className="text-green-500" />
        ) : (
          <TrendDown size={14} className="text-red-400" />
        )}
      </div>
      <div className="text-2xl font-bold text-stone-800 mb-1">{value}</div>
      <div className="text-xs text-stone-400 font-medium">{label}</div>
      <div className={`text-xs mt-1 font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</div>
    </div>
  )
}

// ─── Content performance card ─────────────────────────────────────────────────

function ContentCard({
  title,
  channel,
  views,
  clicks,
  engagement,
}: {
  title: string
  channel: string
  views: number
  clicks: number
  engagement: number
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-medium text-stone-700 leading-snug flex-1">{title}</p>
        <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium shrink-0">
          {channel}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-base font-bold text-stone-800">{views.toLocaleString('pt-BR')}</p>
          <p className="text-[10px] text-stone-400">views</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-stone-800">{clicks}</p>
          <p className="text-[10px] text-stone-400">clicks</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-amber-600">{engagement}%</p>
          <p className="text-[10px] text-stone-400">engaj.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function MonitorPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [activeFunnelStage, setActiveFunnelStage] = useState<LeadStatus | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const data = PERIOD_DATA[period]

  // Filtered leads
  const filteredLeads = activeFunnelStage
    ? leads.filter((l) => l.status === activeFunnelStage)
    : leads.filter((l) => l.status !== 'perdido')

  // Funnel bar widths (proportional to max count)
  const funnelCounts = FUNNEL_STEPS.map((s) => data.funnel[s.key] ?? 0)
  const maxFunnelCount = Math.max(...funnelCounts, 1)

  // Published content items
  const publishedContent = [
    { id: 'content-s-004', title: 'Depoimento: como a Maria perdeu 8kg em 3 meses', channel: 'Instagram' },
    { id: 'content-s-005', title: 'Meal prep dominical em 1 hora', channel: 'TikTok' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24">
      {/* Header + period selector */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Eye size={22} weight="duotone" className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-800">Monitor</h1>
            <p className="text-sm text-stone-400">Seu funil pessoal</p>
          </div>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-1 bg-amber-50 rounded-xl p-1">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === p
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-600 hover:bg-amber-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards — 2x2 mobile, 4 cols on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      {/* Funnel visual */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-700">Funil de conversão</h2>
          {activeFunnelStage && (
            <button
              onClick={() => setActiveFunnelStage(null)}
              className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              <X size={12} />
              Limpar filtro
            </button>
          )}
        </div>
        <div className="space-y-3">
          {FUNNEL_STEPS.map((step) => {
            const count = data.funnel[step.key] ?? 0
            const pct = Math.round((count / maxFunnelCount) * 100)
            const isActive = activeFunnelStage === step.key
            return (
              <button
                key={step.key}
                onClick={() =>
                  setActiveFunnelStage((prev) => (prev === step.key ? null : step.key))
                }
                className={`w-full text-left rounded-xl p-3 transition-all border-2 ${
                  isActive
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-transparent hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${step.color}`}>
                    {step.label}
                  </span>
                  <span className="text-sm font-bold text-stone-700">{count}</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${step.barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lead list */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-50 flex items-center justify-between">
          <h2 className="font-semibold text-stone-700">
            Leads
            {activeFunnelStage && (
              <span className="ml-2 text-xs text-amber-600 font-normal">
                filtrado por {STATUS_LABEL[activeFunnelStage]}
              </span>
            )}
          </h2>
          <span className="text-xs text-stone-400">{filteredLeads.length} leads</span>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="py-10 text-center">
            <Users size={32} weight="duotone" className="text-amber-200 mx-auto mb-2" />
            <p className="text-sm text-stone-400">Nenhum lead nesta etapa</p>
          </div>
        ) : (
          <div className="divide-y divide-amber-50">
            {filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-amber-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 text-sm font-bold shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{lead.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <OriginIcon origin={lead.origin} />
                      <p className="text-xs text-stone-400 truncate">{lead.origin}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span
                    className={`hidden sm:inline text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[lead.status]}`}
                  >
                    {STATUS_LABEL[lead.status]}
                  </span>
                  <span className="text-xs text-stone-300">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                  <ArrowRight size={14} className="text-stone-300" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content performance */}
      <div>
        <h2 className="font-semibold text-stone-700 mb-3">Performance de conteúdo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {publishedContent.map((item) => {
            const metrics = data.contentMetrics[item.id]
            if (!metrics) return null
            return (
              <ContentCard
                key={item.id}
                title={item.title}
                channel={item.channel}
                views={metrics.views}
                clicks={metrics.clicks}
                engagement={metrics.engagement}
              />
            )
          })}
        </div>
      </div>

      {/* Lead Sheet */}
      {selectedLead && (
        <LeadSheet lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  )
}
