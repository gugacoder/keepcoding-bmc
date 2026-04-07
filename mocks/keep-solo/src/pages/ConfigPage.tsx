import { useState } from 'react'
import {
  Gear, User, Bell, CreditCard, Globe,
  PencilSimple, FloppyDisk, X, Check,
  Crown, Lightning, UserCircle,
  CurrencyCircleDollar, Newspaper, Robot, Tag, Moon,
} from '@phosphor-icons/react'
import { LanguageSelector } from '../components/LanguageSelector'
import { useTheme } from '../contexts/ThemeContext'

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-stone-800 text-white text-sm px-5 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Check size={16} weight="bold" className="text-amber-400 shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-stone-400 hover:text-white transition-colors">
        <X size={14} weight="bold" />
      </button>
    </div>
  )
}

// ─── Dark mode toggle ─────────────────────────────────────────────────────────

function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-foreground font-medium">Modo escuro</p>
        <p className="text-xs text-muted-foreground mt-0.5">Preferência salva automaticamente</p>
      </div>
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          theme === 'dark' ? 'bg-amber-500' : 'bg-stone-200'
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
  )
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-amber-50 flex items-center gap-2">
        <span className="text-amber-500">{icon}</span>
        <h2 className="font-semibold text-stone-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
        checked ? 'bg-amber-500' : 'bg-stone-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// ─── Upgrade Dialog ───────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    price: 'R$97',
    period: '/mês',
    description: 'Para começar',
    color: 'stone',
    features: ['1 agente', '500 ações/mês', 'Monitor básico', 'Suporte email'],
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$197',
    period: '/mês',
    description: 'Mais poder',
    color: 'amber',
    features: ['3 agentes', '2.000 ações/mês', 'Monitor completo', 'Calendário IA', 'Suporte prioritário'],
    current: false,
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R$397',
    period: '/mês',
    description: 'Escala máxima',
    color: 'orange',
    features: ['Agentes ilimitados', 'Ações ilimitadas', 'Tudo do Pro', 'API access', 'Onboarding dedicado'],
    current: false,
  },
]

