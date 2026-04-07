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
import { useEffect } from 'react'
import type { ContentItem, ContentType, ContentChannel } from '@/data/types'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  rascunho:   { label: 'Rascunho',  className: 'bg-stone-100 text-stone-500' },
  em_revisao: { label: 'Em revisão', className: 'bg-yellow-100 text-yellow-700' },
  pronto:     { label: 'Pronto',    className: 'bg-amber-100 text-amber-700' },
  aprovado:   { label: 'Pronto',    className: 'bg-amber-100 text-amber-700' },
  agendado:   { label: 'Agendado',  className: 'bg-purple-100 text-purple-700' },
  publicado:  { label: 'Publicado', className: 'bg-green-100 text-green-700' },
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
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4 pb-0">
        <Thumbnail channel={item.channel} thumbnail={item.thumbnail} />
      </div>
      <div className="p-4 pt-0 space-y-3">
        {/* Status + channel row */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.className}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-stone-400">{item.channel}</span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-stone-800 text-sm leading-snug line-clamp-2">{item.title}</h3>
        <p className="text-xs text-stone-400 capitalize">{item.type}</p>

        {/* Actions */}
        {!isPublished && (
          <div className="flex gap-2 pt-1">
            {!isReady && (
              <button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-amber-700 border border-amber-200 rounded-xl py-2 hover:bg-amber-50 transition-colors"
              >
                <CheckCircle size={14} weight="duotone" />
                Aprovar
              </button>
            )}
            <button
              onClick={onPublish}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700 border border-emerald-200 rounded-xl py-2 hover:bg-emerald-50 transition-colors"
            >
              <Globe size={14} weight="duotone" />
              Publicar
            </button>
          </div>
        )}
        {isPublished && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <CheckCircle size={14} weight="fill" />
            Publicado
          </div>
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

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-50">
          <h2 className="font-semibold text-stone-800 text-base">Criar post</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 5 dicas para aumentar suas vendas"
              className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-stone-300"
              required
            />
          </div>

          {/* Type + Channel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Canal</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as ContentChannel)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
              >
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Briefing */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Briefing</label>
            <textarea
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              placeholder="Descreva o conteúdo, tom, CTA..."
              rows={3}
              className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none placeholder-stone-300"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Data alvo</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm font-medium text-stone-500 border border-stone-200 rounded-xl py-2.5 hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-xl py-2.5 transition-colors"
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
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
            <PencilSimple size={22} weight="duotone" className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-800">Criar</h1>
            <p className="text-sm text-stone-400">{items.length} conteúdo{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
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
