import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LinkedinLogo,
  InstagramLogo,
  TwitterLogo,
  FacebookLogo,
  YoutubeLogo,
  TiktokLogo,
  Globe,
} from '@phosphor-icons/react'
import type { Profile } from '@/data/types'

// ─── Status badge ─────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  ativo:    'bg-success/10 text-success border border-success/20',
  completo: 'bg-info/10 text-info border border-info/20',
  rascunho: 'bg-warning/10 text-warning border border-warning/20',
  inativo:  'bg-muted text-muted-foreground border border-border',
}


// ─── Platform icons ───────────────────────────────────────────────────────

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  LinkedIn:  <LinkedinLogo size={16} weight="fill" />,
  Instagram: <InstagramLogo size={16} weight="fill" />,
  Twitter:   <TwitterLogo size={16} weight="fill" />,
  Facebook:  <FacebookLogo size={16} weight="fill" />,
  YouTube:   <YoutubeLogo size={16} weight="fill" />,
  TikTok:    <TiktokLogo size={16} weight="fill" />,
}

// ─── Completeness bar ─────────────────────────────────────────────────────

function completenessColor(pct: number): string {
  if (pct < 50) return 'bg-destructive'
  if (pct < 80) return 'bg-warning'
  return 'bg-success'
}

// ─── Relative time ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function relativeTime(updatedAt: string, t: (key: string, opts?: any) => string): string {
  const days = Math.floor(
    (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days === 0) return t('profileCard.relativeTime.today')
  if (days === 1) return t('profileCard.relativeTime.oneDay')
  return t('profileCard.relativeTime.manyDays', { count: days })
}

// ─── Delete confirmation dialog ───────────────────────────────────────────

interface DeleteDialogProps {
  name: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteDialog({ name, onConfirm, onCancel }: DeleteDialogProps) {
  const { t } = useTranslation()
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-base font-semibold text-foreground">{t('profileCard.deleteDialog.title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('profileCard.deleteDialog.message', { name })}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-transparent hover:bg-accent text-foreground transition-colors"
          >
            {t('profileCard.deleteDialog.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
          >
            {t('profileCard.deleteDialog.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ProfileCard ──────────────────────────────────────────────────────────

export interface ProfileCardProps {
  profile: Profile
  onDelete?: (id: string) => void
}

export function ProfileCard({ profile, onDelete }: ProfileCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isActive = profile.status === 'ativo'
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleEdit = () => {
    navigate(`/profiles/new?edit=${profile.id}`)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false)
    onDelete?.(profile.id)
  }

  return (
    <>
      <div
        className={`bg-card rounded-md border shadow-sm p-5 flex flex-col gap-4 ${
          isActive ? 'border-blue-500' : 'border-border'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {profile.identity.businessName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {profile.niche.segment}
            </p>
          </div>
          <span
            className={`shrink-0 px-2.5 py-0.5 text-xs rounded-full font-medium ${
              STATUS_BADGE[profile.status] ?? 'bg-muted text-muted-foreground'
            }`}
          >
            {t(`profileCard.statusLabels.${profile.status}`, { defaultValue: profile.status })}
          </span>
        </div>

        {/* Completeness */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">{t('profileCard.completeness')}</span>
            <span className="text-xs font-medium text-foreground">{profile.completeness}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${completenessColor(profile.completeness)}`}
              style={{ width: `${profile.completeness}%` }}
            />
          </div>
        </div>

        {/* Platform icons */}
        {profile.platforms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.platforms.map((platform) => (
              <span
                key={platform}
                title={platform}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {PLATFORM_ICON[platform] ?? <Globe size={16} />}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
          <span className="text-xs text-muted-foreground">
            {relativeTime(profile.updatedAt, t)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-xs font-medium rounded bg-muted hover:bg-accent text-foreground transition-colors"
            >
              {t('profileCard.edit')}
            </button>
            {onDelete && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-3 py-1 text-xs font-medium rounded bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
              >
                {t('profileCard.delete')}
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteDialog
          name={profile.identity.businessName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  )
}
