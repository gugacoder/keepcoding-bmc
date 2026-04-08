import { Check, PencilSimple, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import type { ContentItem } from '@/data/types'
import { Badge } from '@/components/ui/badge'
import { SourceBadge } from '@/components/SourceBadge'

const PLATFORM_LABEL: Record<string, string> = {
  Instagram: 'Instagram',
  TikTok: 'TikTok',
  LinkedIn: 'LinkedIn',
  Twitter: 'Twitter/X',
  Multi: 'Multi',
}

const TYPE_LABEL: Record<string, string> = {
  post: 'Post',
  short: 'Short',
  campanha: 'Campanha',
  criativo: 'Criativo',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

interface AiSuggestionCardProps {
  item: ContentItem
  profileName?: string
  onApprove: () => void
  onEdit: () => void
  onReject: () => void
  fading?: boolean
}

export function AiSuggestionCard({
  item,
  profileName,
  onApprove,
  onEdit,
  onReject,
  fading = false,
}: AiSuggestionCardProps) {
  const { t } = useTranslation()
  return (
    <div
      className={`relative bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl border border-blue-200/40 dark:border-blue-800/30 shadow-sm transition-all duration-500 ${fading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* AI Badge */}
      <div className="absolute top-3 right-3">
        <SourceBadge source="ai" />
      </div>

      <div className="p-3 space-y-2 pr-14">
        {/* Profile badge */}
        {profileName && (
          <Badge color="blue">{profileName}</Badge>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge color="blue">{TYPE_LABEL[item.type] ?? item.type}</Badge>
          <span>·</span>
          <span>{PLATFORM_LABEL[item.platform] ?? item.platform}</span>
          <span>·</span>
          <span>{formatDate(item.targetDate)}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
          {item.title}
        </h3>

        {/* Briefing preview */}
        {item.briefing && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.briefing}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={onApprove}
            className="flex items-center gap-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg px-2.5 py-1 transition-colors shadow-sm"
          >
            <Check size={12} weight="bold" />
            {t('autocreation.actions.approve')}
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-[11px] font-semibold text-secondary-foreground border border-border hover:bg-secondary rounded-lg px-2.5 py-1 transition-colors"
          >
            <PencilSimple size={12} weight="duotone" />
            {t('autocreation.actions.editShort')}
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1 text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 rounded-lg px-2.5 py-1 transition-colors shadow-sm"
          >
            <X size={12} weight="bold" />
            {t('autocreation.actions.reject')}
          </button>
        </div>
      </div>
    </div>
  )
}
