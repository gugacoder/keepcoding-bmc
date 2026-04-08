import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Lock } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { useProfiles } from '@/contexts/ProfileContext'

interface ProfileGateProps {
  children: ReactNode
}

export function ProfileGate({ children }: ProfileGateProps) {
  const { hasProfiles } = useProfiles()
  const { t } = useTranslation()

  if (hasProfiles) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Lock size={64} className="text-muted-foreground" weight="thin" />
      <p className="text-muted-foreground max-w-xs">
        {t('profileGate.message')}
      </p>
      <Link
        to="/profiles/new"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {t('profileGate.cta')}
      </Link>
    </div>
  )
}
