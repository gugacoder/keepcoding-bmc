import { useNavigate } from 'react-router-dom'
import { UserCircle } from '@phosphor-icons/react'
import { profiles } from '@/data'
import type { Profile } from '@/data/types'

// ─── Status badge ─────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  ativo:     'bg-success/10 text-success border border-success/20',
  completo:  'bg-info/10 text-info border border-info/20',
  rascunho:  'bg-warning/10 text-warning border border-warning/20',
  inativo:   'bg-muted text-muted-foreground border border-border',
}

const STATUS_LABEL: Record<string, string> = {
  ativo:    'Ativo',
  completo: 'Completo',
  rascunho: 'Rascunho',
  inativo:  'Inativo',
}

// ─── Completeness bar ────────────────────────────────────────────────────

function completenessColor(pct: number) {
  if (pct < 50) return 'bg-destructive'
  if (pct < 80) return 'bg-warning'
  return 'bg-success'
}

// ─── Profile card ────────────────────────────────────────────────────────

function ProfileCard({ profile, onEdit }: { profile: Profile; onEdit: (id: string) => void }) {
  const isActive = profile.status === 'ativo'
  const daysAgo = Math.floor(
    (Date.now() - new Date(profile.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  )

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

      {/* Platforms */}
      {profile.platforms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {profile.platforms.map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
        <span className="text-xs text-muted-foreground">
          Atualizado há {daysAgo} {daysAgo === 1 ? 'dia' : 'dias'}
        </span>
        <button
          onClick={() => onEdit(profile.id)}
          className="px-3 py-1 text-xs font-medium rounded bg-muted hover:bg-accent text-foreground transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────

export function ProfilesPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Header */}
      <div className="col-span-full flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <UserCircle size={22} weight="duotone" className="text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Perfis</h1>
        </div>
        <button
          onClick={() => navigate('/profiles/new')}
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Criar Novo Perfil
        </button>
      </div>

      {/* Cards */}
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onEdit={(id) => navigate(`/profiles/new?edit=${id}`)}
        />
      ))}
    </div>
  )
}
