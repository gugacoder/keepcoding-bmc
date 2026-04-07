import { useState } from 'react'
import { teamMembers as initialTeamMembers, auditLog } from '@/data'
import { LanguageSelector } from '@/components/LanguageSelector'
import { useTheme } from '@/contexts/ThemeContext'
import type { TeamMember, TeamRole, AuditLogEntry, AuditResult } from '@/data/types'
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
  Bell,
  Robot,
  Megaphone,
  Monitor,
  Wrench,
  Lightning,
  ArrowUp,
  ClipboardText,
  Clock,
  WarningCircle,
  Check,
  Prohibit,
  Question,
} from '@phosphor-icons/react'

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-md shadow-xl animate-in slide-in-from-bottom-4">
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
        className="bg-white rounded-md shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
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
        className="bg-white rounded-md shadow-2xl w-full max-w-sm"
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

// ─── Plan upgrade comparison dialog ───────────────────────────────────────────

interface PlanDef {
  name: string
  price: string
  period: string
  highlight: boolean
  tag?: string
  features: string[]
  limits: { agents: string; connectors: string; users: string }
  ctaLabel: string
  ctaStyle: string
}

const PLANS: PlanDef[] = [
  {
    name: 'Starter',
    price: 'R$ 299',
    period: '/mês',
    highlight: false,
    features: [
      '2 agentes ativos',
      '5 conectores',
      '3 usuários',
      'Social Monitor básico',
      'Content Forge (50 posts/mês)',
      'Suporte via e-mail',
    ],
    limits: { agents: '2', connectors: '5', users: '3' },
    ctaLabel: 'Fazer downgrade',
    ctaStyle: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
  },
  {
    name: 'Business',
    price: 'R$ 799',
    period: '/mês',
    highlight: true,
    tag: 'Plano atual',
    features: [
      '5 agentes ativos',
      '10 conectores',
      '5 usuários',
      'Social Monitor completo',
      'Content Forge ilimitado',
      'Audit log 90 dias',
      'Suporte prioritário',
    ],
    limits: { agents: '5', connectors: '10', users: '5' },
    ctaLabel: 'Plano atual',
    ctaStyle: 'bg-blue-100 text-blue-700 cursor-default',
  },
  {
    name: 'Enterprise',
    price: 'R$ 1.999',
    period: '/mês',
    highlight: false,
    tag: 'Mais popular',
    features: [
      'Agentes ilimitados',
      'Conectores ilimitados',
      'Usuários ilimitados',
      'Deploy on-premise',
      'Audit log 1 ano',
      'RBAC avançado',
      'SLA 99.9% + suporte 24/7',
      'Onboarding dedicado',
    ],
    limits: { agents: '∞', connectors: '∞', users: '∞' },
    ctaLabel: 'Falar com vendas',
    ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700',
  },
]

function UpgradeDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Comparar planos</h2>
            <p className="text-sm text-slate-500 mt-0.5">Escolha o plano ideal para o seu negócio</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Plans grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-md border p-5 flex flex-col gap-4 ${
                plan.highlight
                  ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300 ring-offset-1'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Plan name + tag */}
              <div>
                {plan.tag && (
                  <span className={`inline-block mb-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                    plan.highlight
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {plan.tag}
                  </span>
                )}
                <h3 className="text-base font-semibold text-slate-900">{plan.name}</h3>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
              </div>

              {/* Limits pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: plan.limits.agents + ' agentes', icon: <Robot size={11} /> },
                  { label: plan.limits.connectors + ' conectores', icon: <Wrench size={11} /> },
                  { label: plan.limits.users + ' usuários', icon: <User size={11} /> },
                ].map(({ label, icon }) => (
                  <span key={label} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded-full text-slate-600">
                    {icon}
                    {label}
                  </span>
                ))}
              </div>

              {/* Features */}
              <ul className="space-y-1.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle size={14} weight="fill" className="text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full px-4 py-2 text-sm rounded-md font-medium transition-colors ${plan.ctaStyle}`}
              >
                {plan.ctaLabel}
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5 text-center">
          <p className="text-xs text-slate-400">Todos os planos incluem 14 dias de trial gratuito. Cancele a qualquer momento.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Audit log helpers ────────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  workflow_created: 'Workflow criado',
  workflow_deployed: 'Workflow implantado',
  agent_activated: 'Agente ativado',
  agent_paused: 'Agente pausado',
  content_approved: 'Conteúdo aprovado',
  content_published: 'Conteúdo publicado',
  connector_added: 'Conector adicionado',
  connector_removed: 'Conector removido',
  member_invited: 'Membro convidado',
  settings_updated: 'Configurações atualizadas',
  human_in_loop_requested: 'Confirmação solicitada',
  human_in_loop_approved: 'Ação aprovada pelo humano',
  human_in_loop_denied: 'Ação negada pelo humano',
}

const RESULT_CONFIG: Record<AuditResult, { label: string; className: string; icon: React.ReactNode }> = {
  success: {
    label: 'Sucesso',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: <Check size={11} weight="bold" />,
  },
  pending: {
    label: 'Pendente',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: <Clock size={11} />,
  },
  denied: {
    label: 'Negado',
    className: 'bg-red-50 text-red-600 border border-red-200',
    icon: <Prohibit size={11} />,
  },
  awaiting_confirmation: {
    label: 'Aguardando',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: <Question size={11} />,
  },
}

function AuditTable({ entries }: { entries: AuditLogEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="pb-2 text-left font-medium text-slate-500 pr-3">Ação</th>
            <th className="pb-2 text-left font-medium text-slate-500 pr-3">Entidade</th>
            <th className="pb-2 text-left font-medium text-slate-500 pr-3 hidden sm:table-cell">Quem</th>
            <th className="pb-2 text-left font-medium text-slate-500 pr-3 hidden md:table-cell">Quando</th>
            <th className="pb-2 text-left font-medium text-slate-500">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => {
            const result = RESULT_CONFIG[entry.result]
            return (
              <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50 group" title={entry.details}>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-1.5">
                    {entry.humanInLoop && (
                      <span title="Human-in-loop">
                        <WarningCircle size={13} weight="fill" className="text-amber-500 shrink-0" />
                      </span>
                    )}
                    <span className="text-slate-700 leading-snug">
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </span>
                  </div>
                </td>
                <td className="py-2 pr-3 max-w-[160px]">
                  <span className="truncate block text-slate-600">{entry.entity}</span>
                </td>
                <td className="py-2 pr-3 text-slate-500 whitespace-nowrap hidden sm:table-cell">
                  {entry.triggeredBy}
                </td>
                <td className="py-2 pr-3 text-slate-400 whitespace-nowrap hidden md:table-cell">
                  {new Date(entry.timestamp).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="py-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-medium ${result.className}`}>
                    {result.icon}
                    {result.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
        <WarningCircle size={11} weight="fill" className="text-amber-500" />
        Entradas com ícone laranja são ações com revisão humana (human-in-loop)
      </p>
    </div>
  )
}

// ─── Notification categories ──────────────────────────────────────────────────

interface NotifToggle {
  key: string
  label: string
  defaultOn: boolean
}

interface NotifCategory {
  id: string
  label: string
  icon: React.ReactNode
  toggles: NotifToggle[]
}

const NOTIF_CATEGORIES: NotifCategory[] = [
  {
    id: 'agentes',
    label: 'Agentes',
    icon: <Robot size={14} weight="duotone" className="text-blue-600" />,
    toggles: [
      { key: 'agentes.erro', label: 'Agente parou inesperadamente', defaultOn: true },
      { key: 'agentes.heartbeat', label: 'Heartbeat ativado', defaultOn: true },
      { key: 'agentes.confirmacao', label: 'Agente aguarda confirmação (human-in-loop)', defaultOn: true },
      { key: 'agentes.treinamento', label: 'Treinamento concluído', defaultOn: false },
    ],
  },
  {
    id: 'conteudo',
    label: 'Conteúdo',
    icon: <Megaphone size={14} weight="duotone" className="text-indigo-600" />,
    toggles: [
      { key: 'conteudo.revisao', label: 'Conteúdo pronto para revisão', defaultOn: true },
      { key: 'conteudo.agendado', label: 'Publicação agendada confirmada', defaultOn: false },
      { key: 'conteudo.publicado', label: 'Conteúdo publicado pelo agente', defaultOn: true },
    ],
  },
  {
    id: 'monitor',
    label: 'Monitor',
    icon: <Monitor size={14} weight="duotone" className="text-emerald-600" />,
    toggles: [
      { key: 'monitor.mencao_negativa', label: 'Menção negativa detectada', defaultOn: true },
      { key: 'monitor.score_caiu', label: 'Score de reputação caiu', defaultOn: true },
      { key: 'monitor.resumo_semanal', label: 'Resumo semanal de menções', defaultOn: false },
    ],
  },
  {
    id: 'sistema',
    label: 'Sistema',
    icon: <Wrench size={14} weight="duotone" className="text-slate-500" />,
    toggles: [
      { key: 'sistema.novo_membro', label: 'Novo membro na equipe', defaultOn: false },
      { key: 'sistema.plano', label: 'Renovação do plano se aproxima', defaultOn: true },
      { key: 'sistema.conector', label: 'Conector desconectado', defaultOn: true },
    ],
  },
]

function buildDefaultNotifs(): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  for (const cat of NOTIF_CATEGORIES) {
    for (const t of cat.toggles) {
      out[t.key] = t.defaultOn
    }
  }
  return out
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface ProfileFields {
  nome: string
  cnpj: string
  endereco: string
  setor: string
  email: string
}

function DarkModeCard() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="bg-card rounded-md border border-border p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground mb-3">Aparência</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground">Modo escuro</p>
          <p className="text-xs text-muted-foreground mt-0.5">Preferência salva automaticamente</p>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'
          }`}
          role="switch"
          aria-checked={theme === 'dark'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

type SettingsTab = 'perfil' | 'equipe' | 'notificacoes' | 'plano' | 'audit' | 'idioma'

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'notificacoes', label: 'Notificações' },
  { id: 'plano', label: 'Plano' },
  { id: 'audit', label: 'Audit Log' },
  { id: 'idioma', label: 'Idioma' },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil')

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

  // Notifications — grouped by category, persisted in session state
  const [notifications, setNotifications] = useState<Record<string, boolean>>(buildDefaultNotifs)

  function toggleNotification(key: string) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Plan upgrade dialog
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

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
      {showUpgradeDialog && (
        <UpgradeDialog onClose={() => setShowUpgradeDialog(false)} />
      )}

      <div className="p-6 max-w-5xl">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-slate-900">Configurações</h1>
          <p className="text-sm text-slate-500 mt-0.5">Empresa, equipe, notificações e plano</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 font-medium'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Perfil ─────────────────────────────────────────────────── */}
        {activeTab === 'perfil' && (
          <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm max-w-md">
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
        )}

        {/* ── Equipe ─────────────────────────────────────────────────── */}
        {activeTab === 'equipe' && (
          <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm max-w-lg">
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
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                    {member.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-slate-800 truncate">{member.name}</p>
                      {!member.active && (
                        <span className="text-xs text-amber-500 shrink-0">(pendente)</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{member.email}</p>
                  </div>
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
        )}

        {/* ── Notificações ───────────────────────────────────────────── */}
        {activeTab === 'notificacoes' && (
          <div className="max-w-lg space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Bell size={16} weight="duotone" className="text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Notificações</h2>
            </div>
            <p className="text-xs text-slate-500 -mt-2">As preferências abaixo são salvas na sessão.</p>

            {NOTIF_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-white rounded-md border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  {cat.icon}
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{cat.label}</h3>
                </div>
                <div className="space-y-2.5">
                  {cat.toggles.map((toggle) => (
                    <div key={toggle.key} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-700 leading-snug">{toggle.label}</span>
                      <button
                        onClick={() => toggleNotification(toggle.key)}
                        className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
                          notifications[toggle.key] ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                        role="switch"
                        aria-checked={notifications[toggle.key]}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            notifications[toggle.key] ? 'translate-x-4' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Plano ──────────────────────────────────────────────────── */}
        {activeTab === 'plano' && (
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightning size={16} weight="duotone" className="text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Seu Plano</h2>
            </div>

            {/* Current plan card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-md p-5 text-white mb-4 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-blue-200 font-medium uppercase tracking-wider mb-0.5">Plano atual</p>
                  <h3 className="text-xl font-bold">Business</h3>
                </div>
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">Ativo</span>
              </div>

              <div className="text-3xl font-bold mb-1">R$ 799<span className="text-lg text-blue-200 font-normal">/mês</span></div>

              <div className="mt-3 pt-3 border-t border-blue-500 space-y-1">
                {[
                  '5 agentes ativos',
                  '10 conectores',
                  '5 usuários',
                  'Audit log 90 dias',
                  'Suporte prioritário',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-blue-100">
                    <CheckCircle size={13} weight="fill" className="text-blue-300 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-blue-200">Renovação em 01/05/2026</p>
            </div>

            <button
              onClick={() => setShowUpgradeDialog(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-blue-300 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors shadow-sm"
            >
              <ArrowUp size={16} weight="bold" />
              Fazer upgrade
            </button>
            <p className="mt-2 text-xs text-slate-400 text-center">Compare todos os planos disponíveis</p>
          </div>
        )}

        {/* ── Audit Log ──────────────────────────────────────────────── */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-md border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardText size={16} weight="duotone" className="text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-800">Audit Log</h2>
              <span className="text-xs text-slate-400">({auditLog.length} entradas)</span>
            </div>
            <AuditTable entries={auditLog} />
          </div>
        )}

        {/* ── Idioma ─────────────────────────────────────────────────── */}
        {activeTab === 'idioma' && (
          <div className="space-y-4 max-w-xs">
            <div className="bg-card rounded-md border border-border p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-3">Idioma</h2>
              <LanguageSelector />
            </div>
            <DarkModeCard />
          </div>
        )}
      </div>
    </>
  )
}
