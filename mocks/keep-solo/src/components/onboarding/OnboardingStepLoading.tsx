import { useEffect, useState } from 'react'

// ─── Config ────────────────────────────────────────────────────────────────

const LOADING_ITEMS = [
  'Procurando na internet...',
  'Analisando suas redes...',
  'Entendendo seu mercado...',
  'Quase lá...',
]

const ITEM_INTERVAL_MS = 1500
const AUTO_ADVANCE_DELAY_MS = 1000

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void
}

export function OnboardingStepLoading({ onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)

    const timers: ReturnType<typeof setTimeout>[] = []

    LOADING_ITEMS.forEach((_, index) => {
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
        ITEM_INTERVAL_MS * LOADING_ITEMS.length + AUTO_ADVANCE_DELAY_MS,
      ),
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [onComplete])

  const isDone = visibleCount >= LOADING_ITEMS.length

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Animated icon */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-20 w-20 rounded-full bg-amber-400/25 animate-ping" />
        <span className="absolute inline-flex h-16 w-16 rounded-full border-4 border-amber-300 border-t-amber-500 animate-spin" />
        <span
          className={[
            'relative z-10 text-3xl transition-transform duration-500',
            isDone ? 'scale-110' : 'scale-100',
          ].join(' ')}
        >
          {isDone ? '✨' : '🔍'}
        </span>
      </div>

      {/* Main text */}
      <div className="text-center">
        <p className="text-base font-medium text-foreground">
          Deixa eu dar uma olhada no seu mercado...
        </p>
        <p className="text-sm text-amber-600/70 dark:text-amber-400/60 mt-1">
          Isso leva só alguns segundos.
        </p>
      </div>

      {/* Sequential items */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        {LOADING_ITEMS.map((item, index) => {
          const isVisible = index < visibleCount
          const isLast = index === LOADING_ITEMS.length - 1

          return (
            <div
              key={index}
              className={[
                'flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-500',
                isVisible
                  ? isLast
                    ? 'bg-amber-100/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 opacity-100'
                    : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/40 opacity-100'
                  : 'opacity-0 translate-y-1',
              ].join(' ')}
            >
              <span
                className={[
                  'flex-shrink-0 w-2 h-2 rounded-full',
                  isLast && isVisible ? 'bg-amber-500' : 'bg-amber-300 dark:bg-amber-700',
                ].join(' ')}
              />
              <span
                className={[
                  'text-sm',
                  isLast && isVisible
                    ? 'font-semibold text-amber-700 dark:text-amber-300'
                    : 'text-amber-600/80 dark:text-amber-400/70',
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
