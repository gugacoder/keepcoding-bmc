import { Robot, Check, PencilSimple, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import type { ContentItem } from '@/data/types'

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
      className={`relative bg-blue-50 dark:bg-blue-950/20 rounded-2xl border-l-4 border-blue-500 dark:border-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm transition-all duration-500 ${fading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* AI Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold px-2 py-0.5 rounded-full">
        <Robot size={12} weight="duotone" />
        <span>{t('autocreation.suggestions.badge')}</span>
      </div>

      <div className="p-4 space-y-3 pr-16">
        {/* Profile badge */}
        {profileName && (
          <div className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full">
            {profileName}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-blue-700 dark:text-blue-400">
            {TYPE_LABEL[item.type] ?? item.type}
          </span>
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
        <div className="flex gap-2 pt-1">
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-xl px-3 py-1.5 transition-colors"
          >
            <Check size={13} weight="bold" />
            {t('autocreation.actions.approve')}
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl px-3 py-1.5 transition-colors"
          >
            <PencilSimple size={13} weight="duotone" />
            {t('autocreation.actions.edit')}
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl px-3 py-1.5 transition-colors"
          >
            <X size={13} weight="bold" />
            {t('autocreation.actions.reject')}
          </button>
        </div>
      </div>
    </div>
  )
}
