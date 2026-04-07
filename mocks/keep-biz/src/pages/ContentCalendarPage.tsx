import { useState } from 'react'
import {
  CaretLeft,
  CaretRight,
  X,
  Plus,
  Check,
  ArrowCounterClockwise,
  Clock,
  Robot,
} from '@phosphor-icons/react'
import { teamMembers } from '@/data'
import { useContent } from '@/contexts/ContentContext'
import type { ContentItem, ContentStatus, ContentType, ContentPlatform, StatusHistoryEntry } from '@/data/types'

// ── Status helpers ─────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ContentStatus, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em Revisão',
  aprovado: 'Aprovado',
  agendado: 'Agendado',
  publicado: 'Publicado',
}

const STATUS_BG: Record<ContentStatus, string> = {
  rascunho: 'bg-slate-400',
  em_revisao: 'bg-amber-400',
  aprovado: 'bg-blue-500',
  agendado: 'bg-purple-500',
  publicado: 'bg-emerald-500',
}

const STATUS_CLASSES: Record<ContentStatus, string> = {
  rascunho: 'bg-slate-100 text-slate-600 border-slate-200',
  em_revisao: 'bg-amber-100 text-amber-700 border-amber-200',
  aprovado: 'bg-blue-100 text-blue-700 border-blue-200',
  agendado: 'bg-purple-100 text-purple-700 border-purple-200',
  publicado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const STATUS_DOT: Record<ContentStatus, string> = {
  rascunho: 'bg-slate-400',
  em_revisao: 'bg-amber-400',
  aprovado: 'bg-blue-500',
  agendado: 'bg-purple-500',
  publicado: 'bg-emerald-500',
}

const SWARM_PHASES: { phase: 'research' | 'draft' | 'schedule'; label: string; agent: string; contentId: string }[] = [
  { phase: 'research', label: 'Research', agent: 'Content Drafter', contentId: 'content-003' },
  { phase: 'draft', label: 'Rascunho', agent: 'Content Drafter', contentId: 'content-001' },
  { phase: 'schedule', label: 'Agendamento', agent: 'Schedule Keeper', contentId: 'content-004' },
]

const PHASE_CLASSES: Record<string, string> = {
  research: 'bg-violet-100 text-violet-700 border-violet-200',
  draft: 'bg-blue-100 text-blue-700 border-blue-200',
  schedule: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const DAY_LABELS_FULL = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

// ── Date helpers ──────────────────────────────────────────────────────────────

// Returns Monday-indexed day of week (0=Mon, 6=Sun)
function mondayDow(date: Date): number {
  return (date.getDay() + 6) % 7
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function getItemsForDate(items: ContentItem[], date: Date) {
  return items.filter(item => {
    const d = new Date(item.targetDate)
    return isSameDay(d, date)
  })
}

// Returns the Monday of the week containing `date`
function getMonday(date: Date): Date {
  const d = new Date(date)
  const dow = mondayDow(d)
  d.setDate(d.getDate() - dow)
  d.setHours(0, 0, 0, 0)
  return d
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${STATUS_CLASSES[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

// ── Schedule picker ───────────────────────────────────────────────────────────

function SchedulePicker({ onConfirm, onCancel }: { onConfirm: (d: string) => void; onCancel: () => void }) {
  const [date, setDate] = useState('')
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl p-5 w-72">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Agendar publicação</h3>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50">Cancelar</button>
          <button
            onClick={() => date && onConfirm(date)}
            disabled={!date}
            className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-40"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status timeline ───────────────────────────────────────────────────────────

function StatusTimeline({ history }: { history: StatusHistoryEntry[] }) {
  return (
    <div className="flex flex-col gap-3">
      {history.map((entry, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${i === history.length - 1 ? 'bg-blue-600' : 'bg-slate-300'}`} />
            {i < history.length - 1 && <div className="w-px h-6 bg-slate-200 mt-1" />}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2">
              <StatusBadge status={entry.status} />
              <span className="text-xs text-slate-400">
                {new Date(entry.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">por {entry.by}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Detail panel ──────────────────────────────────────────────────────────────

interface DetailPanelProps {
  item: ContentItem
  onClose: () => void
  onUpdateStatus: (id: string, status: ContentStatus, extra?: Partial<ContentItem>) => void
}

function DetailPanel({ item, onClose, onUpdateStatus }: DetailPanelProps) {
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const swarmPhase = SWARM_PHASES.find(p => p.contentId === item.id)

  function handleApprove() {
    const entry: StatusHistoryEntry = { status: 'aprovado', timestamp: new Date().toISOString(), by: 'Carlos Mendes' }
    onUpdateStatus(item.id, 'aprovado', { statusHistory: [...item.statusHistory, entry] })
  }
  function handleRequestReview() {
    const entry: StatusHistoryEntry = { status: 'em_revisao', timestamp: new Date().toISOString(), by: item.author }
    onUpdateStatus(item.id, 'em_revisao', { statusHistory: [...item.statusHistory, entry] })
  }
  function handleScheduleConfirm(date: string) {
    const entry: StatusHistoryEntry = { status: 'agendado', timestamp: new Date().toISOString(), by: item.author }
    onUpdateStatus(item.id, 'agendado', {
      targetDate: new Date(date).toISOString(),
      statusHistory: [...item.statusHistory, entry],
    })
    setShowSchedulePicker(false)
  }

  return (
    <>
      {showSchedulePicker && (
        <SchedulePicker onConfirm={handleScheduleConfirm} onCancel={() => setShowSchedulePicker(false)} />
      )}

      {/* Mobile backdrop */}
      <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 rounded-t-xl shadow-xl max-h-[85vh] overflow-y-auto
                      lg:static lg:border lg:rounded-lg lg:shadow-sm lg:max-h-none lg:overflow-visible lg:z-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-xl lg:rounded-t-lg">
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={16} /></button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="px-1.5 py-0.5 bg-slate-100 rounded">{item.platform}</span>
              <span>{item.author}</span>
              <span>·</span>
              <span>Meta: {new Date(item.targetDate).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Briefing</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.briefing}</p>
          </div>

          {swarmPhase && (
            <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
                <Robot size={14} className="text-blue-600" weight="duotone" />
                Swarm em andamento
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {SWARM_PHASES.map((phase) => (
                  <div
                    key={phase.phase}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium
                      ${phase.phase === swarmPhase.phase ? PHASE_CLASSES[phase.phase] : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                  >
                    {phase.phase === swarmPhase.phase && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                    {phase.label}
                    {phase.phase === swarmPhase.phase && <span className="text-xs opacity-70">· {phase.agent}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {item.status !== 'aprovado' && item.status !== 'publicado' && (
              <button onClick={handleApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                <Check size={13} weight="bold" /> Aprovar
              </button>
            )}
            {item.status !== 'em_revisao' && item.status !== 'publicado' && (
              <button onClick={handleRequestReview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 border border-amber-200 transition-colors">
                <ArrowCounterClockwise size={13} /> Solicitar revisão
              </button>
            )}
            {item.status !== 'agendado' && item.status !== 'publicado' && (
              <button onClick={() => setShowSchedulePicker(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 border border-purple-200 transition-colors">
                <Clock size={13} /> Agendar
              </button>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">Timeline</p>
            <StatusTimeline history={item.statusHistory} />
          </div>
        </div>
      </div>
    </>
  )
}

// ── New content dialog ─────────────────────────────────────────────────────────

interface NewContentDialogProps {
  prefillDate?: string
  onClose: () => void
  onSubmit: (item: ContentItem) => void
}

function NewContentDialog({ prefillDate, onClose, onSubmit }: NewContentDialogProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ContentType>('post')
  const [platform, setPlatform] = useState<ContentPlatform>('Instagram')
  const [author, setAuthor] = useState(teamMembers[0].name)
  const [briefing, setBriefing] = useState('')
  const [targetDate, setTargetDate] = useState(prefillDate ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toISOString()
    const newItem: ContentItem = {
      id: `content-${Date.now()}`,
      title: title.trim() || 'Sem título',
      type,
      platform,
      status: 'rascunho',
      author,
      briefing,
      targetDate: targetDate ? new Date(targetDate).toISOString() : now,
      createdAt: now,
      statusHistory: [{ status: 'rascunho', timestamp: now, by: author }],
    }
    onSubmit(newItem)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900">Nova Campanha</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Título</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Post lançamento de produto"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
              <select value={type} onChange={e => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="post">Post</option>
                <option value="short">Short</option>
                <option value="campanha">Campanha</option>
                <option value="criativo">Criativo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Plataforma</label>
              <select value={platform} onChange={e => setPlatform(e.target.value as ContentPlatform)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter/X</option>
                <option value="Multi">Multi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Autor</label>
            <select value={author} onChange={e => setAuthor(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {teamMembers.filter(m => m.active).map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Briefing</label>
            <textarea value={briefing} onChange={e => setBriefing(e.target.value)}
              placeholder="Descreva o objetivo, tom e contexto..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Data Alvo</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Monthly view ──────────────────────────────────────────────────────────────

interface MonthlyViewProps {
  year: number
  month: number // 0-indexed
  items: ContentItem[]
  onItemClick: (item: ContentItem) => void
  onDayClick: (dateStr: string) => void
}

function MonthlyView({ year, month, items, onItemClick, onDayClick }: MonthlyViewProps) {
  const today = new Date()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1)
  const startOffset = mondayDow(firstDay) // 0=Mon

  // Build cells array: nulls for padding, then 1..daysInMonth
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_LABELS.map(d => (
          <div key={d} className="py-2 text-center text-xs font-medium text-slate-500 border-r last:border-r-0 border-slate-100">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const cellDate = day ? new Date(year, month, day) : null
          const cellItems = cellDate ? getItemsForDate(items, cellDate) : []
          const isToday = cellDate ? isSameDay(cellDate, today) : false
          const dateStr = cellDate
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : ''

          return (
            <div
              key={idx}
              onClick={() => day && cellItems.length === 0 && onDayClick(dateStr)}
              className={`min-h-[90px] p-1.5 border-b border-r border-slate-100 transition-colors relative
                ${day ? (cellItems.length === 0 ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-slate-50') : 'bg-slate-50/40'}
                ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}`}
            >
              {day && (
                <>
                  {/* Day number */}
                  <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                    {day}
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-0.5">
                    {cellItems.slice(0, 3).map(item => (
                      <button
                        key={item.id}
                        onClick={e => { e.stopPropagation(); onItemClick(item) }}
                        className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate font-medium transition-opacity hover:opacity-80
                          ${STATUS_CLASSES[item.status]}`}
                        title={item.title}
                      >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${STATUS_DOT[item.status]}`} />
                        {item.title}
                      </button>
                    ))}
                    {cellItems.length > 3 && (
                      <span className="text-xs text-slate-400 pl-1">+{cellItems.length - 3} mais</span>
                    )}
                  </div>

                  {/* Empty day hint */}
                  {cellItems.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <Plus size={14} className="text-blue-400" />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Weekly view ───────────────────────────────────────────────────────────────

interface WeeklyViewProps {
  weekStart: Date // Monday of the week
  items: ContentItem[]
  onItemClick: (item: ContentItem) => void
  onDayClick: (dateStr: string) => void
}

function WeeklyView({ weekStart, items, onItemClick, onDayClick }: WeeklyViewProps) {
  const today = new Date()

  // Build 7 days starting from weekStart (Monday)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  return (
    <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {days.map((d, i) => {
          const isToday = isSameDay(d, today)
          return (
            <div key={i} className={`py-3 text-center border-r last:border-r-0 border-slate-100 ${isToday ? 'bg-blue-50' : ''}`}>
              <p className="text-xs font-medium text-slate-500">{DAY_LABELS_FULL[i]}</p>
              <p className={`text-lg font-semibold mt-0.5 mx-auto w-8 h-8 flex items-center justify-center rounded-full
                ${isToday ? 'bg-blue-600 text-white' : 'text-slate-800'}`}>
                {d.getDate()}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {d.toLocaleDateString('pt-BR', { month: 'short' })}
              </p>
            </div>
          )
        })}
      </div>

      {/* Item columns */}
      <div className="grid grid-cols-7 min-h-[300px]">
        {days.map((d, i) => {
          const dayItems = getItemsForDate(items, d)
          const isToday = isSameDay(d, today)
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

          return (
            <div
              key={i}
              onClick={() => dayItems.length === 0 && onDayClick(dateStr)}
              className={`p-2 border-r last:border-r-0 border-slate-100 flex flex-col gap-1.5 transition-colors min-h-[300px]
                ${isToday ? 'bg-blue-50/40' : ''}
                ${dayItems.length === 0 ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              {dayItems.map(item => (
                <button
                  key={item.id}
                  onClick={e => { e.stopPropagation(); onItemClick(item) }}
                  className={`w-full text-left rounded-md p-2 border transition-shadow hover:shadow-sm ${STATUS_CLASSES[item.status]}`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_BG[item.status]} shrink-0`} />
                    <span className="text-xs font-medium truncate">{STATUS_LABEL[item.status]}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.platform}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{item.author}</p>
                </button>
              ))}

              {dayItems.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <Plus size={16} className="text-slate-300" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ViewMode = 'monthly' | 'weekly'

export function ContentCalendarPage() {
  const { items, addItem, updateStatus } = useContent()

  const now = new Date()
  const [viewMode, setViewMode] = useState<ViewMode>('monthly')
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(now))

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [prefillDate, setPrefillDate] = useState<string | undefined>()

  const selectedItem = selectedItemId ? items.find(i => i.id === selectedItemId) ?? null : null

  // ── Navigation ──────────────────────────────────────────────────────────────

  function prevPeriod() {
    if (viewMode === 'monthly') {
      if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11) }
      else setCurrentMonth(m => m - 1)
    } else {
      const prev = new Date(currentWeekStart)
      prev.setDate(prev.getDate() - 7)
      setCurrentWeekStart(prev)
    }
  }

  function nextPeriod() {
    if (viewMode === 'monthly') {
      if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0) }
      else setCurrentMonth(m => m + 1)
    } else {
      const next = new Date(currentWeekStart)
      next.setDate(next.getDate() + 7)
      setCurrentWeekStart(next)
    }
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  function handleDayClick(dateStr: string) {
    setPrefillDate(dateStr)
    setShowNewDialog(true)
  }

  function handleCreate(newItem: ContentItem) {
    addItem(newItem)
    setShowNewDialog(false)
    setPrefillDate(undefined)
  }

  function handleUpdateStatus(id: string, status: ContentStatus, extra?: Partial<ContentItem>) {
    updateStatus(id, status, extra)
  }

  // ── Period label ─────────────────────────────────────────────────────────────

  const periodLabel = viewMode === 'monthly'
    ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
    : (() => {
        const end = new Date(currentWeekStart)
        end.setDate(end.getDate() + 6)
        const s = currentWeekStart
        if (s.getMonth() === end.getMonth()) {
          return `${s.getDate()}–${end.getDate()} de ${MONTH_NAMES[s.getMonth()]} ${s.getFullYear()}`
        }
        return `${s.getDate()} ${MONTH_NAMES[s.getMonth()]} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()]} ${end.getFullYear()}`
      })()

  return (
    <div className="flex h-full min-h-0">
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Calendário de Conteúdo</h1>
              <p className="text-sm text-slate-500 mt-0.5">Visão de agendamento e publicação</p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle — desktop only */}
              <div className="hidden sm:flex items-center border border-slate-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'weekly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Semanal
                </button>
              </div>

              {/* New content */}
              <button
                onClick={() => { setPrefillDate(undefined); setShowNewDialog(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} weight="bold" />
                <span className="hidden sm:inline">Nova Campanha</span>
                <span className="sm:hidden">Novo</span>
              </button>
            </div>
          </div>

          {/* Navigation bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={prevPeriod}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
                <CaretLeft size={16} />
              </button>
              <h2 className="text-sm font-semibold text-slate-800 min-w-[160px] text-center">{periodLabel}</h2>
              <button onClick={nextPeriod}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
                <CaretRight size={16} />
              </button>
            </div>

            {/* Today button */}
            <button
              onClick={() => { setCurrentYear(now.getFullYear()); setCurrentMonth(now.getMonth()); setCurrentWeekStart(getMonday(now)) }}
              className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              Hoje
            </button>
          </div>

          {/* Calendar */}
          {viewMode === 'monthly' ? (
            <MonthlyView
              year={currentYear}
              month={currentMonth}
              items={items}
              onItemClick={item => setSelectedItemId(item.id)}
              onDayClick={handleDayClick}
            />
          ) : (
            <WeeklyView
              weekStart={currentWeekStart}
              items={items}
              onItemClick={item => setSelectedItemId(item.id)}
              onDayClick={handleDayClick}
            />
          )}

          {/* Legend */}
          <div className="flex gap-4 flex-wrap mt-4">
            {(Object.entries(STATUS_BG) as [ContentStatus, string][]).map(([status, bgClass]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${bgClass}`} />
                <span className="text-xs text-slate-500">{STATUS_LABEL[status]}</span>
              </div>
            ))}
            <span className="text-xs text-slate-400 ml-auto italic">Click em dia vazio para criar conteúdo</span>
          </div>
        </div>
      </div>

      {/* Detail panel — desktop side */}
      {selectedItem && (
        <div className="hidden lg:block w-96 border-l border-slate-200 overflow-y-auto">
          <DetailPanel
            item={selectedItem}
            onClose={() => setSelectedItemId(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}

      {/* Detail panel — mobile overlay */}
      {selectedItem && (
        <div className="lg:hidden">
          <DetailPanel
            item={selectedItem}
            onClose={() => setSelectedItemId(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}

      {/* New content dialog */}
      {showNewDialog && (
        <NewContentDialog
          prefillDate={prefillDate}
          onClose={() => { setShowNewDialog(false); setPrefillDate(undefined) }}
          onSubmit={handleCreate}
        />
      )}
    </div>
  )
}
