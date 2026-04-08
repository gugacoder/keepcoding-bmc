import { useProfiles } from '@/contexts/ProfileContext'

const STATUS_DOT: Record<string, string> = {
  ativo:     'bg-green-500',
  rascunho:  'bg-yellow-400',
  completo:  'bg-blue-500',
  inativo:   'bg-gray-400',
}

export function ProfileSelector() {
  const { profiles, activeProfileId, setActiveProfileId } = useProfiles()

  const tabs = [{ id: null, label: 'Todos os perfis', status: null }, ...profiles.map(p => ({
    id: p.id,
    label: p.identity.businessName,
    status: p.status,
  }))]

  return (
    <>
      {/* Desktop: tab group */}
      <div className="hidden sm:flex items-center gap-1 px-6 pt-4 pb-0 flex-wrap">
        {tabs.map((tab) => {
          const isActive = tab.id === activeProfileId
          return (
            <button
              key={tab.id ?? '__all__'}
              onClick={() => setActiveProfileId(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-t-md border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-foreground font-medium bg-card'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {tab.status && (
                <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[tab.status] ?? 'bg-gray-400'}`} />
              )}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Mobile: dropdown */}
      <div className="sm:hidden px-4 pt-4">
        <select
          value={activeProfileId ?? ''}
          onChange={(e) => setActiveProfileId(e.target.value === '' ? null : e.target.value)}
          className="w-full px-3 py-2 text-sm bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Todos os perfis</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.status === 'ativo' ? '🟢' : p.status === 'rascunho' ? '🟡' : '⚪'} {p.identity.businessName}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
