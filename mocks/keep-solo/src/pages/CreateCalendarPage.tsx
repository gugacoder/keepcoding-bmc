import { useState } from 'react'
import { Calendar, X, InstagramLogo, TiktokLogo, LinkedinLogo, YoutubeLogo, Article, Globe } from '@phosphor-icons/react'
import { useContent } from '@/contexts/ContentContext'
import { Badge, IconBubble, badgeDotClass, type BadgeColor } from '@/components/ui/badge'
import type { ContentItem } from '@/data/types'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// April 2026 starts on Wednesday (index 3)
const MONTH_START_DAY = 3
const DAYS_IN_MONTH = 30
const MONTH_LABEL = 'Abril 2026'
const MONTH_INDEX = 3 // April = 3

const STATUS_CONFIG: Record<string, { label: string; color: BadgeColor }> = {
  rascunho:   { label: 'Rascunho',  color: 'muted' },
  em_revisao: { label: 'Em revisão', color: 'yellow' },
  pronto:     { label: 'Pronto',    color: 'blue' },
  aprovado:   { label: 'Pronto',    color: 'blue' },
  agendado:   { label: 'Agendado',  color: 'purple' },
  publicado:  { label: 'Publicado', color: 'green' },
}

const CHANNEL_ICON: Record<string, React.ElementType> = {
  Instagram: InstagramLogo,
  TikTok:    TiktokLogo,
  LinkedIn:  LinkedinLogo,
  YouTube:   YoutubeLogo,
  Blog:      Article,
}

function DetailModal({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.rascunho
  const ChannelIcon = CHANNEL_ICON[item.channel] ?? Globe
  const dateStr = new Date(item.targetDate).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <Badge color={cfg.color}>{cfg.label}</Badge>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <h2 className="font-semibold text-foreground text-base leading-snug">{item.title}</h2>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChannelIcon size={16} weight="duotone" className="text-primary" />
            <span>{item.channel}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="capitalize">{item.type}</span>
          </div>

          {item.briefing && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Briefing</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.briefing}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Data alvo</p>
            <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreateCalendarPage() {
  const { items } = useContent()
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)

  // Build a map: day → items in April
  const contentByDay: Record<number, ContentItem[]> = {}
  items.forEach((item) => {
    const date = new Date(item.targetDate)
    if (date.getMonth() === MONTH_INDEX) {
      const day = date.getDate()
      if (!contentByDay[day]) contentByDay[day] = []
      contentByDay[day].push(item)
    }
  })

  // Build cell array: null for empty prefix, number for day
  const cells: (number | null)[] = [
    ...Array<null>(MONTH_START_DAY).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ]

  // Today highlight (April 7)
  const today = 7

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconBubble color="orange" size="xl">
          <Calendar size={22} weight="duotone" />
        </IconBubble>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Calendário</h1>
          <p className="text-sm text-muted-foreground">{MONTH_LABEL}</p>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border/50">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-3">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayItems = day ? (contentByDay[day] ?? []) : []
            const isToday = day === today
            return (
              <div
                key={idx}
                className={`min-h-[72px] p-2 border-b border-r border-border/50 last:border-r-0 ${
                  isToday ? 'bg-secondary' : ''
                }`}
              >
                {day !== null && (
                  <>
                    {/* Day number */}
                    <span className={`text-xs font-medium ${isToday ? 'text-accent-foreground font-bold' : 'text-muted-foreground'}`}>
                      {day}
                    </span>

                    {/* Content dots + labels */}
                    <div className="mt-1 space-y-1">
                      {dayItems.slice(0, 2).map((item) => {
                        const dotCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.rascunho
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="w-full flex items-center gap-1 group text-left"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotCfg.dot}`} />
                            <span className="text-xs text-muted-foreground truncate group-hover:text-secondary-foreground transition-colors leading-tight">
                              {item.title}
                            </span>
                          </button>
                        )
                      })}
                      {dayItems.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{dayItems.length - 2}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(['rascunho', 'pronto', 'publicado', 'agendado'] as const).map((s) => {
          const cfg = STATUS_CONFIG[s]
          return (
            <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${badgeDotClass(cfg.color)}`} />
              {cfg.label}
            </div>
          )
        })}
      </div>

      {/* Detail modal */}
      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}
