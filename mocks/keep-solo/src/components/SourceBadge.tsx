import { Robot } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import type { ContentSource } from '@/data/types'

interface SourceBadgeProps {
  source: ContentSource
}

export function SourceBadge({ source }: SourceBadgeProps) {
  if (source !== 'ai') return null

  return (
    <Badge color="purple" border>
      <Robot size={11} weight="duotone" />
      IA
    </Badge>
  )
}
