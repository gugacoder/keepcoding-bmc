import { useReducer, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeSlash, WhatsappLogo, EnvelopeSimple, Check, Buildings, User, Lock } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { OtpInput } from '@/components/OtpInput'
import { OtpTimer } from '@/components/OtpTimer'
import { PasswordStrength } from '@/components/PasswordStrength'
import { PricingSection } from '@/components/PricingSection'
import { keepbizPlans } from '@/data/pricing'

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm px-5 py-3 rounded-lg shadow-lg animate-fade-up-toast">
      {message}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
const STEP_LABELS = ['Dados da Conta', 'Escolha o Plano', 'Confirmação']

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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  done
                    ? 'bg-primary text-primary-foreground'
                    : active
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {done ? <Check size={14} weight="bold" /> : step}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  active ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-1 mb-5 transition-all duration-300 ${
                  step < current ? 'bg-primary' : 'bg-muted'
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
  company: string
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
  optional,
  rightElement,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  optional?: boolean
  rightElement?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-foreground">
        {label}{' '}
        {optional && <span className="text-muted-foreground font-normal">(opcional)</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-10"
        />
        {rightElement && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">{rightElement}</div>
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
      <div className="flex rounded-lg border border-border overflow-hidden">
        {([
          { id: 'email', label: 'E-mail & Senha', icon: <Lock size={14} /> },
          { id: 'whatsapp', label: 'WhatsApp OTP', icon: <WhatsappLogo size={14} /> },
          { id: 'emailotp', label: 'E-mail OTP', icon: <EnvelopeSimple size={14} /> },
        ] as { id: Method; label: string; icon: React.ReactNode }[]).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => dispatch({ type: 'SET_METHOD', payload: tab.id })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              state.method === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Common fields */}
      <Input
        label="Nome completo"
        value={state.name}
        onChange={set('name')}
        placeholder="João Silva"
      />
      <Input
        label="Empresa"
        value={state.company}
        onChange={set('company')}
        placeholder="Acme Ltda."
        optional
      />

      {/* Email + senha method */}
      {state.method === 'email' && (
        <>
          <Input
            label="E-mail corporativo"
            type="email"
            value={state.email}
            onChange={set('email')}
            placeholder="voce@empresa.com.br"
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Senha</label>
            <div className="relative">
              <input
                type={state.showPassword ? 'text' : 'password'}
                value={state.password}
                onChange={(e) => set('password')(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-10"
              />
              <button
                type="button"
                onClick={() => set('showPassword')(!state.showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {state.showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength password={state.password} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Confirmar senha</label>
            <div className="relative">
              <input
                type={state.showConfirm ? 'text' : 'password'}
                value={state.confirmPassword}
                onChange={(e) => set('confirmPassword')(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-10"
              />
              <button
                type="button"
                onClick={() => set('showConfirm')(!state.showConfirm)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                <label className="text-xs font-medium text-foreground">Telefone (WhatsApp)</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-2 text-sm rounded-md border border-border bg-muted text-muted-foreground">
                    +55
                  </span>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={(e) => set('phone')(e.target.value.replace(/\D/g, ''))}
                    placeholder="(11) 91234-5678"
                    className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={sendOtp}
                disabled={state.phone.length < 10 || state.otpSending}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.otpSending ? <><Spinner /> Enviando...</> : 'Enviar código via WhatsApp'}
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Código enviado para <span className="font-medium text-foreground">+55 {state.phone}</span>
              </p>
              <OtpInput
                value={state.otpCode}
                onChange={(v) => set('otpCode')(v)}
              />
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
                placeholder="voce@empresa.com.br"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={!state.email.includes('@') || state.otpSending}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.otpSending ? <><Spinner /> Enviando...</> : 'Enviar código por e-mail'}
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Código enviado para <span className="font-medium text-foreground">{state.email}</span>
              </p>
              <OtpInput
                value={state.otpCode}
                onChange={(v) => set('otpCode')(v)}
              />
              <OtpTimer onResend={handleResend} />
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
        disabled={!canProceed}
        className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
      >
        Próximo
      </button>

      <p className="text-xs text-muted-foreground text-center">
        Já tem conta?{' '}
        <Link to="/login" className="text-primary hover:underline">
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
        app="keepbiz"
        selectedPlan={state.selectedPlan}
        onSelectPlan={(planId) => dispatch({ type: 'SET_FIELD', field: 'selectedPlan', value: planId })}
        showBillingToggle
      />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
          className="flex-1 py-2.5 border border-border text-foreground rounded-md text-sm font-medium hover:bg-accent transition-colors"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
          disabled={!state.selectedPlan}
          className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Próximo
        </button>
      </div>

      {!state.selectedPlan && (
        <p className="text-xs text-muted-foreground text-center -mt-4">
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
  const plan = keepbizPlans.find((p) => p.id === state.selectedPlan)

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="bg-muted/40 rounded-xl border border-border p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground mb-3">Resumo do cadastro</h3>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nome</p>
            <p className="text-sm font-medium text-foreground">{state.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <EnvelopeSimple size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <p className="text-sm font-medium text-foreground">
              {state.email || `+55 ${state.phone}`}
            </p>
          </div>
        </div>

        {state.company && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Buildings size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Empresa</p>
              <p className="text-sm font-medium text-foreground">{state.company}</p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Plano selecionado</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{plan?.name ?? state.selectedPlan}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {plan?.monthlyPrice === null
                ? 'Sob consulta'
                : plan?.monthlyPrice === 0
                ? 'Grátis'
                : `R$ ${plan?.monthlyPrice?.toLocaleString('pt-BR')}/mês`}
            </span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            state.termsAccepted
              ? 'bg-primary border-primary'
              : 'border-border group-hover:border-primary/50'
          }`}
          onClick={() =>
            dispatch({ type: 'SET_FIELD', field: 'termsAccepted', value: !state.termsAccepted })
          }
        >
          {state.termsAccepted && <Check size={12} weight="bold" className="text-primary-foreground" />}
        </div>
        <span className="text-xs text-muted-foreground leading-relaxed">
          Aceito os{' '}
          <a href="#" className="text-primary hover:underline">
            Termos de Uso
          </a>{' '}
          e a{' '}
          <a href="#" className="text-primary hover:underline">
            Política de Privacidade
          </a>{' '}
          da KeepBiz.
        </span>
      </label>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
          className="flex-1 py-2.5 border border-border text-foreground rounded-md text-sm font-medium hover:bg-accent transition-colors"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!state.termsAccepted || state.loading}
          className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state.loading ? (
            <>
              <Spinner />
              Criando conta...
            </>
          ) : (
            'Criar Conta'
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
    company: '',
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
    dispatch({ type: 'SET_TOAST', value: 'Conta criada com sucesso! Bem-vindo(a) ao KeepBiz.' })
    setTimeout(() => navigate('/monitor', { replace: true }), 1800)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-8">
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
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Buildings size={18} weight="fill" className="text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-primary">KeepBiz</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Crie sua conta corporativa</h1>
            <p className="text-sm text-muted-foreground mt-1">
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
