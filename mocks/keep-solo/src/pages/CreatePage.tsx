import { useState } from 'react'
import {
  PencilSimple,
  Plus,
  InstagramLogo,
  TiktokLogo,
  LinkedinLogo,
  YoutubeLogo,
  Article,
  X,
  CheckCircle,
  Globe,
} from '@phosphor-icons/react'
import { useContent } from '@/contexts/ContentContext'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonCard } from '@/components/Skeleton'
import { Badge, IconBubble, type BadgeColor } from '@/components/ui/badge'
import { useEffect } from 'react'
import type { ContentItem, ContentType, ContentChannel } from '@/data/types'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: BadgeColor }> = {
  rascunho:   { label: 'Rascunho',  color: 'muted' },
  em_revisao: { label: 'Em revisão', color: 'yellow' },
  pronto:     { label: 'Pronto',    color: 'amber' },
  aprovado:   { label: 'Pronto',    color: 'amber' },
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
          <Badge color={cfg.color}>{cfg.label}</Badge>
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

// ─── Create Dialog ─────────────────────────────────────────────────────────────
const TYPES: ContentType[] = ['post', 'short', 'criativo', 'artigo']
const CHANNELS: ContentChannel[] = ['Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'Blog']

function CreateDialog({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (item: ContentItem) => void
}) {
  const [title, setTitle]     = useState('')
  const [type, setType]       = useState<ContentType>('post')
  const [channel, setChannel] = useState<ContentChannel>('Instagram')
  const [briefing, setBriefing] = useState('')
  const [date, setDate]       = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const now = new Date().toISOString()
    onSubmit({
      id: `content-s-${Date.now()}`,
      title: title.trim(),
      type,
      channel,
      status: 'rascunho',
      briefing,
      targetDate: date ? new Date(date).toISOString() : now,
      createdAt: now,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <h2 className="font-semibold text-foreground text-base">Criar post</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
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

          {/* Type + Channel */}
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

          {/* Briefing */}
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

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Data alvo</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border border-border rounded-xl px-3.5 py-2.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Actions */}
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
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function CreatePage() {
  const { items, addItem, updateStatus } = useContent()
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

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
            <p className="text-sm text-muted-foreground">{items.length} conteúdo{items.length !== 1 ? 's' : ''}</p>
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

      {/* Content grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={PencilSimple}
          title="Nenhum conteúdo ainda"
          description="Crie seu primeiro post e o agente vai aprender seu estilo."
          ctaLabel="Criar post"
          onCta={() => setShowDialog(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onApprove={() => updateStatus(item.id, 'pronto')}
              onPublish={() => updateStatus(item.id, 'publicado')}
            />
          ))}
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <CreateDialog
          onClose={() => setShowDialog(false)}
          onSubmit={addItem}
        />
      )}
    </div>
  )
}