function UpgradeDialog({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown size={20} weight="duotone" className="text-amber-500" />
            <h2 className="font-semibold text-stone-800 text-lg">Escolha seu plano</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`text-left rounded-2xl border-2 p-4 transition-all ${
                plan.highlight
                  ? 'border-amber-400 bg-amber-50'
                  : selected === plan.id
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-stone-100 bg-white hover:border-amber-200'
              }`}
            >
              {plan.highlight && (
                <span className="inline-block bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                  Popular
                </span>
              )}
              {plan.current && (
                <span className="inline-block bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full mb-2">
                  Atual
                </span>
              )}
              <div className="mb-3">
                <p className="font-bold text-stone-800 text-lg">{plan.name}</p>
                <p className="text-stone-500 text-xs">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-0.5 mb-4">
                <span className="text-2xl font-bold text-stone-900">{plan.price}</span>
                <span className="text-stone-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-stone-600">
                    <Check size={12} weight="bold" className="text-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-stone-200 hover:bg-stone-50 text-stone-600 text-sm font-medium py-3 rounded-2xl transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!selected || PLANS.find((p) => p.id === selected)?.current}
            className="flex-2 flex-grow bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <Lightning size={16} weight="duotone" />
            {selected && !PLANS.find((p) => p.id === selected)?.current
              ? `Assinar plano ${PLANS.find((p) => p.id === selected)?.name}`
              : 'Selecione um plano'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const DEFAULT_PROFILE = {
  name: 'Ana Lima',
  email: 'ana@nutriana.com.br',
}

const NOTIFICATION_ITEMS = [
  { id: 'leads', label: 'Novo lead capturado', icon: <UserCircle size={16} weight="duotone" />, default: true },
  { id: 'content', label: 'Conteúdo pronto para revisar', icon: <Newspaper size={16} weight="duotone" />, default: false },
  { id: 'agent', label: 'Agente precisa de atenção', icon: <Robot size={16} weight="duotone" />, default: true },
  { id: 'payments', label: 'Pagamento recebido', icon: <CurrencyCircleDollar size={16} weight="duotone" />, default: true },
  { id: 'tips', label: 'Dicas e sugestões do agente', icon: <Tag size={16} weight="duotone" />, default: false },
] as const

type NotifId = (typeof NOTIFICATION_ITEMS)[number]['id']

export function ConfigPage() {
  // Profile state
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [editProfile, setEditProfile] = useState(false)
  const [draftProfile, setDraftProfile] = useState(DEFAULT_PROFILE)
  const [toast, setToast] = useState<string | null>(null)

  // Notifications state
  const [notifs, setNotifs] = useState<Record<NotifId, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_ITEMS.map((n) => [n.id, n.default])) as Record<NotifId, boolean>
  )

  // Plan state
  const [showUpgrade, setShowUpgrade] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleSaveProfile = () => {
    setProfile(draftProfile)
    setEditProfile(false)
    showToast('Perfil salvo com sucesso!')
  }

  const handleCancelProfile = () => {
    setDraftProfile(profile)
    setEditProfile(false)
  }

  const handleEditProfile = () => {
    setDraftProfile(profile)
    setEditProfile(true)
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
          <Gear size={22} weight="duotone" className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Config</h1>
          <p className="text-sm text-stone-400">Suas preferências</p>
        </div>
      </div>

      {/* Profile */}
      <Section icon={<User size={16} weight="duotone" />} title="Perfil">
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0">
              {profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <div>
              <p className="font-semibold text-stone-800">{profile.name}</p>
              <p className="text-sm text-stone-400">{profile.email}</p>
              <button className="text-xs text-amber-500 hover:text-amber-600 mt-1 transition-colors">
                Trocar foto
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-stone-500 mb-1.5 block">Nome</label>
              <input
                type="text"
                value={editProfile ? draftProfile.name : profile.name}
                disabled={!editProfile}
                onChange={(e) => setDraftProfile((p) => ({ ...p, name: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl text-sm text-stone-700 outline-none transition-colors ${
                  editProfile
                    ? 'bg-white border border-amber-300 focus:border-amber-400'
                    : 'bg-amber-50 border border-amber-100 cursor-default'
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-500 mb-1.5 block">Email</label>
              <input
                type="email"
                value={editProfile ? draftProfile.email : profile.email}
                disabled={!editProfile}
                onChange={(e) => setDraftProfile((p) => ({ ...p, email: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl text-sm text-stone-700 outline-none transition-colors ${
                  editProfile
                    ? 'bg-white border border-amber-300 focus:border-amber-400'
                    : 'bg-amber-50 border border-amber-100 cursor-default'
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          {!editProfile ? (
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              <PencilSimple size={14} weight="duotone" />
              Editar perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                <FloppyDisk size={14} weight="duotone" />
                Salvar
              </button>
              <button
                onClick={handleCancelProfile}
                className="flex items-center gap-2 border border-stone-200 hover:bg-stone-50 text-stone-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                <X size={14} weight="bold" />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={<Bell size={16} weight="duotone" />} title="Notificações">
        <div className="space-y-3">
          {NOTIFICATION_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <span className="text-amber-400">{item.icon}</span>
                <span className="text-sm text-stone-700">{item.label}</span>
              </div>
              <Toggle
                checked={notifs[item.id]}
                onChange={(v) => setNotifs((prev) => ({ ...prev, [item.id]: v }))}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Plan */}
      <Section icon={<CreditCard size={16} weight="duotone" />} title="Plano">
        <div className="space-y-4">
          {/* Current plan card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Plano atual</span>
                <p className="text-xl font-bold text-stone-800 mt-2">Solo</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-stone-900">R$97</p>
                <p className="text-xs text-stone-400">/mês</p>
              </div>
            </div>
            <ul className="space-y-1.5 mt-2">
              {['1 agente', '500 ações/mês', 'Monitor básico', 'Suporte email'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-stone-600">
                  <Check size={11} weight="bold" className="text-amber-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-stone-400 mt-3">Renova em 14/05/2026</p>
          </div>

          <button
            onClick={() => setShowUpgrade(true)}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-3 rounded-2xl transition-colors shadow-sm"
          >
            <Crown size={16} weight="duotone" />
            Fazer upgrade
          </button>
        </div>
      </Section>

      {/* Language */}
      <Section icon={<Globe size={16} weight="duotone" />} title="Idioma">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground font-medium">Idioma do app</p>
            <p className="text-xs text-muted-foreground mt-0.5">Muda todos os textos da interface</p>
          </div>
          <LanguageSelector />
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={<Moon size={16} weight="duotone" />} title="Aparência">
        <DarkModeToggle />
      </Section>

      {/* Upgrade dialog */}
      {showUpgrade && <UpgradeDialog onClose={() => setShowUpgrade(false)} />}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
