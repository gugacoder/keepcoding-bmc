import { contentItems } from '@/data'

const statusColor: Record<string, string> = {
  rascunho: 'bg-slate-200 text-slate-700',
  em_revisao: 'bg-amber-200 text-amber-800',
  aprovado: 'bg-emerald-200 text-emerald-800',
  publicado: 'bg-blue-200 text-blue-800',
  agendado: 'bg-purple-200 text-purple-800',
}

// Build a simple 30-day calendar for April 2026
const DAYS_IN_MONTH = 30
const FIRST_DAY_OF_WEEK = 2 // April 1, 2026 is Wednesday (0=Sun, so 3; but using Mon-start: 2)

function getDayItems(day: number) {
  return contentItems.filter((item) => {
    const d = new Date(item.targetDate)
    return d.getMonth() === 3 && d.getDate() === day // April = month 3
  })
}

export function ContentCalendarPage() {
  const cells = Array.from({ length: FIRST_DAY_OF_WEEK + DAYS_IN_MONTH }, (_, i) => {
    const day = i - FIRST_DAY_OF_WEEK + 1
    return day > 0 ? day : null
  })

  return (
    <div className="p-6 grid grid-cols-1 gap-6 items-start">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Calendário de Conteúdo</h1>
          <p className="text-sm text-slate-500 mt-0.5">Abril 2026</p>
        </div>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 bg-white">Mensal</button>
          <button className="px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50">Semanal</button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium text-slate-500 border-r last:border-r-0 border-slate-100">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const items = day ? getDayItems(day) : []
            return (
              <div
                key={idx}
                className="min-h-[80px] p-1.5 border-b border-r last-in-row:border-r-0 border-slate-100 hover:bg-slate-50 transition-colors"
              >
                {day && (
                  <>
                    <span className="text-xs font-medium text-slate-600 mb-1 block">{day}</span>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`text-xs px-1.5 py-0.5 rounded mb-0.5 truncate cursor-pointer ${statusColor[item.status] ?? 'bg-slate-100 text-slate-600'}`}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(statusColor).map(([status, cls]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${cls}`} />
            <span className="text-xs text-slate-500 capitalize">{status.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
