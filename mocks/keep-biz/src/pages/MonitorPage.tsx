import { useState } from 'react'
import { mentions, alerts } from '@/data'

// ─── Period-specific datasets ────────────────────────────────────────────────

type Period = '7d' | '30d' | '90d'

const PERIOD_DATA: Record<Period, {
  score: number
  trend: number          // % change (positive = up, negative = down)
  totalMentions: number
  positivePercent: number
  chartLabels: string[]
  chartValues: number[]
}> = {
  '7d': {
    score: 8.1,
    trend: -0.4,
    totalMentions: 12,
    positivePercent: 75,
    chartLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    chartValues: [3, 1, 4, 2, 1, 0, 1],
  },
  '30d': {
    score: 8.4,
    trend: 3.7,
    totalMentions: 47,
    positivePercent: 82,
    chartLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    chartValues: [8, 12, 15, 12],
  },
  '90d': {
    score: 7.8,
    trend: 6.1,
    totalMentions: 138,
    positivePercent: 78,
    chartLabels: ['Jan', 'Fev', 'Mar'],
    chartValues: [38, 52, 48],
  },
}

// ─── SVG Area Chart ────────────────────────────────────────────────────────

function AreaChart({ values }: { values: number[] }) {
  const W = 480
  const H = 96
  const PAD_X = 0
  const PAD_Y = 8

  const max = Math.max(...values, 1)
  const n = values.length

  const xStep = (W - PAD_X * 2) / Math.max(n - 1, 1)

  const pts = values.map((v, i) => ({
    x: PAD_X + i * xStep,
    y: PAD_Y + (1 - v / max) * (H - PAD_Y * 2),
  }))

  const linePath = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  const areaPath =
    linePath +
    ` L${pts[pts.length - 1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 80 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" />
      ))}
    </svg>
  )
}

// ─── Sentiment config ─────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function MonitorPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [sourceFilter, setSourceFilter] = useState('Todos')

  const data = PERIOD_DATA[period]
  const isUp = data.trend >= 0
  const trendLabel = `${isUp ? '↑' : '↓'} ${isUp ? '+' : ''}${data.trend}%`
  const trendColor = isUp ? 'text-emerald-600' : 'text-red-500'

  const SOURCES = ['Todos', 'Twitter/X', 'Google Reviews', 'Instagram', 'LinkedIn', 'Reclame Aqui']
  const filteredMentions =
    sourceFilter === 'Todos'
      ? mentions
      : mentions.filter((m) => m.source === sourceFilter)

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* Header */}
      <div className="col-span-full flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Social Monitor</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitoramento de menções e reputação da marca</p>
        </div>
        {/* Period selector — global, affects score + chart */}
        <div className="flex gap-1 bg-slate-100 rounded-md p-0.5">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                period === p
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Reputation Score card */}
      <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Score de Reputação</p>
        <div className="flex items-end gap-3 mt-3">
          <span className="text-5xl font-bold text-slate-900 tabular-nums leading-none">
            {data.score.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 mb-1 leading-tight">
            /10
          </span>
          <span className={`text-sm font-semibold mb-1 ${trendColor}`}>
            {trendLabel}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">últimos {period}</p>
        <div className="mt-4 flex gap-3 text-xs text-slate-500">
          <span>{data.totalMentions} menções</span>
          <span>•</span>
          <span>{data.positivePercent}% positivas</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Alertas Recentes</p>
        <div className="space-y-2">
          {alerts.slice(0, 4).map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-2 p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                  alert.severity === 'critical'
                    ? 'bg-red-400'
                    : alert.severity === 'warning'
                    ? 'bg-amber-400'
                    : 'bg-blue-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 leading-snug">{alert.title}</p>
                {alert.description && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{alert.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trends chart */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Volume de Menções</p>
            <p className="text-xs text-slate-400 mt-0.5">{data.totalMentions} total — últimos {period}</p>
          </div>
        </div>

        <AreaChart values={data.chartValues} />

        <div
          className="flex mt-2"
          style={{ justifyContent: data.chartLabels.length === 1 ? 'center' : 'space-between' }}
        >
          {data.chartLabels.map((label) => (
            <span key={label} className="text-xs text-slate-400">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Mentions feed */}
      <div className="col-span-full bg-white rounded-md border border-slate-200 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-medium text-slate-700">Feed de Menções</p>
          <div className="flex gap-1.5 flex-wrap">
            {SOURCES.map((src) => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`px-2.5 py-0.5 text-xs rounded-full border transition-colors ${
                  sourceFilter === src
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {filteredMentions.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-400">
            Nenhuma menção encontrada para <strong>{sourceFilter}</strong> no período selecionado.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredMentions.map((mention) => (
              <div
                key={mention.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    sentimentDot[mention.sentiment] ?? 'bg-slate-300'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-700">{mention.author}</span>
                    <span className="text-xs text-slate-400">{mention.source}</span>
                    <span
                      className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${
                        sentimentColor[mention.sentiment] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {mention.sentiment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{mention.content}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(mention.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
