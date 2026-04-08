import { useNavigate } from 'react-router-dom'
import { UserCircle } from '@phosphor-icons/react'
import { profiles } from '@/data'
import { ProfileCard } from '@/components/ProfileCard'

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
