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

const STATUS_LABEL: Record<string, string> = {
  ativo:    'Ativo',
  completo: 'Completo',
  rascunho: 'Rascunho',
  inativo:  'Inativo',
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

function relativeTime(updatedAt: string): string {
  const days = Math.floor(
    (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days === 0) return 'Atualizado hoje'
  if (days === 1) return 'Atualizado há 1 dia'
  return `Atualizado há ${days} dias`
}

// ─── ProfileCard ──────────────────────────────────────────────────────────

export interface ProfileCardProps {
  profile: Profile
  onEdit?: (id: string) => void
}

export function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const isActive = profile.status === 'ativo'

  return (
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
          {STATUS_LABEL[profile.status] ?? profile.status}
        </span>
      </div>

      {/* Completeness */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Completude</span>
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
          {relativeTime(profile.updatedAt)}
        </span>
        {onEdit && (
          <button
            onClick={() => onEdit(profile.id)}
            className="px-3 py-1 text-xs font-medium rounded bg-muted hover:bg-accent text-foreground transition-colors"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  )
}
