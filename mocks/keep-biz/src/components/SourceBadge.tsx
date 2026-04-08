import { Robot } from '@phosphor-icons/react'
import type { ContentSource } from '@/data/types'

interface SourceBadgeProps {
  source: ContentSource
}

export function SourceBadge({ source }: SourceBadgeProps) {
  if (source !== 'ai') return null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50">
      <Robot size={11} weight="duotone" />
      IA
    </span>
  )
}
