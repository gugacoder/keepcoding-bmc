import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Buildings, Tag, InstagramLogo, ArrowRight } from '@phosphor-icons/react'
import { useSoloProfile } from '@/contexts/ProfileContext'
import type { ToneOfVoice } from '@/data/types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  businessName: string
  socialHandle: string
  /** Detected segment from validation step — defaults to 'Saúde & Bem-estar' */
  segment?: string
}

// ─── Tone of voice options ────────────────────────────────────────────────────

const TONE_OPTIONS: { value: ToneOfVoice; label: string; description: string }[] = [
  { value: 'amigável',      label: 'Amigável',      description: 'Próximo, caloroso e acessível' },
  { value: 'formal',        label: 'Formal',         description: 'Profissional e respeitoso' },
  { value: 'casual',        label: 'Casual',         description: 'Descontraído e natural' },
  { value: 'técnico',       label: 'Técnico',        description: 'Preciso e detalhado' },
  { value: 'inspiracional', label: 'Inspiracional',  description: 'Motivador e empolgante' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingStepReady({ businessName, socialHandle, segment = 'Saúde & Bem-estar' }: Props) {
  const navigate = useNavigate()
  const { completeOnboarding } = useSoloProfile()
  const [tone, setTone] = useState<ToneOfVoice>('amigável')
  const [visible, setVisible] = useState(false)

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  function handleStart() {
    completeOnboarding()
    navigate('/monitor')
  }

  const displayHandle = socialHandle.trim()
    ? socialHandle.startsWith('@') ? socialHandle : `@${socialHandle}`
    : null

  return (
    <div
      className={[
        'flex flex-col gap-6 transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
    >
      {/* Success icon + title */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div
          className={[
            'w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center',
            'transition-transform duration-700',
            visible ? 'scale-100' : 'scale-0',
          ].join(' ')}
        >
          <CheckCircle size={40} weight="fill" className="text-amber-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">
            Pronto! Conheço seu negócio.
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aqui está o que aprendi sobre você.
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-amber-200/70 dark:border-amber-800/30 bg-amber-50/60 dark:bg-amber-950/20 divide-y divide-amber-200/60 dark:divide-amber-800/30">
        {/* Business name */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Buildings size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Negócio</p>
            <p className="text-sm font-semibold text-foreground">{businessName || 'Sem nome'}</p>
          </div>
        </div>

        {/* Segment */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Tag size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Segmento</p>
            <p className="text-sm font-semibold text-foreground">{segment}</p>
          </div>
        </div>

        {/* Main platform */}
        <div className="flex items-center gap-3 px-4 py-3">
          <InstagramLogo size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Rede social principal</p>
            <p className="text-sm font-semibold text-foreground">
              {displayHandle ?? 'Instagram'}
            </p>
          </div>
        </div>
      </div>

      {/* Tone of voice select */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="tone-select"
          className="text-sm font-medium text-foreground"
        >
          Como você quer se comunicar?
        </label>
        <select
          id="tone-select"
          value={tone}
          onChange={(e) => setTone(e.target.value as ToneOfVoice)}
          className="w-full rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
        >
          {TONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} — {opt.description}
            </option>
          ))}
        </select>
      </div>

      {/* CTA */}
      <button
        onClick={handleStart}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm shadow-amber-200 dark:shadow-amber-900/40"
      >
        Começar a usar
        <ArrowRight size={16} weight="bold" />
      </button>
    </div>
  )
}
