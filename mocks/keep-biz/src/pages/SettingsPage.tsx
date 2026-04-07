import { useState } from 'react'
import { teamMembers as initialTeamMembers } from '@/data'
import { LanguageSelector } from '@/components/LanguageSelector'
import type { TeamMember, TeamRole } from '@/data/types'
import {
  PencilSimple,
  FloppyDisk,
  X,
  UserPlus,
  Buildings,
  ShieldCheck,
  Eye,
  Gear,
  CheckCircle,
  XCircle,
  User,
  Crown,
} from '@phosphor-icons/react'

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-4">
      <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-1 text-slate-400 hover:text-white">
        <X size={14} />
      </button>
    </div>
  )
}

// ─── RBAC definitions ─────────────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<TeamRole, { label: string; description: string; permissions: { text: string; granted: boolean }[] }> = {
  Admin: {
    label: 'Admin',
    description: 'Acesso total à plataforma. Pode gerenciar equipe, configurações e todos os recursos.',
    permissions: [
      { text: 'Gerenciar equipe e permissões', granted: true },
      { text: 'Configurações da empresa', granted: true },
      { text: 'Ativar / pausar agentes', granted: true },
      { text: 'Aprovar e publicar conteúdo', granted: true },
      { text: 'Ver relatórios e audit log', granted: true },
      { text: 'Gerenciar conectores', granted: true },
      { text: 'Criar e implantar workflows', granted: true },
    ],
  },
  Operador: {
    label: 'Operador',
    description: 'Pode operar agentes e aprovar conteúdo. Sem acesso a configurações administrativas.',
    permissions: [
      { text: 'Gerenciar equipe e permissões', granted: false },
      { text: 'Configurações da empresa', granted: false },
      { text: 'Ativar / pausar agentes', granted: true },
      { text: 'Aprovar e publicar conteúdo', granted: true },
      { text: 'Ver relatórios e audit log', granted: true },
      { text: 'Gerenciar conectores', granted: false },
      { text: 'Criar e implantar workflows', granted: true },
    ],
  },
  Viewer: {
    label: 'Viewer',
    description: 'Somente leitura. Pode visualizar dashboards, agentes e conteúdo, mas não fazer alterações.',
    permissions: [
      { text: 'Gerenciar equipe e permissões', granted: false },
      { text: 'Configurações da empresa', granted: false },
      { text: 'Ativar / pausar agentes', granted: false },
      { text: 'Aprovar e publicar conteúdo', granted: false },
      { text: 'Ver relatórios e audit log', granted: true },
      { text: 'Gerenciar conectores', granted: false },
      { text: 'Criar e implantar workflows', granted: false },
    ],
  },
}

const roleColor: Record<TeamRole, string> = {
  Admin: 'bg-blue-100 text-blue-700 border border-blue-200',
  Operador: 'bg-slate-100 text-slate-600 border border-slate-200',
  Viewer: 'bg-slate-50 text-slate-500 border border-slate-200',
}

const roleIcon: Record<TeamRole, React.ReactNode> = {
  Admin: <Crown size={12} weight="fill" className="text-blue-600" />,
  Operador: <Gear size={12} weight="fill" className="text-slate-500" />,
  Viewer: <Eye size={12} weight="fill" className="text-slate-400" />,
}

// ─── Member permissions modal ─────────────────────────────────────────────────

function MemberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const perms = ROLE_PERMISSIONS[member.role]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
              {member.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{member.name}</p>
              <p className="text-xs text-slate-400">{member.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Role badge + description */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${roleColor[member.role]}`}>
              {roleIcon[member.role]}
              {member.role}
            </span>
            <span className="text-xs text-slate-500">{member.department}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{perms.description}</p>
        </div>

        {/* Permissions list */}
        <div className="p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Permissões</p>
          <ul className="space-y-2">
            {perms.permissions.map(({ text, granted }) => (
              <li key={text} className="flex items-center gap-2">
                {granted ? (
                  <CheckCircle size={16} weight="fill" className="text-emerald-500 shrink-0" />
                ) : (
                  <XCircle size={16} weight="fill" className="text-slate-300 shrink-0" />
                )}
                <span className={`text-xs ${granted ? 'text-slate-700' : 'text-slate-400'}`}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4 pb-4">
          <p className="text-xs text-slate-400">
            Membro desde {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
            {!member.active && <span className="ml-2 text-amber-500">(Convite pendente)</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Invite dialog ─────────────────────────────────────────────────────────────

function InviteDialog({ onClose, onInvite }: {
  onClose: () => void
  onInvite: (email: string, role: TeamRole) => void
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamRole>('Viewer')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    onInvite(email.trim(), role)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">Convidar membro</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.com.br"
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Função</label>
            <div className="space-y-2">
              {(['Admin', 'Operador', 'Viewer'] as TeamRole[]).map((r) => (
                <label
                  key={r}
                  className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                    role === r ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-slate-800">{r}</span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full ${roleColor[r]}`}>
                        {roleIcon[r]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {r === 'Admin' && 'Acesso total à plataforma'}
                      {r === 'Operador' && 'Operar agentes + aprovar conteúdo'}
                      {r === 'Viewer' && 'Somente leitura'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Enviar convite
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface ProfileFields {
  nome: string
  cnpj: string
  endereco: string
  setor: string
  email: string
}

export function SettingsPage() {
  // Toast
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Company profile
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState<ProfileFields>({
    nome: 'Empresa Exemplo Ltda',
    cnpj: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 — São Paulo, SP',
    setor: 'Tecnologia',
    email: 'contato@empresa.com.br',
  })
  const [draftProfile, setDraftProfile] = useState<ProfileFields>({ ...savedProfile })

  function handleEditProfile() {
    setDraftProfile({ ...savedProfile })
    setIsEditingProfile(true)
  }

  function handleSaveProfile() {
    setSavedProfile({ ...draftProfile })
    setIsEditingProfile(false)
    showToast('Perfil da empresa atualizado com sucesso.')
  }

  function handleCancelProfile() {
    setDraftProfile({ ...savedProfile })
    setIsEditingProfile(false)
  }

  // Team
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  function handleInvite(email: string, role: TeamRole) {
    const initials = email.slice(0, 2).toUpperCase()
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      department: 'Operações',
      avatarInitials: initials,
      joinedAt: new Date().toISOString(),
      active: false,
    }
    setMembers((prev) => [...prev, newMember])
    setShowInviteDialog(false)
    showToast(`Convite enviado para ${email}.`)
  }

  // Notifications
  const [notifications, setNotifications] = useState({
    'Alertas de reputação': true,
    'Resumo semanal': true,
    'Agentes com erro': true,
    'Novos leads': false,
    'Relatórios prontos': true,
  })

  function toggleNotification(key: string) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const profileFields: { key: keyof ProfileFields; label: string; type?: string }[] = [
    { key: 'nome', label: 'Nome da empresa' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'setor', label: 'Setor' },
    { key: 'email', label: 'E-mail de contato', type: 'email' },
  ]

  return (
    <>
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Modals */}
      {showInviteDialog && (
        <InviteDialog onClose={() => setShowInviteDialog(false)} onInvite={handleInvite} />
      )}
      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {/* Header */}
        <div className="col-span-full">
          <h1 className="text-xl font-semibold text-slate-900">Configurações</h1>
          <p className="text-sm text-slate-500 mt-0.5">Empresa, equipe, notificações e plano</p>
        </div>

        {/* ── Company Profile ─────────────────────────────────────────── */}
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Buildings size={16} weight="duotone" className="text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Perfil da Empresa</h2>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-colors"
              >
                <PencilSimple size={13} />
                Editar
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button
                  onClick={handleCancelProfile}
                  className="px-2.5 py-1 text-xs border border-slate-200 text-slate-500 rounded hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <FloppyDisk size={13} />
                  Salvar
                </button>
              </div>
            )}
          </div>

          {/* Logo placeholder */}
          <div className="mb-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-md bg-slate-100 border border-slate-200 border-dashed flex items-center justify-center text-slate-400">
              <Buildings size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Logo da empresa</p>
              <button
                disabled={!isEditingProfile}
                className="mt-1 text-xs text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {isEditingProfile ? 'Trocar imagem' : 'Sem logo configurado'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {profileFields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs text-slate-500 mb-0.5">{label}</label>
                <input
                  type={type ?? 'text'}
                  value={isEditingProfile ? draftProfile[key] : savedProfile[key]}
                  onChange={(e) =>
                    isEditingProfile &&
                    setDraftProfile((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  disabled={!isEditingProfile}
                  className={`w-full px-2.5 py-1.5 text-sm border rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                    isEditingProfile
                      ? 'border-blue-300 bg-white'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Team ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={16} weight="duotone" className="text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Equipe</h2>
              <span className="text-xs text-slate-400">({members.length})</span>
            </div>
            <button
              onClick={() => setShowInviteDialog(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={13} />
              Convidar
            </button>
          </div>

          <div className="space-y-1">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-50 transition-colors text-left group"
                title="Ver permissões"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                  {member.avatarInitials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-slate-800 truncate">{member.name}</p>
                    {!member.active && (
                      <span className="text-xs text-amber-500 shrink-0">(pendente)</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{member.email}</p>
                </div>

                {/* Role badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${roleColor[member.role]}`}
                >
                  {roleIcon[member.role]}
                  {member.role}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck size={12} />
            Clique em um membro para ver permissões
          </p>
        </div>

        {/* ── Notifications ──────────────────────────────────────────── */}
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Notificações</h2>
          <div className="space-y-3">
            {(Object.entries(notifications) as [string, boolean][]).map(([label, on]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{label}</span>
                <button
                  onClick={() => toggleNotification(label)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    on ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      on ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Plan ───────────────────────────────────────────────────── */}
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

        {/* ── Language ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Idioma</h2>
          <LanguageSelector />
        </div>
      </div>
    </>
  )
}
