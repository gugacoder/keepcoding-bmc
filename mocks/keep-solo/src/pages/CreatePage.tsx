import { useState, useRef } from 'react'
import {
  PencilSimple,
  Plus,
  InstagramLogo,
  TiktokLogo,
  LinkedinLogo,
  YoutubeLogo,
  Article,
  X,
  Check,
  CheckCircle,
  Globe,
  Sparkle,
  Megaphone,
  CaretDown,
  CaretUp,
} from '@phosphor-icons/react'
import { useContent } from '@/contexts/ContentContext'
import { useContentActions } from '@/hooks/useContentActions'
import { AiSuggestionCard } from '@/components/AiSuggestionCard'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonCard } from '@/components/Skeleton'
import { Badge, IconBubble, type BadgeColor } from '@/components/ui/badge'
import { useEffect } from 'react'
import type { ContentItem, ContentType, ContentChannel, AiCampaign } from '@/data/types'
import { campaigns as initialCampaigns } from '@/data'
import { SourceBadge } from '@/components/SourceBadge'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: BadgeColor }> = {
  rascunho:   { label: 'Rascunho',  color: 'muted' },
  em_revisao: { label: 'Em revisão', color: 'yellow' },
  pronto:     { label: 'Pronto',    color: 'amber' },
  aprovado:   { label: 'Aprovado',  color: 'amber' },
  agendado:   { label: 'Agendado',  color: 'purple' },
  publicado:  { label: 'Publicado', color: 'green' },
}

// ─── Thumbnail config per channel ─────────────────────────────────────────────
const CHANNEL_THUMB: Record<string, { gradient: string; Icon: React.ElementType }> = {
  Instagram: { gradient: 'from-orange-400 to-pink-500',  Icon: InstagramLogo },
  TikTok:    { gradient: 'from-zinc-700 to-purple-700',  Icon: TiktokLogo },
  LinkedIn:  { gradient: 'from-blue-500 to-blue-700',    Icon: LinkedinLogo },
  YouTube:   { gradient: 'from-red-500 to-red-700',      Icon: YoutubeLogo },
  Blog:      { gradient: 'from-emerald-400 to-teal-600', Icon: Article },
}

function Thumbnail({ channel, thumbnail }: { channel: string; thumbnail?: string }) {
  const cfg = CHANNEL_THUMB[channel] ?? { gradient: 'from-amber-400 to-orange-500', Icon: Globe }
  const { gradient, Icon } = cfg
  const [imgError, setImgError] = useState(false)

  if (thumbnail && !imgError) {
    return (
      <div className="w-full h-28 rounded-xl overflow-hidden mb-4">
        <img
          src={thumbnail}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
      <Icon size={36} weight="duotone" className="text-white/80" />
    </div>
  )
}

// ─── Content card ─────────────────────────────────────────────────────────────
function ContentCard({ item, onApprove, onPublish }: {
  item: ContentItem
  onApprove: () => void
  onPublish: () => void
}) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.rascunho
  const isPublished = item.status === 'publicado'
  const isReady = item.status === 'pronto' || item.status === 'aprovado'

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4 pb-0">
        <Thumbnail channel={item.channel} thumbnail={item.thumbnail} />
      </div>
      <div className="p-4 pt-0 space-y-3">
        {/* Status + channel row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Badge color={cfg.color}>{cfg.label}</Badge>
            <SourceBadge source={item.source} />
          </div>
          <span className="text-xs text-muted-foreground">{item.channel}</span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-2">{item.title}</h3>
        <p className="text-xs text-muted-foreground capitalize">{item.type}</p>

        {/* Actions */}
        {!isPublished && (
          <div className="flex gap-2 pt-1">
            {!isReady && (
              <button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-secondary-foreground border border-border rounded-xl py-2 hover:bg-secondary transition-colors"
              >
                <CheckCircle size={14} weight="duotone" />
                Aprovar
              </button>
            )}
            <button
              onClick={onPublish}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
            >
              <Globe size={14} weight="duotone" />
              Publicar
            </button>
          </div>
        )}
        {isPublished && (
          <Badge color="green">
            <CheckCircle size={12} weight="fill" />
            Publicado
          </Badge>
        )}
      </div>
    </div>
  )
}

