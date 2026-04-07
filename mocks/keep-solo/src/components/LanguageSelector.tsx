import { useTranslation } from 'react-i18next'
import { Globe } from '@phosphor-icons/react'

const LANGUAGES = [
  { code: 'pt', labelKey: 'language.pt' },
  { code: 'en', labelKey: 'language.en' },
  { code: 'es', labelKey: 'language.es' },
] as const

export function LanguageSelector() {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} weight="duotone" className="text-muted-foreground" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent text-sm text-foreground border border-input rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label={t('language.label')}
      >
        {LANGUAGES.map(({ code, labelKey }) => (
          <option key={code} value={code}>
            {t(labelKey)}
          </option>
        ))}
      </select>
    </div>
  )
}
