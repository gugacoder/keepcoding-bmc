import { useReducer, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeSlash, WhatsappLogo, EnvelopeSimple, Check, User, Lock, Sparkle } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { OtpInput } from '@/components/OtpInput'
import { Badge } from '@/components/ui/badge'
import { OtpTimer } from '@/components/OtpTimer'
import { PasswordStrength } from '@/components/PasswordStrength'
import { PricingSection } from '@/components/PricingSection'
import { keepsoloPlans } from '@/data/pricing'

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-600 text-white text-sm px-5 py-3 rounded-2xl shadow-lg animate-fade-up-toast">
      {message}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
const STEP_LABELS = ['Seus dados', 'Escolha o plano', 'Confirmação']

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  done
                    ? 'bg-amber-500 text-white'
                    : active
                    ? 'bg-amber-500 text-white ring-4 ring-amber-400/30'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                }`}
              >
                {done ? <Check size={14} weight="bold" /> : step}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  active ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-14 h-0.5 mx-1 mb-5 transition-all duration-300 ${
                  step < current ? 'bg-amber-500' : 'bg-stone-200 dark:bg-stone-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── State ────────────────────────────────────────────────────────────────────
type Method = 'email' | 'whatsapp' | 'emailotp'
type OtpPhase = 'input' | 'verify'

interface State {
  step: 1 | 2 | 3
  method: Method
  otpPhase: OtpPhase
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirm: boolean
  otpCode: string
  otpSending: boolean
  selectedPlan: string
  termsAccepted: boolean
  loading: boolean
  toast: string | null
}

type Action =
  | { type: 'SET_STEP'; payload: 1 | 2 | 3 }
  | { type: 'SET_METHOD'; payload: Method }
  | { type: 'SET_OTP_PHASE'; payload: OtpPhase }
  | { type: 'SET_FIELD'; field: keyof State; value: string | boolean }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'SET_TOAST'; value: string | null }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'SET_METHOD':
      return { ...state, method: action.payload, otpPhase: 'input', otpCode: '' }
    case 'SET_OTP_PHASE':
      return { ...state, otpPhase: action.payload }
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_LOADING':
      return { ...state, loading: action.value }
    case 'SET_TOAST':
      return { ...state, toast: action.value }
    default:
      return state
  }
}

// ─── Input Component ──────────────────────────────────────────────────────────
function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  rightElement,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rightElement?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-stone-700 dark:text-stone-300">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-sm rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 pr-10 transition-colors"
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  )
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────
function Step1({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  function set(field: keyof State) {
    return (value: string | boolean) => dispatch({ type: 'SET_FIELD', field, value })
  }

  async function sendOtp() {
    dispatch({ type: 'SET_FIELD', field: 'otpSending', value: true })
    await new Promise((r) => setTimeout(r, 1000))
    dispatch({ type: 'SET_FIELD', field: 'otpSending', value: false })
    dispatch({ type: 'SET_OTP_PHASE', payload: 'verify' })
  }

  function handleResend() {
    dispatch({ type: 'SET_OTP_PHASE', payload: 'input' })
  }

  const canProceedEmail =
    state.name.trim().length >= 2 &&
    state.email.includes('@') &&
    state.password.length >= 6 &&
    state.password === state.confirmPassword

  const canProceedOtp =
    state.name.trim().length >= 2 &&
    (state.method === 'whatsapp' ? state.phone.length >= 10 : state.email.includes('@')) &&
    state.otpPhase === 'verify' &&
    state.otpCode.length === 6

  const canProceed = state.method === 'email' ? canProceedEmail : canProceedOtp

  return (
    <div className="flex flex-col gap-4">
      {/* Method tabs */}
      <div className="flex rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        {([
          { id: 'email', label: 'E-mail & Senha', icon: <Lock size={14} /> },
          { id: 'whatsapp', label: 'WhatsApp OTP', icon: <WhatsappLogo size={14} /> },
          { id: 'emailotp', label: 'E-mail OTP', icon: <EnvelopeSimple size={14} /> },
        ] as { id: Method; label: string; icon: React.ReactNode }[]).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => dispatch({ type: 'SET_METHOD', payload: tab.id })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              state.method === tab.id
                ? 'bg-amber-500 text-white'
                : 'text-stone-500 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-stone-800'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Name field — always visible */}
      <Input
        label="Nome completo"
        value={state.name}
        onChange={set('name')}
        placeholder="Seu nome"
      />

      {/* Email + senha method */}
      {state.method === 'email' && (
        <>
          <Input
            label="E-mail"
            type="email"
            value={state.email}
            onChange={set('email')}
            placeholder="voce@email.com"
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Senha</label>
            <div className="relative">
              <input
                type={state.showPassword ? 'text' : 'password'}
                value={state.password}
                onChange={(e) => set('password')(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2.5 text-sm rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 pr-10 transition-colors"
              />
              <button
                type="button"
                onClick={() => set('showPassword')(!state.showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                {state.showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength password={state.password} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-700 dark:text-stone-300">Confirmar senha</label>
            <div className="relative">
              <input
                type={state.showConfirm ? 'text' : 'password'}
                value={state.confirmPassword}
                onChange={(e) => set('confirmPassword')(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-3 py-2.5 text-sm rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 pr-10 transition-colors"
              />
              <button
                type="button"
                onClick={() => set('showConfirm')(!state.showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                {state.showConfirm ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {state.confirmPassword && state.password !== state.confirmPassword && (
              <p className="text-xs text-red-500 mt-0.5">As senhas não coincidem</p>
            )}
          </div>
        </>
      )}

      {/* WhatsApp OTP method */}
      {state.method === 'whatsapp' && (
        <>
          {state.otpPhase === 'input' ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                  Telefone (WhatsApp)
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-2.5 text-sm rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-700 text-stone-500">
                    +55
                  </span>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={(e) => set('phone')(e.target.value.replace(/\D/g, ''))}
                    placeholder="(11) 91234-5678"
                    className="flex-1 px-3 py-2.5 text-sm rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={sendOtp}
                disabled={state.phone.length < 10 || state.otpSending}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.otpSending ? <><Spinner /> Enviando...</> : 'Enviar código via WhatsApp'}
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Código enviado para{' '}
                <span className="font-medium text-stone-800 dark:text-stone-200">+55 {state.phone}</span>
              </p>
              <OtpInput value={state.otpCode} onChange={(v) => set('otpCode')(v)} />
              <OtpTimer onResend={handleResend} />
            </div>
          )}
        </>
      )}

      {/* Email OTP method */}
      {state.method === 'emailotp' && (
        <>
          {state.otpPhase === 'input' ? (
            <>
              <Input
                label="E-mail"
                type="email"
                value={state.email}
                onChange={set('email')}
                placeholder="voce@email.com"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={!state.email.includes('@') || state.otpSending}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.otpSending ? <><Spinner /> Enviando...</> : 'Enviar código por e-mail'}
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Código enviado para{' '}
                <span className="font-medium text-stone-800 dark:text-stone-200">{state.email}</span>
              </p>
              <OtpInput value={state.otpCode} onChange={(v) => set('otpCode')(v)} />
              <OtpTimer onResend={handleResend} />
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
        disabled={!canProceed}
        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-50 mt-2"
      >
        Próximo
      </button>

      <p className="text-xs text-stone-400 text-center">
        Já tem conta?{' '}
        <Link to="/login" className="text-amber-600 hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────
function Step2({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="flex flex-col gap-6">
      <PricingSection
        app="keepsolo"
        selectedPlan={state.selectedPlan}
        onSelectPlan={(planId) => dispatch({ type: 'SET_FIELD', field: 'selectedPlan', value: planId })}
        showBillingToggle
      />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
          className="flex-1 py-2.5 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-2xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
          disabled={!state.selectedPlan}
          className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-50"
        >
          Próximo
        </button>
      </div>

      {!state.selectedPlan && (
        <p className="text-xs text-stone-400 text-center -mt-4">
          Selecione um plano para continuar
        </p>
      )}
    </div>
  )
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────
function Step3({
  state,
  dispatch,
  onSubmit,
}: {
  state: State
  dispatch: React.Dispatch<Action>
  onSubmit: () => void
}) {
  const plan = keepsoloPlans.find((p) => p.id === state.selectedPlan)

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="bg-amber-50 dark:bg-stone-800 rounded-2xl border border-amber-100 dark:border-stone-700 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100 mb-3">
          Resumo do cadastro
        </h3>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <User size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-stone-400">Nome</p>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{state.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <EnvelopeSimple size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-stone-400">E-mail / Contato</p>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
              {state.email || `+55 ${state.phone}`}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-100 dark:border-stone-700">
          <p className="text-xs text-stone-400 mb-1">Plano selecionado</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              {plan?.name ?? state.selectedPlan}
            </span>
            <Badge color="amber">
              {plan?.monthlyPrice === 0
                ? 'Grátis'
                : `R$ ${plan?.monthlyPrice?.toLocaleString('pt-BR')}/mês`}
            </Badge>
          </div>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          className={`w-5 h-5 mt-0.5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            state.termsAccepted
              ? 'bg-amber-500 border-amber-500'
              : 'border-stone-300 dark:border-stone-600 group-hover:border-amber-400'
          }`}
          onClick={() =>
            dispatch({ type: 'SET_FIELD', field: 'termsAccepted', value: !state.termsAccepted })
          }
        >
          {state.termsAccepted && <Check size={12} weight="bold" className="text-white" />}
        </div>
        <span className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          Aceito os{' '}
          <a href="#" className="text-amber-600 hover:underline font-medium">
            Termos de Uso
          </a>{' '}
          e a{' '}
          <a href="#" className="text-amber-600 hover:underline font-medium">
            Política de Privacidade
          </a>{' '}
          do KeepSolo.
        </span>
      </label>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
          className="flex-1 py-2.5 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-2xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!state.termsAccepted || state.loading}
          className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state.loading ? (
            <>
              <Spinner />
              Criando conta...
            </>
          ) : (
            'Começar Agora'
          )}
        </button>
      </div>
    </div>
  )
}

// ─── RegisterPage ─────────────────────────────────────────────────────────────
export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialPlan = searchParams.get('plan') ?? ''

  const [state, dispatch] = useReducer(reducer, {
    step: 1,
    method: 'email',
    otpPhase: 'input',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirm: false,
    otpCode: '',
    otpSending: false,
    selectedPlan: initialPlan,
    termsAccepted: false,
    loading: false,
    toast: null,
  })

  async function handleSubmit() {
    dispatch({ type: 'SET_LOADING', value: true })
    await new Promise((r) => setTimeout(r, 1500))
    login(state.email || `+55${state.phone}`, state.name)
    dispatch({ type: 'SET_LOADING', value: false })
    dispatch({ type: 'SET_TOAST', value: 'Conta criada com sucesso! Bem-vindo(a) ao KeepSolo.' })
    setTimeout(() => navigate('/monitor', { replace: true }), 1800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100 flex items-center justify-center p-4 sm:p-8">
      <style>{`
        @keyframes fade-up-toast {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-up-toast {
          animation: fade-up-toast 0.25s ease-out;
        }
      `}</style>

      <div className={`w-full ${state.step === 2 ? 'max-w-4xl' : 'max-w-md'} transition-all duration-300`}>
        {/* Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-amber-100 dark:border-stone-800 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-amber-100 dark:border-stone-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-stone-900">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                <Sparkle size={18} weight="fill" className="text-white" />
              </div>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">KeepSolo</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Crie sua conta</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Comece grátis. Sem cartão de crédito necessário.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <Stepper current={state.step} />

            {state.step === 1 && <Step1 state={state} dispatch={dispatch} />}
            {state.step === 2 && <Step2 state={state} dispatch={dispatch} />}
            {state.step === 3 && <Step3 state={state} dispatch={dispatch} onSubmit={handleSubmit} />}
          </div>
        </div>
      </div>

      {state.toast && (
        <Toast message={state.toast} onClose={() => dispatch({ type: 'SET_TOAST', value: null })} />
      )}
    </div>
  )
}
