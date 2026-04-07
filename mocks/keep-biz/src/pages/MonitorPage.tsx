import { useState } from 'react'
import {
  TwitterLogo,
  GoogleLogo,
  InstagramLogo,
  LinkedinLogo,
  FacebookLogo,
  Megaphone,
  ChatCircleText,
  X,
  Warning,
  Info,
  ArrowUp,
  ArrowDown,
  BellRinging,
} from '@phosphor-icons/react'
import { mentions, alerts } from '@/data'
import type { Mention, Alert } from '@/data/types'

// ─── Period config ─────────────────────────────────────────────────────────

type Period = '7d' | '30d' | '90d'

const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 }

const PERIOD_DATA: Record<Period, {
  score: number
  trend: number
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
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = linePath + ` L${pts[pts.length - 1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" />)}
    </svg>
  )
}

// ─── Source icon + label ───────────────────────────────────────────────────

type SourceConfig = { icon: React.ReactNode; color: string; label: string }

function getSourceConfig(source: string): SourceConfig {
  switch (source) {
    case 'Twitter/X':
      return { icon: <TwitterLogo weight="duotone" size={14} />, color: 'text-slate-700', label: 'Twitter/X' }
    case 'Google Reviews':
      return { icon: <GoogleLogo weight="duotone" size={14} />, color: 'text-blue-600', label: 'Google' }
    case 'Instagram':
      return { icon: <InstagramLogo weight="duotone" size={14} />, color: 'text-pink-500', label: 'Instagram' }
    case 'LinkedIn':
      return { icon: <LinkedinLogo weight="duotone" size={14} />, color: 'text-blue-700', label: 'LinkedIn' }
    case 'Facebook':
      return { icon: <FacebookLogo weight="duotone" size={14} />, color: 'text-blue-500', label: 'Facebook' }
    case 'Reclame Aqui':
      return { icon: <Megaphone weight="duotone" size={14} />, color: 'text-orange-500', label: 'Reclame Aqui' }
    case 'Forum':
      return { icon: <ChatCircleText weight="duotone" size={14} />, color: 'text-violet-500', label: 'Forum' }
    default:
      return { icon: null, color: 'text-slate-500', label: source }
  }
}

// ─── Sentiment styling ─────────────────────────────────────────────────────

const SENTIMENT_BADGE: Record<string, string> = {
  positivo: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  neutro:   'bg-slate-100 text-slate-600 border border-slate-200',
  negativo: 'bg-red-100 text-red-700 border border-red-200',
}

const SENTIMENT_DOT: Record<string, string> = {
  positivo: 'bg-emerald-400',
  neutro:   'bg-slate-400',
  negativo: 'bg-red-400',
}

// ─── Alert severity ────────────────────────────────────────────────────────

function alertSeverityConfig(severity: string) {
  switch (severity) {
    case 'critical': return { dot: 'bg-red-400', icon: <Warning weight="duotone" size={14} className="text-red-500" />, badge: 'bg-red-50 border-red-200 text-red-700' }
    case 'warning':  return { dot: 'bg-amber-400', icon: <Warning weight="duotone" size={14} className="text-amber-500" />, badge: 'bg-amber-50 border-amber-200 text-amber-700' }
    default:         return { dot: 'bg-blue-400', icon: <Info weight="duotone" size={14} className="text-blue-500" />, badge: 'bg-blue-50 border-blue-200 text-blue-700' }
  }
}

// ─── Mention Detail Modal ─────────────────────────────────────────────────

function MentionModal({ mention, onClose }: { mention: Mention; onClose: () => void }) {
  const src = getSourceConfig(mention.source)
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={src.color}>{src.icon}</span>
            <span className="text-sm font-semibold text-slate-900">{mention.author}</span>
            <span className="text-xs text-slate-400">{src.label}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">{mention.content}</p>
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${SENTIMENT_BADGE[mention.sentiment] ?? 'bg-slate-100 text-slate-600'}`}
            >
              {mention.sentiment}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(mention.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
            </span>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Alert Detail Modal ───────────────────────────────────────────────────

function AlertModal({ alert, onClose }: { alert: Alert; onClose: () => void }) {
  const cfg = alertSeverityConfig(alert.severity)
  const severityLabel = alert.severity === 'critical' ? 'Crítico' : alert.severity === 'warning' ? 'Aviso' : 'Informação'
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-md border border-slate-200 shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BellRinging weight="duotone" size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-900">{alert.title}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border font-medium ${cfg.badge}`}>
            {cfg.icon}
            {severityLabel}
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">{alert.description}</p>
          <p className="text-xs text-slate-400">
            {new Date(alert.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────

const SOURCES = ['Todos', 'Twitter/X', 'Google Reviews', 'Instagram', 'Facebook', 'Forum', 'Reclame Aqui']

// Reference date for period filtering (mock "today" = Apr 7 2026)
const TODAY = new Date('2026-04-07T23:59:59Z')

export function MonitorPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [sourceFilter, setSourceFilter] = useState('Todos')
  const [selectedMention, setSelectedMention] = useState<Mention | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  const data = PERIOD_DATA[period]
  const isUp = data.trend >= 0
  const trendLabel = `${isUp ? '+' : ''}${data.trend}%`
  const trendColor = isUp ? 'text-emerald-600' : 'text-red-500'

  // Filter mentions by period (date range) AND source
  const cutoffMs = TODAY.getTime() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000
  const periodMentions = mentions.filter((m) => new Date(m.date).getTime() >= cutoffMs)
  const filteredMentions =
    sourceFilter === 'Todos'
      ? periodMentions
      : periodMentions.filter((m) => m.source === sourceFilter)

  // Filter alerts by period
  const periodAlerts = alerts.filter((a) => new Date(a.date).getTime() >= cutoffMs)

  return (
    <>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {/* Header */}
        <div className="col-span-full flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Social Monitor</h1>
            <p className="text-sm text-slate-500 mt-0.5">Monitoramento de menções e reputação da marca</p>
          </div>
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

        {/* Reputation Score */}
        <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Score de Reputação</p>
          <div className="flex items-end gap-3 mt-3">
            <span className="text-5xl font-bold text-slate-900 tabular-nums leading-none">
              {data.score.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 mb-1">/10</span>
            <span className={`flex items-center gap-0.5 text-sm font-semibold mb-1 ${trendColor}`}>
              {isUp ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
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
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Alertas Recentes
          </p>
          {periodAlerts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Nenhum alerta no período</p>
          ) : (
            <div className="space-y-2">
              {periodAlerts.map((alert) => {
                const cfg = alertSeverityConfig(alert.severity)
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="flex items-start gap-2 p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                        {alert.title}
                      </p>
                      {alert.description && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{alert.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
              <span key={label} className="text-xs text-slate-400">{label}</span>
            ))}
          </div>
        </div>

        {/* Mentions feed */}
        <div className="col-span-full bg-white rounded-md border border-slate-200 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-slate-700">Feed de Menções</p>
              <span className="text-xs text-slate-400">
                ({filteredMentions.length} {filteredMentions.length === 1 ? 'resultado' : 'resultados'})
              </span>
            </div>
            {/* Source filter pills */}
            <div className="flex gap-1.5 flex-wrap">
              {SOURCES.map((src) => {
                const cfg = src !== 'Todos' ? getSourceConfig(src) : null
                return (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={`flex items-center gap-1 px-2.5 py-0.5 text-xs rounded-full border transition-colors ${
                      sourceFilter === src
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cfg && <span className={sourceFilter === src ? 'text-white' : cfg.color}>{cfg.icon}</span>}
                    {src}
                  </button>
                )
              })}
            </div>
          </div>

          {filteredMentions.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-400">
              Nenhuma menção encontrada para <strong>{sourceFilter}</strong> no período selecionado.
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredMentions.map((mention) => {
                const src = getSourceConfig(mention.source)
                return (
                  <div
                    key={mention.id}
                    onClick={() => setSelectedMention(mention)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    {/* Sentiment dot */}
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${SENTIMENT_DOT[mention.sentiment] ?? 'bg-slate-300'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-700">{mention.author}</span>
                        {/* Source with icon */}
                        <span className={`flex items-center gap-1 text-xs ${src.color}`}>
                          {src.icon}
                          {src.label}
                        </span>
                        {/* Sentiment badge */}
                        <span
                          className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${SENTIMENT_BADGE[mention.sentiment] ?? 'bg-slate-100 text-slate-600'}`}
                        >
                          {mention.sentiment}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 group-hover:text-slate-800 transition-colors">
                        {mention.content}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(mention.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedMention && (
        <MentionModal mention={selectedMention} onClose={() => setSelectedMention(null)} />
      )}
      {selectedAlert && (
        <AlertModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </>
  )
}
