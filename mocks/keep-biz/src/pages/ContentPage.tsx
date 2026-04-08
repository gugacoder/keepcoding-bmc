import { useState, useRef } from 'react'
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
  CaretDown,
  Megaphone,
} from '@phosphor-icons/react'
import { teamMembers, campaigns as initialCampaigns } from '@/data'
import { useContent } from '@/contexts/ContentContext'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonCard } from '@/components/Skeleton'
import { useEffect } from 'react'
import type { ContentItem, ContentStatus, ContentType, ContentPlatform, StatusHistoryEntry, AiCampaign, AiCampaignPost } from '@/data/types'
import { ContentThumbnail } from '@/components/ContentThumbnail'
import { ProfileSelector } from '@/components/ProfileSelector'
import { useProfiles } from '@/contexts/ProfileContext'
import { useTranslation } from 'react-i18next'
import { useContentActions } from '@/hooks/useContentActions'
import { AiSuggestionCard } from '@/components/AiSuggestionCard'
import { SourceBadge } from '@/components/SourceBadge'

// ── Status config ──────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ContentStatus, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em Revisão',
  aprovado: 'Aprovado',
  agendado: 'Agendado',
  publicado: 'Publicado',
}

const STATUS_CLASSES: Record<ContentStatus, string> = {
  rascunho: 'bg-muted text-muted-foreground border-border',
  em_revisao: 'bg-warning/10 text-warning border-warning/20',
  aprovado: 'bg-info/10 text-info border-info/20',
  agendado: 'bg-violet/10 text-violet border-violet/20',
  publicado: 'bg-success/10 text-success border-success/20',
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
  research: 'bg-violet/10 text-violet border-violet/20',
  draft: 'bg-info/10 text-info border-info/20',
  schedule: 'bg-success/10 text-success border-success/20',
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
      <div className="relative bg-card rounded-md shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">Nova Campanha</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Post lançamento de produto"
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Type + Platform */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Tipo</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card"
              >
                <option value="post">Post</option>
                <option value="short">Short</option>
                <option value="campanha">Campanha</option>
                <option value="criativo">Criativo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Plataforma</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as ContentPlatform)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card"
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
            <label className="block text-xs font-medium text-foreground mb-1">Autor</label>
            <select
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card"
            >
              {teamMembers.filter(m => m.active).map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Briefing */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Briefing</label>
            <textarea
              value={briefing}
              onChange={e => setBriefing(e.target.value)}
              placeholder="Descreva o objetivo, tom e contexto do conteúdo..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Target date */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Data Alvo</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
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
      <div className="relative bg-card rounded-md shadow-xl p-5 w-72">
        <h3 className="text-sm font-semibold text-foreground mb-3">Agendar publicação</h3>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent">
            Cancelar
          </button>
          <button
            onClick={() => date && onConfirm(date)}
            disabled={!date}
            className="px-3 py-1.5 text-sm font-medium text-primary-foreground bg-violet rounded-md hover:bg-violet/90 disabled:opacity-40"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────

interface ToastState {
  message: string
  undoId?: string
}

// ── Edit suggestion dialog ────────────────────────────────────────────────────

interface EditSuggestionDialogProps {
  item: ContentItem
  onClose: () => void
  onSave: (updated: ContentItem) => void
}

function EditSuggestionDialog({ item, onClose, onSave }: EditSuggestionDialogProps) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(item.title)
  const [type, setType] = useState<ContentType>(item.type)
  const [platform, setPlatform] = useState<ContentPlatform>(item.platform)
  const [briefing, setBriefing] = useState(item.briefing ?? '')
  const [targetDate, setTargetDate] = useState(item.targetDate.slice(0, 10))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...item,
      title: title.trim() || item.title,
      type,
      platform,
      briefing,
      targetDate: targetDate ? new Date(targetDate).toISOString() : item.targetDate,
      status: 'aprovado',
      source: 'ai',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-md shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Robot size={16} weight="duotone" className="text-violet-500" />
            <h2 className="text-base font-semibold text-foreground">{t('autocreation.actions.edit')}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Tipo</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card"
              >
                <option value="post">Post</option>
                <option value="short">Short</option>
                <option value="campanha">Campanha</option>
                <option value="criativo">Criativo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Plataforma</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as ContentPlatform)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter/X</option>
                <option value="Multi">Multi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Briefing</label>
            <textarea
              value={briefing}
              onChange={e => setBriefing(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Data Alvo</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('autocreation.actions.saveAndApprove')}
            </button>
          </div>
        </form>
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
            <div className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${i === history.length - 1 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            {i < history.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2">
              <StatusBadge status={entry.status} />
              <span className="text-xs text-muted-foreground">
                {new Date(entry.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">por {entry.by}</p>
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

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-xl shadow-xl max-h-[85vh] overflow-y-auto
                      lg:static lg:border lg:rounded-md lg:shadow-sm lg:max-h-none lg:overflow-visible lg:z-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card rounded-t-xl lg:rounded-t-md">
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            <span className="text-xs text-muted-foreground">{TYPE_LABEL[item.type]}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          {/* Title + meta */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1">{item.title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-1.5 py-0.5 bg-muted rounded">{item.platform}</span>
              <span>{item.author}</span>
              <span>·</span>
              <span>Meta: {new Date(item.targetDate).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Briefing */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Briefing</p>
            <p className="text-sm text-foreground leading-relaxed">{item.briefing}</p>
          </div>

          {/* Swarm indicator */}
          {swarmPhase && (
            <div className="rounded-md border border-border bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Robot size={14} className="text-primary" weight="duotone" />
                Swarm em andamento
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {SWARM_PHASES.map((phase) => (
                  <div
                    key={phase.phase}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium
                      ${phase.phase === swarmPhase.phase ? PHASE_CLASSES[phase.phase] : 'bg-muted text-muted-foreground border-border'}`}
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                <Check size={13} weight="bold" />
                Aprovar
              </button>
            )}
            {item.status !== 'em_revisao' && item.status !== 'publicado' && (
              <button
                onClick={handleRequestReview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-warning bg-warning/10 rounded-md hover:bg-warning/20 border border-warning/20 transition-colors"
              >
                <ArrowCounterClockwise size={13} />
                Solicitar revisão
              </button>
            )}
            {item.status !== 'agendado' && item.status !== 'publicado' && (
              <button
                onClick={() => setShowSchedulePicker(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet bg-violet/10 rounded-md hover:bg-violet/20 border border-violet/20 transition-colors"
              >
                <Clock size={13} />
                Agendar
              </button>
            )}
          </div>

          {/* Status timeline */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Timeline</p>
            <StatusTimeline history={item.statusHistory} />
          </div>
        </div>
      </div>
    </>
  )
}

// ── Customize Campaign Dialog ─────────────────────────────────────────────────

interface CustomizeCampaignDialogProps {
  campaign: AiCampaign
  onClose: () => void
  onSave: (updated: AiCampaign) => void
}

function CustomizeCampaignDialog({ campaign, onClose, onSave }: CustomizeCampaignDialogProps) {
  const [title, setTitle] = useState(campaign.title)
  const [description, setDescription] = useState(campaign.description)
  const [posts, setPosts] = useState<AiCampaignPost[]>(campaign.posts.map(p => ({ ...p })))

  function updatePost(i: number, field: keyof AiCampaignPost, value: string) {
    setPosts(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ ...campaign, title, description, posts })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-md shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Megaphone size={16} weight="duotone" className="text-violet" />
            <h2 className="text-base font-semibold text-foreground">Personalizar campanha</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Título da campanha</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-2">Posts planejados</label>
            <div className="flex flex-col gap-3">
              {posts.map((post, i) => (
                <div key={i} className="border border-border rounded-md p-3 flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Post {i + 1}</span>
                  <input
                    type="text"
                    value={post.title}
                    onChange={e => updatePost(i, 'title', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Título do post"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={post.platform}
                      onChange={e => updatePost(i, 'platform', e.target.value as ContentPlatform)}
                      className="px-2 py-1.5 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring bg-card"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter/X</option>
                      <option value="Multi">Multi</option>
                    </select>
                    <input
                      type="date"
                      value={post.targetDate}
                      onChange={e => updatePost(i, 'targetDate', e.target.value)}
                      className="px-2 py-1.5 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-violet rounded-md hover:bg-violet/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Campaign Proposal Card ─────────────────────────────────────────────────────

const OBJECTIVE_LABEL: Record<string, string> = {
  alcance: 'Alcance',
  engajamento: 'Engajamento',
  conversao: 'Conversão',
}

const OBJECTIVE_CLASSES: Record<string, string> = {
  alcance: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  engajamento: 'bg-violet/10 text-violet border-violet/20',
  conversao: 'bg-success/10 text-success border-success/20',
}

interface CampaignProposalCardProps {
  campaign: AiCampaign
  onAccept: () => void
  onCustomize: () => void
  onDismiss: () => void
}

function CampaignProposalCard({ campaign, onAccept, onCustomize, onDismiss }: CampaignProposalCardProps) {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-violet/20 border-l-4 border-l-violet-500 bg-gradient-to-r from-violet-50/60 to-transparent dark:from-violet-950/20 dark:to-transparent p-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center shrink-0">
          <Megaphone size={18} weight="duotone" className="text-violet" />
        </div>
        <h3 className="text-sm font-semibold text-foreground flex-1 min-w-0">{campaign.title}</h3>
        <span className="px-2 py-0.5 text-xs font-medium bg-violet/10 text-violet border border-violet/20 rounded-full shrink-0">
          {t('autocreation.campaign.title')}
        </span>
      </div>

      {/* Description + objective */}
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{campaign.description}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground font-medium">Objetivo:</span>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${OBJECTIVE_CLASSES[campaign.objective] ?? ''}`}>
          {OBJECTIVE_LABEL[campaign.objective] ?? campaign.objective}
        </span>
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-1.5 mb-5">
        {campaign.posts.map((post, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-background/60 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground w-4 shrink-0 text-center">{i + 1}</span>
            <span className="text-sm text-foreground flex-1 min-w-0 line-clamp-1">{post.title}</span>
            <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded shrink-0">{post.platform}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(post.targetDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onAccept}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-violet rounded-md hover:bg-violet/90 transition-colors"
        >
          <Check size={14} weight="bold" />
          {t('autocreation.campaign.accept')}
        </button>
        <button
          onClick={onCustomize}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-violet bg-violet/10 border border-violet/20 rounded-md hover:bg-violet/20 transition-colors"
        >
          {t('autocreation.campaign.customize')}
        </button>
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          {t('autocreation.campaign.dismiss')}
        </button>
      </div>
    </div>
  )
}

// ── Content card (grid view) ───────────────────────────────────────────────────

function ContentCard({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-md border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="h-32 overflow-hidden">
        <ContentThumbnail thumbnail={item.thumbnail} type={item.type} title={item.title} />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 flex-1">{item.title}</h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <SourceBadge source={item.source} />
            <StatusBadge status={item.status} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 flex-wrap">
          <span className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{TYPE_LABEL[item.type]}</span>
          <span className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{item.platform}</span>
          <span>{item.author}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.briefing}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <CalendarBlank size={12} />
          {new Date(item.targetDate).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  )
}

// ── Content row (list view) ────────────────────────────────────────────────────

function ContentRow({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  return (
    <tr
      onClick={onClick}
      className="hover:bg-accent cursor-pointer transition-colors border-b border-border"
    >
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{TYPE_LABEL[item.type]}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{item.platform}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{item.author}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <SourceBadge source={item.source} />
          <StatusBadge status={item.status} />
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
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
  const { t } = useTranslation()
  const { items, addItem, updateStatus } = useContent()
  const { activeProfileId, profiles } = useProfiles()
  const { aiSuggestions, approveSuggestion, rejectSuggestion, updateContent } = useContentActions(activeProfileId)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [fadingIds, setFadingIds] = useState<Set<string>>(new Set())
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [campaignList, setCampaignList] = useState<AiCampaign[]>(initialCampaigns)
  const [customizingCampaign, setCustomizingCampaign] = useState<AiCampaign | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const undoBuffer = useRef<Map<string, ContentItem>>(new Map())
  const campaignUndoBuffer = useRef<Map<string, AiCampaign>>(new Map())

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  // Profile name lookup
  const profileNameMap = Object.fromEntries(
    profiles.map(p => [p.id, p.identity.businessName])
  )

  // Group suggestions by profileId for consolidated view
  const suggestionsByProfile: { profileId: string; profileName: string; items: ContentItem[] }[] = []
  if (activeProfileId === null) {
    const seen = new Map<string, ContentItem[]>()
    for (const item of aiSuggestions) {
      const pid = item.profileId ?? '__unknown__'
      if (!seen.has(pid)) seen.set(pid, [])
      seen.get(pid)!.push(item)
    }
    for (const [pid, groupItems] of seen.entries()) {
      suggestionsByProfile.push({
        profileId: pid,
        profileName: profileNameMap[pid] ?? pid,
        items: groupItems,
      })
    }
  }

  function toggleGroup(profileId: string) {
    setExpandedGroups(prev => ({
      ...prev,
      [profileId]: !(prev[profileId] ?? true),
    }))
  }

  function isGroupExpanded(profileId: string) {
    return expandedGroups[profileId] ?? true
  }

  // Content items for the main list (exclude ai+rascunho)
  const allNonSuggestions = items.filter(
    (it) => !(it.source === 'ai' && it.status === 'rascunho')
  )
  const profileItems = activeProfileId !== null
    ? allNonSuggestions.filter(i => i.profileId === activeProfileId)
    : allNonSuggestions
  const filtered = filterStatus === 'todos' ? profileItems : profileItems.filter(i => i.status === filterStatus)

  function showToast(msg: string, undoId?: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message: msg, undoId })
    toastTimer.current = setTimeout(() => {
      if (undoId) undoBuffer.current.delete(undoId)
      setToast(null)
    }, 5000)
  }

  function handleApprove(id: string) {
    approveSuggestion(id)
    showToast(t('autocreation.toast.approved'))
  }

  function handleEdit(item: ContentItem) {
    setEditingItem(item)
  }

  function handleEditSave(updated: ContentItem) {
    updateContent(updated.id, {
      title: updated.title,
      type: updated.type,
      platform: updated.platform,
      briefing: updated.briefing,
      targetDate: updated.targetDate,
      status: 'aprovado',
      source: 'ai',
    })
    setEditingItem(null)
    showToast(t('autocreation.toast.edited'))
  }

  function handleReject(item: ContentItem) {
    setFadingIds((prev) => new Set(prev).add(item.id))
    undoBuffer.current.set(item.id, item)

    setTimeout(() => {
      rejectSuggestion(item.id)
      setFadingIds((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }, 400)

    showToast(t('autocreation.toast.rejected'), item.id)
  }

  function handleUndo(id: string) {
    if (id.startsWith('campaign:')) {
      const campaignId = id.replace('campaign:', '')
      const saved = campaignUndoBuffer.current.get(campaignId)
      if (saved) {
        setCampaignList(prev => prev.map(c => c.id === campaignId ? saved : c))
        campaignUndoBuffer.current.delete(campaignId)
      }
      setToast(null)
      return
    }
    const saved = undoBuffer.current.get(id)
    if (saved) {
      addItem(saved)
      undoBuffer.current.delete(id)
    }
    setToast(null)
  }

  function handleAcceptCampaign(campaign: AiCampaign) {
    const now = new Date().toISOString()
    campaign.posts.forEach((post, i) => {
      const type: ContentType = post.platform === 'TikTok' ? 'short' : 'post'
      const newItem: ContentItem = {
        id: `content-${campaign.id}-${i}`,
        title: post.title,
        type,
        platform: post.platform,
        status: 'rascunho',
        source: 'ai',
        author: 'Agente IA',
        briefing: post.briefing,
        targetDate: new Date(post.targetDate).toISOString(),
        createdAt: now,
        statusHistory: [{ status: 'rascunho', timestamp: now, by: 'Agente IA' }],
        campaignId: campaign.id,
        profileId: campaign.profileId,
      }
      addItem(newItem)
    })
    setCampaignList(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'aceita' } : c))
    showToast(t('autocreation.campaign.accepted', { count: campaign.posts.length }))
  }

  function handleDismissCampaign(campaign: AiCampaign) {
    campaignUndoBuffer.current.set(campaign.id, campaign)
    setCampaignList(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'dispensada' } : c))
    showToast(t('autocreation.campaign.dismiss'), `campaign:${campaign.id}`)
  }

  function handleSaveCustomization(updated: AiCampaign) {
    setCampaignList(prev => prev.map(c => c.id === updated.id ? updated : c))
    setCustomizingCampaign(null)
    showToast(t('autocreation.campaign.updated'))
  }

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
        <ProfileSelector />
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Content Forge</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Pipeline de criação e publicação de conteúdo</p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="hidden sm:flex items-center border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title="Vista em grid"
                >
                  <GridFour size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title="Vista em lista"
                >
                  <List size={16} />
                </button>
              </div>
              <button
                onClick={() => setShowNewDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} weight="bold" />
                Nova Campanha
              </button>
            </div>
          </div>

          {/* Swarm indicator bar */}
          <div className="bg-muted border border-border rounded-md px-4 py-2.5 flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              <Robot size={15} className="text-primary" weight="duotone" />
              <span className="text-xs font-medium text-muted-foreground">Swarm ativo:</span>
            </div>
            {SWARM_PHASES.map(p => (
              <div key={p.phase} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium shrink-0 ${PHASE_CLASSES[p.phase]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {p.label}
                <span className="opacity-70 font-normal">· {p.agent}</span>
              </div>
            ))}
          </div>

          {/* ── Campanha IA ── */}
          {!loading && campaignList
            .filter(c =>
              c.status === 'proposta' &&
              (activeProfileId === null || c.profileId === activeProfileId)
            )
            .map(campaign => (
              <CampaignProposalCard
                key={campaign.id}
                campaign={campaign}
                onAccept={() => handleAcceptCampaign(campaign)}
                onCustomize={() => setCustomizingCampaign(campaign)}
                onDismiss={() => handleDismissCampaign(campaign)}
              />
            ))
          }

          {/* ── Sugestões da IA ── */}
          {!loading && aiSuggestions.length > 0 && (
            <section className="space-y-3">
              {/* Section header */}
              <div className="flex items-center gap-2">
                <Robot size={18} weight="duotone" className="text-blue-500" />
                <h2 className="text-sm font-semibold text-foreground">{t('autocreation.suggestions.titleBiz')}</h2>
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {t('autocreation.suggestions.pending', { count: aiSuggestions.length })}
                </span>
              </div>

              {activeProfileId === null ? (
                /* ── Consolidated grouped view (Todos os perfis) ── */
                <div className="space-y-4">
                  {suggestionsByProfile.map(({ profileId, profileName, items: groupItems }) => {
                    const expanded = isGroupExpanded(profileId)
                    return (
                      <div key={profileId} className="rounded-xl border border-blue-100 dark:border-blue-900/40 overflow-hidden">
                        {/* Profile group header */}
                        <button
                          onClick={() => toggleGroup(profileId)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">{profileName}</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">—</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              {t('autocreation.suggestions.pending', { count: groupItems.length })}
                            </span>
                          </div>
                          <CaretDown
                            size={14}
                            weight="bold"
                            className={`text-blue-500 transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`}
                          />
                        </button>

                        {/* Cards */}
                        {expanded && (
                          <div className="p-3">
                            {/* Mobile: horizontal scroll */}
                            <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
                              {groupItems.map((item) => (
                                <div key={item.id} className="snap-start shrink-0 w-72">
                                  <AiSuggestionCard
                                    item={item}
                                    fading={fadingIds.has(item.id)}
                                    onApprove={() => handleApprove(item.id)}
                                    onEdit={() => handleEdit(item)}
                                    onReject={() => handleReject(item)}
                                  />
                                </div>
                              ))}
                            </div>
                            {/* Desktop: 3-col grid */}
                            <div className="hidden md:grid grid-cols-3 gap-3">
                              {groupItems.map((item) => (
                                <AiSuggestionCard
                                  key={item.id}
                                  item={item}
                                  fading={fadingIds.has(item.id)}
                                  onApprove={() => handleApprove(item.id)}
                                  onEdit={() => handleEdit(item)}
                                  onReject={() => handleReject(item)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ── Flat list for specific profile ── */
                <>
                  {/* Mobile: horizontal scroll */}
                  <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none -mx-6 px-6">
                    {aiSuggestions.map((item) => (
                      <div key={item.id} className="snap-start shrink-0 w-72">
                        <AiSuggestionCard
                          item={item}
                          fading={fadingIds.has(item.id)}
                          onApprove={() => handleApprove(item.id)}
                          onEdit={() => handleEdit(item)}
                          onReject={() => handleReject(item)}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Desktop: 3-col grid */}
                  <div className="hidden md:grid grid-cols-3 gap-3">
                    {aiSuggestions.map((item) => (
                      <AiSuggestionCard
                        key={item.id}
                        item={item}
                        fading={fadingIds.has(item.id)}
                        onApprove={() => handleApprove(item.id)}
                        onEdit={() => handleEdit(item)}
                        onReject={() => handleReject(item)}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ── Divider ── */}
          {!loading && aiSuggestions.length > 0 && profileItems.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">{t('autocreation.divider.existingContent')}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map(opt => {
              const count = opt.value === 'todos' ? profileItems.length : profileItems.filter(i => i.status === opt.value).length
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full border transition-colors ${
                    filterStatus === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:bg-accent'
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
          ) : filtered.length === 0 && aiSuggestions.length === 0 ? (
            <EmptyState
              icon={MagnifyingGlass}
              title="Nenhum item encontrado"
              description="Tente outro filtro ou crie novo conteúdo para sua campanha."
              ctaLabel="Nova campanha"
              onCta={() => setShowNewDialog(true)}
            />
          ) : filtered.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <ContentCard key={item.id} item={item} onClick={() => setSelectedItemId(item.id)} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-md overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Título</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Tipo</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Plataforma</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Autor</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Data Alvo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => (
                      <ContentRow key={item.id} item={item} onClick={() => setSelectedItemId(item.id)} />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Preview panel — desktop side panel */}
      {currentSelected && (
        <div className="hidden lg:block w-96 border-l border-border overflow-y-auto">
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

      {/* Edit suggestion dialog */}
      {editingItem && (
        <EditSuggestionDialog
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Customize campaign dialog */}
      {customizingCampaign && (
        <CustomizeCampaignDialog
          campaign={customizingCampaign}
          onClose={() => setCustomizingCampaign(null)}
          onSave={handleSaveCustomization}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-foreground text-background text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg">
          <span>{toast.message}</span>
          {toast.undoId && (
            <button
              onClick={() => handleUndo(toast.undoId!)}
              className="text-xs underline opacity-80 hover:opacity-100"
            >
              {t('autocreation.actions.undo')}
            </button>
          )}
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100 ml-1">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
