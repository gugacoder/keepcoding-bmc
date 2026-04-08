import { Globe, InstagramLogo } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BusinessData {
  businessName: string
  url: string
  socialHandle: string
}

interface Props {
  data: BusinessData
  onChange: (data: BusinessData) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function OnboardingStepBusiness({ data, onChange }: Props) {
  const { t } = useTranslation()

  function set(field: keyof BusinessData, value: string) {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {t('onboarding.business.title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('onboarding.business.subtitle')}
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {/* Business name — required */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="onboarding-business-name"
            className="text-sm font-medium text-foreground"
          >
            {t('onboarding.business.nameLabel')}
            <span className="text-amber-500 ml-1">*</span>
          </label>
          <input
            id="onboarding-business-name"
            type="text"
            placeholder={t('onboarding.business.namePlaceholder')}
            value={data.businessName}
            onChange={(e) => set('businessName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-400/60 dark:focus:ring-amber-600/60 transition-shadow text-sm"
            autoFocus
          />
        </div>

        {/* URL — optional */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="onboarding-url"
            className="text-sm font-medium text-foreground"
          >
            {t('onboarding.business.urlLabel')}
            <span className="text-muted-foreground/60 text-xs font-normal ml-1.5">{t('onboarding.business.optional')}</span>
          </label>
          <div className="relative">
            <Globe
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <input
              id="onboarding-url"
              type="url"
              placeholder={t('onboarding.business.urlPlaceholder')}
              value={data.url}
              onChange={(e) => set('url', e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-400/60 dark:focus:ring-amber-600/60 transition-shadow text-sm"
            />
          </div>
        </div>

        {/* Social handle — optional, single field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="onboarding-social"
            className="text-sm font-medium text-foreground"
          >
            {t('onboarding.business.socialLabel')}
            <span className="text-muted-foreground/60 text-xs font-normal ml-1.5">{t('onboarding.business.optional')}</span>
          </label>
          <div className="relative">
            <InstagramLogo
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <input
              id="onboarding-social"
              type="text"
              placeholder={t('onboarding.business.socialPlaceholder')}
              value={data.socialHandle}
              onChange={(e) => set('socialHandle', e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-400/60 dark:focus:ring-amber-600/60 transition-shadow text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
