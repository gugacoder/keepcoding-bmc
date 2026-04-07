import { Calendar } from '@phosphor-icons/react'
import { contentItems } from '@/data'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// April 2026: starts on Wednesday (day 3)
const startDay = 3
const daysInMonth = 30

// Map content by day
const contentByDay: Record<number, string[]> = {}
contentItems.forEach((item) => {
  const date = new Date(item.targetDate)
  if (date.getMonth() === 3) { // April
    const day = date.getDate()
    if (!contentByDay[day]) contentByDay[day] = []
    contentByDay[day].push(item.title)
  }
})

const cells: (number | null)[] = [
  ...Array(startDay).fill(null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
]

export function CreateCalendarPage() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Calendar size={22} weight="duotone" className="text-orange-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Calendário</h1>
          <p className="text-sm text-stone-400">Abril 2026</p>
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
          {cells.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[64px] p-2 border-b border-r border-amber-50 last:border-r-0 ${
                day === 7 ? 'bg-amber-50' : ''
              }`}
            >
              {day !== null && (
                <>
                  <span className={`text-xs font-medium ${day === 7 ? 'text-amber-600' : 'text-stone-500'}`}>
                    {day}
                  </span>
                  {contentByDay[day]?.map((title, i) => (
                    <div key={i} className="mt-1 text-xs bg-amber-100 text-amber-700 rounded px-1 py-0.5 truncate">
                      {title}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
