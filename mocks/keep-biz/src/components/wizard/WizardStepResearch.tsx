import { useEffect, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'

// ─── Config ────────────────────────────────────────────────────────────────

const RESEARCH_ITEMS = [
  'Buscando informações...',
  'Analisando redes sociais...',
  'Identificando concorrentes...',
  'Mapeando segmento...',
  'Concluído!',
]

const ITEM_INTERVAL_MS = 1500
const AUTO_ADVANCE_DELAY_MS = 1000

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  businessName: string
  onComplete: () => void
}

export function WizardStepResearch({ businessName, onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)

    const timers: ReturnType<typeof setTimeout>[] = []

    RESEARCH_ITEMS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(index + 1)
        }, ITEM_INTERVAL_MS * (index + 1)),
      )
    })

    // Auto-advance 1s after last item appears
    timers.push(
      setTimeout(
        () => {
          onComplete()
        },
        ITEM_INTERVAL_MS * RESEARCH_ITEMS.length + AUTO_ADVANCE_DELAY_MS,
      ),
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [onComplete])

  const isDone = visibleCount >= RESEARCH_ITEMS.length

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Icon with animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <span className="absolute inline-flex h-20 w-20 rounded-full bg-primary/20 animate-ping" />
        {/* Spinner ring */}
        <span className="absolute inline-flex h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        {/* Icon */}
        <MagnifyingGlass
          size={36}
          weight="bold"
          className={['relative z-10 transition-colors', isDone ? 'text-primary' : 'text-primary/80'].join(' ')}
        />
      </div>

      {/* Main text */}
      <div className="text-center">
        <p className="text-base font-medium text-foreground">
          Pesquisando na internet sobre{' '}
          <span className="text-primary font-semibold">{businessName || 'seu negócio'}</span>...
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Isso pode levar alguns segundos. Por favor, aguarde.
        </p>
      </div>

      {/* Sequential items */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        {RESEARCH_ITEMS.map((item, index) => {
          const isVisible = index < visibleCount
          const isLast = index === RESEARCH_ITEMS.length - 1

          return (
            <div
              key={index}
              className={[
                'flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-500',
                isVisible
                  ? isLast
                    ? 'bg-primary/10 border-primary/30 opacity-100'
                    : 'bg-muted/60 border-border opacity-100'
                  : 'opacity-0 translate-y-1',
              ].join(' ')}
            >
              {/* Bullet / check */}
              <span
                className={[
                  'flex-shrink-0 w-2 h-2 rounded-full',
                  isLast && isVisible ? 'bg-primary' : 'bg-muted-foreground/50',
                ].join(' ')}
              />
              <span
                className={[
                  'text-sm',
                  isLast && isVisible ? 'font-semibold text-primary' : 'text-muted-foreground',
                ].join(' ')}
              >
                {item}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
