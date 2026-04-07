import { useState } from 'react'
import { Calendar, X, InstagramLogo, TiktokLogo, LinkedinLogo, YoutubeLogo, Article, Globe } from '@phosphor-icons/react'
import { useContent } from '@/contexts/ContentContext'
import type { ContentItem } from '@/data/types'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// April 2026 starts on Wednesday (index 3)
const MONTH_START_DAY = 3
const DAYS_IN_MONTH = 30
const MONTH_LABEL = 'Abril 2026'
const MONTH_INDEX = 3 // April = 3

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  rascunho:   { label: 'Rascunho',  dot: 'bg-stone-400',  badge: 'bg-stone-100 text-stone-600' },
  em_revisao: { label: 'Em revisão', dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700' },
  pronto:     { label: 'Pronto',    dot: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700' },
  aprovado:   { label: 'Pronto',    dot: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700' },
  agendado:   { label: 'Agendado',  dot: 'bg-purple-400', badge: 'bg-purple-100 text-purple-700' },
  publicado:  { label: 'Publicado', dot: 'bg-green-400',  badge: 'bg-green-100 text-green-700' },
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
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-amber-50">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>
            {cfg.label}
          </span>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <h2 className="font-semibold text-stone-800 text-base leading-snug">{item.title}</h2>

          <div className="flex items-center gap-2 text-sm text-stone-500">
            <ChannelIcon size={16} weight="duotone" className="text-amber-500" />
            <span>{item.channel}</span>
            <span className="text-stone-300">·</span>
            <span className="capitalize">{item.type}</span>
          </div>

          {item.briefing && (
            <div>
              <p className="text-xs font-medium text-stone-400 mb-1">Briefing</p>
              <p className="text-sm text-stone-600 leading-relaxed">{item.briefing}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-stone-400 mb-1">Data alvo</p>
            <p className="text-sm text-stone-600 capitalize">{dateStr}</p>
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
        <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Calendar size={22} weight="duotone" className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Calendário</h1>
          <p className="text-sm text-stone-400">{MONTH_LABEL}</p>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-amber-50">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-stone-400 py-3">{d}</div>
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
                className={`min-h-[72px] p-2 border-b border-r border-amber-50 last:border-r-0 ${
                  isToday ? 'bg-amber-50' : ''
                }`}
              >
                {day !== null && (
                  <>
                    {/* Day number */}
                    <span className={`text-xs font-medium ${isToday ? 'text-amber-600 font-bold' : 'text-stone-500'}`}>
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
                            <span className="text-xs text-stone-600 truncate group-hover:text-amber-700 transition-colors leading-tight">
                              {item.title}
                            </span>
                          </button>
                        )
                      })}
                      {dayItems.length > 2 && (
                        <span className="text-xs text-stone-400">+{dayItems.length - 2}</span>
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
            <div key={s} className="flex items-center gap-1.5 text-xs text-stone-500">
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
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
