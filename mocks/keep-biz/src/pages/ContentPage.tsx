import { useState } from 'react'
import {
  List,
  GridFour,
  Plus,
  CalendarBlank,
  Check,
  ArrowCounterClockwise,
  Clock,
  X,
  MagnifyingGlass,
  Robot,
} from '@phosphor-icons/react'
import { teamMembers } from '@/data'
import { useContent } from '@/contexts/ContentContext'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonCard } from '@/components/Skeleton'
import { useEffect } from 'react'
import type { ContentItem, ContentStatus, ContentType, ContentPlatform, StatusHistoryEntry } from '@/data/types'

// ── Status config ──────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ContentStatus, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em Revisão',
  aprovado: 'Aprovado',
  agendado: 'Agendado',
  publicado: 'Publicado',
}

const STATUS_CLASSES: Record<ContentStatus, string> = {
  rascunho: 'bg-slate-100 text-slate-600 border-slate-200',
  em_revisao: 'bg-amber-100 text-amber-700 border-amber-200',
  aprovado: 'bg-blue-100 text-blue-700 border-blue-200',
  agendado: 'bg-purple-100 text-purple-700 border-purple-200',
  publicado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const TYPE_LABEL: Record<ContentType, string> = {
  post: 'Post',
  short: 'Short',
  campanha: 'Campanha',
  criativo: 'Criativo',
}

// ── Swarm mock data ─────────────────────────────────────────────────────────────

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

// ── Status badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${STATUS_CLASSES[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

// ── New content dialog ─────────────────────────────────────────────────────────

interface NewContentDialogProps {
  onClose: () => void
  onSubmit: (item: ContentItem) => void
}

function NewContentDialog({ onClose, onSubmit }: NewContentDialogProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ContentType>('post')
  const [platform, setPlatform] = useState<ContentPlatform>('Instagram')
  const [author, setAuthor] = useState(teamMembers[0].name)
  const [briefing, setBriefing] = useState('')
  const [targetDate, setTargetDate] = useState('')

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
      <div className="relative bg-white rounded-md shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900">Nova Campanha</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Post lançamento de produto"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type + Platform */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="post">Post</option>
                <option value="short">Short</option>
                <option value="campanha">Campanha</option>
                <option value="criativo">Criativo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Plataforma</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as ContentPlatform)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter/X</option>
                <option value="Multi">Multi</option>
              </select>
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Autor</label>
            <select
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {teamMembers.filter(m => m.active).map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Briefing */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Briefing</label>
            <textarea
              value={briefing}
              onChange={e => setBriefing(e.target.value)}
              placeholder="Descreva o objetivo, tom e contexto do conteúdo..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Target date */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Data Alvo</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Schedule date picker ───────────────────────────────────────────────────────

interface SchedulePickerProps {
  onConfirm: (date: string) => void
  onCancel: () => void
}

function SchedulePicker({ onConfirm, onCancel }: SchedulePickerProps) {
  const [date, setDate] = useState('')
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-md shadow-xl p-5 w-72">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Agendar publicação</h3>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50">
            Cancelar
          </button>
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

// ── Timeline ───────────────────────────────────────────────────────────────────

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

// ── Preview panel ──────────────────────────────────────────────────────────────

interface PreviewPanelProps {
  item: ContentItem
  onClose: () => void
  onUpdateStatus: (id: string, status: ContentStatus, extra?: Partial<ContentItem>) => void
}

function PreviewPanel({ item, onClose, onUpdateStatus }: PreviewPanelProps) {
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)

  const swarmPhase = SWARM_PHASES.find(p => p.contentId === item.id)

  function handleApprove() {
    const entry: StatusHistoryEntry = { status: 'aprovado', timestamp: new Date().toISOString(), by: 'Carlos Mendes' }
    onUpdateStatus(item.id, 'aprovado', {
      statusHistory: [...item.statusHistory, entry],
    })
  }

  function handleRequestReview() {
    const entry: StatusHistoryEntry = { status: 'em_revisao', timestamp: new Date().toISOString(), by: item.author }
    onUpdateStatus(item.id, 'em_revisao', {
      statusHistory: [...item.statusHistory, entry],
    })
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
        <SchedulePicker
          onConfirm={handleScheduleConfirm}
          onCancel={() => setShowSchedulePicker(false)}
        />
      )}

      {/* Mobile overlay backdrop */}
      <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 rounded-t-xl shadow-xl max-h-[85vh] overflow-y-auto
                      lg:static lg:border lg:rounded-md lg:shadow-sm lg:max-h-none lg:overflow-visible lg:z-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-xl lg:rounded-t-md">
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            <span className="text-xs text-slate-400">{TYPE_LABEL[item.type]}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          {/* Title + meta */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="px-1.5 py-0.5 bg-slate-100 rounded">{item.platform}</span>
              <span>{item.author}</span>
              <span>·</span>
              <span>Meta: {new Date(item.targetDate).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Briefing */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Briefing</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.briefing}</p>
          </div>

          {/* Swarm indicator */}
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
                    {phase.phase === swarmPhase.phase && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    )}
                    {phase.label}
                    {phase.phase === swarmPhase.phase && (
                      <span className="text-xs opacity-70">· {phase.agent}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {item.status !== 'aprovado' && item.status !== 'publicado' && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Check size={13} weight="bold" />
                Aprovar
              </button>
            )}
            {item.status !== 'em_revisao' && item.status !== 'publicado' && (
              <button
                onClick={handleRequestReview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 border border-amber-200 transition-colors"
              >
                <ArrowCounterClockwise size={13} />
                Solicitar revisão
              </button>
            )}
            {item.status !== 'agendado' && item.status !== 'publicado' && (
              <button
                onClick={() => setShowSchedulePicker(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 border border-purple-200 transition-colors"
              >
                <Clock size={13} />
                Agendar
              </button>
            )}
          </div>

          {/* Status timeline */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">Timeline</p>
            <StatusTimeline history={item.statusHistory} />
          </div>
        </div>
      </div>
    </>
  )
}

// ── Content card (grid view) ───────────────────────────────────────────────────

function ContentCard({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-md border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 flex-1">{item.title}</h3>
        <StatusBadge status={item.status} />
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 flex-wrap">
        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{TYPE_LABEL[item.type]}</span>
        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{item.platform}</span>
        <span>{item.author}</span>
      </div>
      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.briefing}</p>
      <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
        <CalendarBlank size={12} />
        {new Date(item.targetDate).toLocaleDateString('pt-BR')}
      </div>
    </div>
  )
}

// ── Content row (list view) ────────────────────────────────────────────────────

function ContentRow({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  return (
    <tr
      onClick={onClick}
      className="hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100"
    >
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.title}</p>
      </td>
      <td className="px-4 py-3 text-xs text-slate-600">{TYPE_LABEL[item.type]}</td>
      <td className="px-4 py-3 text-xs text-slate-600">{item.platform}</td>
      <td className="px-4 py-3 text-xs text-slate-600">{item.author}</td>
      <td className="px-4 py-3">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">
        {new Date(item.targetDate).toLocaleDateString('pt-BR')}
      </td>
    </tr>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

type FilterStatus = ContentStatus | 'todos'

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'em_revisao', label: 'Em Revisão' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'publicado', label: 'Publicado' },
]

export function ContentPage() {
  const { items, addItem, updateStatus } = useContent()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const filtered = filterStatus === 'todos' ? items : items.filter(i => i.status === filterStatus)

  function handleCreate(newItem: ContentItem) {
    addItem(newItem)
    setShowNewDialog(false)
  }

  function handleUpdateStatus(id: string, status: ContentStatus, extra?: Partial<ContentItem>) {
    updateStatus(id, status, extra)
  }

  // Always derive from shared state to stay in sync
  const currentSelected = selectedItemId ? items.find(i => i.id === selectedItemId) ?? null : null

  return (
    <div className="flex h-full min-h-0">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Content Forge</h1>
              <p className="text-sm text-slate-500 mt-0.5">Pipeline de criação e publicação de conteúdo</p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="hidden sm:flex items-center border border-slate-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Vista em grid"
                >
                  <GridFour size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Vista em lista"
                >
                  <List size={16} />
                </button>
              </div>
              <button
                onClick={() => setShowNewDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} weight="bold" />
                Nova Campanha
              </button>
            </div>
          </div>

          {/* Swarm indicator bar */}
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              <Robot size={15} className="text-blue-600" weight="duotone" />
              <span className="text-xs font-medium text-slate-600">Swarm ativo:</span>
            </div>
            {SWARM_PHASES.map(p => (
              <div key={p.phase} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium shrink-0 ${PHASE_CLASSES[p.phase]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {p.label}
                <span className="opacity-70 font-normal">· {p.agent}</span>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap mb-5">
            {FILTER_OPTIONS.map(opt => {
              const count = opt.value === 'todos' ? items.length : items.filter(i => i.status === opt.value).length
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full border transition-colors ${
                    filterStatus === opt.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                  <span className={`${filterStatus === opt.value ? 'opacity-75' : 'opacity-60'}`}>({count})</span>
                </button>
              )
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={MagnifyingGlass}
              title="Nenhum item encontrado"
              description="Tente outro filtro ou crie novo conteúdo para sua campanha."
              ctaLabel="Nova campanha"
              onCta={() => setShowNewDialog(true)}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(item => (
                <ContentCard key={item.id} item={item} onClick={() => setSelectedItemId(item.id)} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Título</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Tipo</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Plataforma</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Autor</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Data Alvo</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <ContentRow key={item.id} item={item} onClick={() => setSelectedItemId(item.id)} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Preview panel — desktop side panel */}
      {currentSelected && (
        <div className="hidden lg:block w-96 border-l border-slate-200 overflow-y-auto">
          <PreviewPanel
            item={currentSelected}
            onClose={() => setSelectedItemId(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}

      {/* Preview panel — mobile overlay */}
      {currentSelected && (
        <div className="lg:hidden">
          <PreviewPanel
            item={currentSelected}
            onClose={() => setSelectedItemId(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}

      {/* New content dialog */}
      {showNewDialog && (
        <NewContentDialog onClose={() => setShowNewDialog(false)} onSubmit={handleCreate} />
      )}
    </div>
  )
}
