import type { ElementType } from 'react'

interface EmptyStateProps {
  icon: ElementType
  title: string
  description: string
  ctaLabel?: string
  onCta?: () => void
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="mb-5 text-muted-foreground/30">
        <Icon size={64} weight="duotone" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">{description}</p>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 active:bg-primary/80 transition-colors shadow-sm"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
