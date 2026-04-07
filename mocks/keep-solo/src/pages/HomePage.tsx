import { useTranslation } from 'react-i18next'
import { UserCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/LanguageSelector'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <UserCircle size={48} weight="duotone" className="text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            KeepSolo
          </h1>
        </div>
        <p className="max-w-md text-lg text-muted-foreground">
          {t('home.tagline')}
        </p>
        <Button size="lg">{t('home.cta')}</Button>
      </div>
    </div>
  )
}
