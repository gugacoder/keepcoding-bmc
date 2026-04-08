import { useTranslation } from 'react-i18next'
import { Globe } from '@phosphor-icons/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
      <Select value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v)}>
        <SelectTrigger className="w-auto min-w-[100px] h-8 text-sm" aria-label={t('language.label')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map(({ code, labelKey }) => (
            <SelectItem key={code} value={code}>
              {t(labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
