import { teamMembers } from '@/data'
import { LanguageSelector } from '@/components/LanguageSelector'

const roleColor: Record<string, string> = {
  Admin: 'bg-blue-100 text-blue-700',
  Operador: 'bg-slate-100 text-slate-600',
  Viewer: 'bg-slate-50 text-slate-500',
}

export function SettingsPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* Header */}
      <div className="col-span-full">
        <h1 className="text-xl font-semibold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500 mt-0.5">Empresa, equipe, notificações e plano</p>
      </div>

      {/* Company profile */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Perfil da Empresa</h2>
        <div className="space-y-3">
          {[
            { label: 'Nome', value: 'Empresa Exemplo Ltda' },
            { label: 'CNPJ', value: '12.345.678/0001-90' },
            { label: 'Setor', value: 'Tecnologia' },
            { label: 'Email de contato', value: 'contato@empresa.com.br' },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-xs text-slate-500 mb-0.5">{label}</label>
              <input
                defaultValue={value}
                className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          ))}
          <button className="w-full mt-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
            Salvar
          </button>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-800">Equipe</h2>
          <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            + Convidar
          </button>
        </div>
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                {member.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">{member.name}</p>
                <p className="text-xs text-slate-400 truncate">{member.email}</p>
              </div>
              <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${roleColor[member.role] ?? 'bg-slate-100'}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Notificações</h2>
        <div className="space-y-3">
          {[
            { label: 'Alertas de reputação', on: true },
            { label: 'Resumo semanal', on: true },
            { label: 'Agentes com erro', on: true },
            { label: 'Novos leads', on: false },
            { label: 'Relatórios prontos', on: true },
          ].map(({ label, on }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-slate-700">{label}</span>
              <div
                className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${on ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Plano</h2>
        <div className="rounded-md bg-blue-50 border border-blue-200 p-3 mb-3">
          <p className="text-sm font-semibold text-blue-900">Plano Business</p>
          <p className="text-xs text-blue-700 mt-0.5">5 agentes · 10 conectores · 5 usuários</p>
          <p className="text-xs text-blue-600 mt-1">Renova em 01/05/2026</p>
        </div>
        <button className="w-full px-3 py-1.5 border border-blue-300 text-blue-700 text-sm rounded-md hover:bg-blue-50 transition-colors">
          Ver opções de upgrade
        </button>
      </div>

      {/* Language */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Idioma</h2>
        <LanguageSelector />
      </div>
    </div>
  )
}
