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
import { ProfileSelector } from '@/components/ProfileSelector'
import { AiInsightCard } from '@/components/AiInsightCard'
import { useProfiles } from '@/contexts/ProfileContext'

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
          <stop offset="0%" stopColor="var(--info)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--info)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="var(--info)" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--info)" />)}
    </svg>
  )
}

// ─── Source icon + label ───────────────────────────────────────────────────

type SourceConfig = { icon: React.ReactNode; color: string; label: string }

function getSourceConfig(source: string): SourceConfig {
  switch (source) {
    case 'Twitter/X':
      return { icon: <TwitterLogo weight="duotone" size={14} />, color: 'text-foreground', label: 'Twitter/X' }
    case 'Google Reviews':
      return { icon: <GoogleLogo weight="duotone" size={14} />, color: 'text-primary', label: 'Google' }
    case 'Instagram':
      return { icon: <InstagramLogo weight="duotone" size={14} />, color: 'text-rose', label: 'Instagram' }
    case 'LinkedIn':
      return { icon: <LinkedinLogo weight="duotone" size={14} />, color: 'text-info', label: 'LinkedIn' }
    case 'Facebook':
      return { icon: <FacebookLogo weight="duotone" size={14} />, color: 'text-info', label: 'Facebook' }
    case 'Reclame Aqui':
      return { icon: <Megaphone weight="duotone" size={14} />, color: 'text-orange', label: 'Reclame Aqui' }
    case 'Forum':
      return { icon: <ChatCircleText weight="duotone" size={14} />, color: 'text-violet', label: 'Forum' }
    default:
      return { icon: null, color: 'text-muted-foreground', label: source }
  }
}

// ─── Sentiment styling ─────────────────────────────────────────────────────

const SENTIMENT_BADGE: Record<string, string> = {
  positivo: 'bg-success/10 text-success border border-success/20',
  neutro:   'bg-muted text-muted-foreground border border-border',
  negativo: 'bg-destructive/10 text-destructive border border-destructive/20',
}

const SENTIMENT_DOT: Record<string, string> = {
  positivo: 'bg-success',
  neutro:   'bg-muted-foreground',
  negativo: 'bg-destructive',
}

// ─── Alert severity ────────────────────────────────────────────────────────

function alertSeverityConfig(severity: string) {
  switch (severity) {
    case 'critical': return { dot: 'bg-destructive', icon: <Warning weight="duotone" size={14} className="text-destructive" />, badge: 'bg-destructive/10 border-destructive/20 text-destructive' }
    case 'warning':  return { dot: 'bg-warning', icon: <Warning weight="duotone" size={14} className="text-warning" />, badge: 'bg-warning/10 border-warning/20 text-warning' }
    default:         return { dot: 'bg-info', icon: <Info weight="duotone" size={14} className="text-info" />, badge: 'bg-info/10 border-info/20 text-info' }
  }
}

// ─── Mention Detail Modal ─────────────────────────────────────────────────

