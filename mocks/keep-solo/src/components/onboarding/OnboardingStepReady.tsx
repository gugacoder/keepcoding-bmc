import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Buildings, Tag, InstagramLogo, ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { useSoloProfile } from '@/contexts/ProfileContext'
import type { ToneOfVoice } from '@/data/types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  businessName: string
  socialHandle: string
  /** Detected segment from validation step — defaults to 'Saúde & Bem-estar' */
  segment?: string
}

// ─── Tone key mapping ─────────────────────────────────────────────────────────
// ToneOfVoice values use accented chars; map them to i18n-safe keys

const TONE_VALUES: ToneOfVoice[] = ['amigável', 'formal', 'casual', 'técnico', 'inspiracional']

function toneKey(value: ToneOfVoice): string {
  const map: Record<ToneOfVoice, string> = {
    'amigável': 'amigavel',
    'formal': 'formal',
    'casual': 'casual',
    'técnico': 'tecnico',
    'inspiracional': 'inspiracional',
  }
  return map[value]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingStepReady({ businessName, socialHandle, segment = 'Saúde & Bem-estar' }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { completeOnboarding } = useSoloProfile()
  const [tone, setTone] = useState<ToneOfVoice>('amigável')
  const [visible, setVisible] = useState(false)

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
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
            {t('onboarding.ready.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('onboarding.ready.subtitle')}
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-amber-200/70 dark:border-amber-800/30 bg-amber-50/60 dark:bg-amber-950/20 divide-y divide-amber-200/60 dark:divide-amber-800/30">
        {/* Business name */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Buildings size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">{t('onboarding.ready.businessLabel')}</p>
            <p className="text-sm font-semibold text-foreground">{businessName || t('onboarding.ready.noName')}</p>
          </div>
        </div>

        {/* Segment */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Tag size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">{t('onboarding.ready.segmentLabel')}</p>
            <p className="text-sm font-semibold text-foreground">{segment}</p>
          </div>
        </div>

        {/* Main platform */}
        <div className="flex items-center gap-3 px-4 py-3">
          <InstagramLogo size={18} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">{t('onboarding.ready.socialLabel')}</p>
            <p className="text-sm font-semibold text-foreground">
              {displayHandle ?? t('onboarding.ready.defaultSocial')}
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
          {t('onboarding.ready.toneLabel')}
        </label>
        <select
          id="tone-select"
          value={tone}
          onChange={(e) => setTone(e.target.value as ToneOfVoice)}
          className="w-full rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
        >
          {TONE_VALUES.map((value) => (
            <option key={value} value={value}>
              {t(`onboarding.ready.tones.${toneKey(value)}.label`)} — {t(`onboarding.ready.tones.${toneKey(value)}.description`)}
            </option>
          ))}
        </select>
      </div>

      {/* CTA */}
      <button
        onClick={handleStart}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm shadow-amber-200 dark:shadow-amber-900/40"
      >
        {t('onboarding.ready.cta')}
        <ArrowRight size={16} weight="bold" />
      </button>
    </div>
  )
}
