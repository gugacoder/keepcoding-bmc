import { useNavigate } from 'react-router-dom'
import { UserCircle, UserCirclePlus } from '@phosphor-icons/react'
import { useProfiles } from '@/contexts/ProfileContext'
import { ProfileCard } from '@/components/ProfileCard'
import { EmptyState } from '@/components/EmptyState'

// ─── Main Component ───────────────────────────────────────────────────────

export function ProfilesPage() {
  const navigate = useNavigate()
  const { profiles, removeProfile } = useProfiles()

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

      {/* Empty State / Cards */}
      {profiles.length === 0 ? (
        <div className="col-span-full">
          <EmptyState
            icon={UserCirclePlus}
            title="Nenhum perfil criado"
            description="Crie seu primeiro perfil para começar a gerenciar sua presença digital e produzir conteúdo com o agente."
            ctaLabel="Criar Primeiro Perfil"
            onCta={() => navigate('/profiles/new')}
          />
        </div>
      ) : (
        profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onDelete={removeProfile}
          />
        ))
      )}
    </div>
  )
}