function MentionModal({ mention, onClose }: { mention: Mention; onClose: () => void }) {
  const src = getSourceConfig(mention.source)
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-card rounded-md border border-border shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className={src.color}>{src.icon}</span>
            <span className="text-sm font-semibold text-foreground">{mention.author}</span>
            <span className="text-xs text-muted-foreground">{src.label}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{mention.content}</p>
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${SENTIMENT_BADGE[mention.sentiment] ?? 'bg-muted text-muted-foreground'}`}
            >
              {mention.sentiment}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(mention.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
            </span>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-border rounded-md transition-colors"
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
        className="bg-card rounded-md border border-border shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BellRinging weight="duotone" size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">{alert.title}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border font-medium ${cfg.badge}`}>
            {cfg.icon}
            {severityLabel}
          </span>
          <p className="text-sm text-foreground leading-relaxed">{alert.description}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(alert.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-border rounded-md transition-colors"
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
  const { activeProfileId } = useProfiles()

  const data = PERIOD_DATA[period]
  const isUp = data.trend >= 0
  const trendLabel = `${isUp ? '+' : ''}${data.trend}%`
  const trendColor = isUp ? 'text-success' : 'text-destructive'

  // Filter mentions by period (date range), source AND active profile
  const cutoffMs = TODAY.getTime() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000
  const profileMentions = activeProfileId !== null
    ? mentions.filter((m) => m.profileId === activeProfileId)
    : mentions
  const periodMentions = profileMentions.filter((m) => new Date(m.date).getTime() >= cutoffMs)
  const filteredMentions =
    sourceFilter === 'Todos'
      ? periodMentions
      : periodMentions.filter((m) => m.source === sourceFilter)

  // Filter alerts by period
  const periodAlerts = alerts.filter((a) => new Date(a.date).getTime() >= cutoffMs)

  return (
    <>
      <ProfileSelector />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {/* Header */}
        <div className="col-span-full flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Social Monitor</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitoramento de menções e reputação da marca</p>
          </div>
          <div className="flex gap-1 bg-muted rounded-md p-0.5">
            {(['7d', '30d', '90d'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  period === p
                    ? 'bg-card text-info shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Reputation Score */}
        <div className="bg-card rounded-md border border-border p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Score de Reputação</p>
          <div className="flex items-end gap-3 mt-3">
            <span className="text-5xl font-bold text-foreground tabular-nums leading-none">
              {data.score.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground mb-1">/10</span>
            <span className={`flex items-center gap-0.5 text-sm font-semibold mb-1 ${trendColor}`}>
              {isUp ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
              {trendLabel}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">últimos {period}</p>
          <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
            <span>{data.totalMentions} menções</span>
            <span>•</span>
            <span>{data.positivePercent}% positivas</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-md border border-border p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Alertas Recentes
          </p>
          {periodAlerts.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">Nenhum alerta no período</p>
          ) : (
            <div className="space-y-2">
              {periodAlerts.map((alert) => {
                const cfg = alertSeverityConfig(alert.severity)
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="flex items-start gap-2 p-2 rounded bg-muted hover:bg-accent cursor-pointer transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug group-hover:text-foreground transition-colors">
                        {alert.title}
                      </p>
                      {alert.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alert.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Trends chart */}
        <div className="bg-card rounded-md border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Volume de Menções</p>
              <p className="text-xs text-muted-foreground mt-0.5">{data.totalMentions} total — últimos {period}</p>
            </div>
          </div>
          <AreaChart values={data.chartValues} />
          <div
            className="flex mt-2"
            style={{ justifyContent: data.chartLabels.length === 1 ? 'center' : 'space-between' }}
          >
            {data.chartLabels.map((label) => (
              <span key={label} className="text-xs text-muted-foreground">{label}</span>
            ))}
          </div>
        </div>

        {/* AI Insight Card — above feed */}
        <div className="col-span-full">
          <AiInsightCard />
        </div>

        {/* Mentions feed */}
        <div className="col-span-full bg-card rounded-md border border-border shadow-sm">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Feed de Menções</p>
              <span className="text-xs text-muted-foreground">
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
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {cfg && <span className={sourceFilter === src ? 'text-primary-foreground' : cfg.color}>{cfg.icon}</span>}
                    {src}
                  </button>
                )
              })}
            </div>
          </div>

          {filteredMentions.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhuma menção encontrada para <strong>{sourceFilter}</strong> no período selecionado.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredMentions.map((mention) => {
                const src = getSourceConfig(mention.source)
                return (
                  <div
                    key={mention.id}
                    onClick={() => setSelectedMention(mention)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors group"
                  >
                    {/* Sentiment dot */}
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${SENTIMENT_DOT[mention.sentiment] ?? 'bg-muted-foreground/30'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">{mention.author}</span>
                        {/* Source with icon */}
                        <span className={`flex items-center gap-1 text-xs ${src.color}`}>
                          {src.icon}
                          {src.label}
                        </span>
                        {/* Sentiment badge */}
                        <span
                          className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${SENTIMENT_BADGE[mention.sentiment] ?? 'bg-muted text-muted-foreground'}`}
                        >
                          {mention.sentiment}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-foreground transition-colors">
                        {mention.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
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