// ─── Create / Edit Dialog ──────────────────────────────────────────────────────
const TYPES: ContentType[] = ['post', 'short', 'criativo', 'artigo']
const CHANNELS: ContentChannel[] = ['Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'Blog']

interface DialogProps {
  onClose: () => void
  onSubmit: (item: ContentItem) => void
  prefill?: Partial<ContentItem>
  submitLabel?: string
}

function CreateDialog({ onClose, onSubmit, prefill, submitLabel = 'Criar' }: DialogProps) {
  const [title, setTitle]       = useState(prefill?.title ?? '')
  const [type, setType]         = useState<ContentType>(prefill?.type ?? 'post')
  const [channel, setChannel]   = useState<ContentChannel>(prefill?.channel ?? 'Instagram')
  const [briefing, setBriefing] = useState(prefill?.briefing ?? '')
  const [date, setDate]         = useState(
    prefill?.targetDate ? prefill.targetDate.slice(0, 10) : ''
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const now = new Date().toISOString()
    onSubmit({
      id: prefill?.id ?? `content-s-${Date.now()}`,
      title: title.trim(),
      type,
      channel,
      status: 'aprovado',
      source: prefill?.source ?? 'manual',
      briefing,
      targetDate: date ? new Date(date).toISOString() : now,
      createdAt: prefill?.createdAt ?? now,
      campaignId: prefill?.campaignId,
      aiSuggestionId: prefill?.aiSuggestionId,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <h2 className="font-semibold text-foreground text-base">
            {prefill ? 'Editar sugestão' : 'Criar post'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 5 dicas para aumentar suas vendas"
              className="w-full text-sm border border-border rounded-xl px-3.5 py-2.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder-muted-foreground/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full text-sm border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Canal</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as ContentChannel)}
                className="w-full text-sm border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
              >
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Briefing</label>
            <textarea
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              placeholder="Descreva o conteúdo, tom, CTA..."
              rows={3}
              className="w-full text-sm border border-border rounded-xl px-3.5 py-2.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none placeholder-muted-foreground/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Data alvo</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border border-border rounded-xl px-3.5 py-2.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm font-medium text-muted-foreground border border-border rounded-xl py-2.5 hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/80 rounded-xl py-2.5 transition-colors"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
interface ToastState {
  message: string
  undoId?: string
}

function Toast({ state, onClose, onUndo }: {
  state: ToastState
  onClose: () => void
  onUndo?: (id: string) => void
}) {
  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-foreground text-background text-sm px-5 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 whitespace-nowrap">
      <Check size={16} weight="bold" className="text-emerald-400 shrink-0" />
      <span>{state.message}</span>
      {state.undoId && onUndo && (
        <button
          onClick={() => { onUndo(state.undoId!); onClose() }}
          className="ml-2 text-xs font-semibold underline text-amber-300 hover:text-amber-200"
        >
          Desfazer
        </button>
      )}
      <button onClick={onClose} className="ml-2 text-muted shrink-0">
        <X size={14} weight="bold" />
      </button>
    </div>
  )
}

// ─── Campaign Banner ───────────────────────────────────────────────────────────
interface CampaignBannerProps {
  campaign: AiCampaign
  onAccept: () => void
  onDismiss: () => void
}

function CampaignBanner({ campaign, onAccept, onDismiss }: CampaignBannerProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-2xl border border-violet-200 dark:border-violet-800/50 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 overflow-hidden">
      {/* Compact header */}
      <div className="p-4 flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
          <Megaphone size={16} weight="duotone" className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground leading-snug">{campaign.title}</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 shrink-0">
              Campanha IA
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{campaign.description}</p>
          <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mt-1">
            {campaign.posts.length} posts planejados
          </p>
        </div>
      </div>

      {/* Expanded post list */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2">
          <div className="h-px bg-violet-100 dark:bg-violet-800/40 mb-3" />
          {campaign.posts.map((post, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="shrink-0 w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 font-bold flex items-center justify-center text-[10px]">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground leading-snug">{post.title}</p>
                <p className="text-muted-foreground mt-0.5">
                  {post.channel} · {new Date(post.targetDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
        <button
          onClick={onAccept}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
        >
          <Check size={12} weight="bold" />
          Aceitar
        </button>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 px-3 py-1.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
        >
          {expanded ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
          {expanded ? 'Ocultar' : 'Ver detalhes'}
        </button>
        <button
          onClick={onDismiss}
          className="text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
        >
          Dispensar
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function CreatePage() {
  const { items, addItem, updateStatus } = useContent()
  const { aiSuggestions, approveSuggestion, rejectSuggestion, updateContent } = useContentActions()

  const [showDialog, setShowDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [fadingIds, setFadingIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<ToastState | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const undoBuffer = useRef<Map<string, ContentItem>>(new Map())

  const [campaignList, setCampaignList] = useState<AiCampaign[]>(initialCampaigns)
  const campaignUndoBuffer = useRef<Map<string, AiCampaign>>(new Map())

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  function showToast(msg: string, undoId?: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message: msg, undoId })
    toastTimer.current = setTimeout(() => {
      // If there was an undo opportunity and it wasn't used, finalize the rejection
      if (undoId) undoBuffer.current.delete(undoId)
      setToast(null)
    }, 5000)
  }

  function handleApprove(id: string) {
    approveSuggestion(id)
    showToast('Sugestão aprovada! ✓')
  }

  function handleEdit(item: ContentItem) {
    setEditingItem(item)
  }

  function handleEditSave(updated: ContentItem) {
    updateContent(updated.id, {
      title: updated.title,
      type: updated.type,
      channel: updated.channel,
      briefing: updated.briefing,
      targetDate: updated.targetDate,
      status: 'aprovado',
      source: 'ai',
    })
    setEditingItem(null)
    showToast('Sugestão editada e aprovada!')
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

    showToast('Sugestão rejeitada', item.id)
  }

  function handleUndo(id: string) {
    if (id.startsWith('campaign:')) {
      const campaignId = id.replace('campaign:', '')
      const saved = campaignUndoBuffer.current.get(campaignId)
      if (saved) {
        setCampaignList((prev) => prev.map((c) => (c.id === campaignId ? saved : c)))
        campaignUndoBuffer.current.delete(campaignId)
      }
      return
    }
    const saved = undoBuffer.current.get(id)
    if (saved) {
      addItem(saved)
      undoBuffer.current.delete(id)
    }
  }

  function handleAcceptCampaign(campaign: AiCampaign) {
    const now = new Date().toISOString()
    campaign.posts.forEach((post, i) => {
      addItem({
        id: `content-${campaign.id}-${i}`,
        title: post.title,
        briefing: post.briefing,
        type: 'post',
        channel: post.channel,
        status: 'rascunho',
        source: 'ai',
        targetDate: post.targetDate,
        createdAt: now,
        campaignId: campaign.id,
      })
    })
    setCampaignList((prev) => prev.map((c) => (c.id === campaign.id ? { ...c, status: 'aceita' } : c)))
    showToast(`Campanha aceita! ${campaign.posts.length} posts criados.`)
  }

  function handleDismissCampaign(campaign: AiCampaign) {
    campaignUndoBuffer.current.set(campaign.id, campaign)
    setCampaignList((prev) => prev.map((c) => (c.id === campaign.id ? { ...c, status: 'dispensada' } : c)))
    showToast('Campanha dispensada', `campaign:${campaign.id}`)
  }

  // Contents = all items except ai+rascunho (those appear in the suggestion section)
  const displayContents = items.filter(
    (it) => !(it.source === 'ai' && it.status === 'rascunho')
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconBubble color="orange" size="xl">
            <PencilSimple size={22} weight="duotone" />
          </IconBubble>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Criar</h1>
            <p className="text-sm text-muted-foreground">{displayContents.length} conteúdo{displayContents.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} weight="bold" />
          Criar post
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {/* ── Campaign banners ── */}
          {campaignList
            .filter((c) => c.status === 'proposta')
            .map((campaign) => (
              <CampaignBanner
                key={campaign.id}
                campaign={campaign}
                onAccept={() => handleAcceptCampaign(campaign)}
                onDismiss={() => handleDismissCampaign(campaign)}
              />
            ))}

          {/* ── Sugestões para você ── */}
          {aiSuggestions.length > 0 && (
            <section className="space-y-3">
              {/* Section header */}
              <div className="flex items-center gap-2">
                <Sparkle size={18} weight="duotone" className="text-amber-500" />
                <h2 className="text-sm font-semibold text-foreground">Sugestões para você</h2>
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {aiSuggestions.length} {aiSuggestions.length === 1 ? 'nova' : 'novas'}
                </span>
              </div>

              {/* Mobile: horizontal scroll; Desktop: 2-col grid */}
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

              <div className="hidden md:grid grid-cols-2 gap-3">
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
            </section>
          )}

          {/* ── Divider ── */}
          {aiSuggestions.length > 0 && displayContents.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">Seu conteúdo</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          {/* ── Conteúdo existente ── */}
          {displayContents.length === 0 && aiSuggestions.length === 0 ? (
            <EmptyState
              icon={PencilSimple}
              title="Nenhum conteúdo ainda"
              description="Crie seu primeiro post e o agente vai aprender seu estilo."
              ctaLabel="Criar post"
              onCta={() => setShowDialog(true)}
            />
          ) : displayContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayContents.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onApprove={() => updateStatus(item.id, 'pronto')}
                  onPublish={() => updateStatus(item.id, 'publicado')}
                />
              ))}
            </div>
          ) : null}
        </>
      )}

      {/* ── Dialogs ── */}
      {showDialog && (
        <CreateDialog
          onClose={() => setShowDialog(false)}
          onSubmit={(item) => { addItem({ ...item, source: 'manual', status: 'rascunho' }); setShowDialog(false) }}
          submitLabel="Criar"
        />
      )}

      {editingItem && (
        <CreateDialog
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditSave}
          prefill={editingItem}
          submitLabel="Salvar e aprovar"
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          state={toast}
          onClose={() => setToast(null)}
          onUndo={handleUndo}
        />
      )}
    </div>
  )
}
