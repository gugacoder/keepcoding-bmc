import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeSlash, WhatsappLogo, EnvelopeSimple, Lock, Buildings } from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { OtpInput } from '@/components/OtpInput'
import { OtpTimer } from '@/components/OtpTimer'

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

type Tab = 'email' | 'whatsapp' | 'emailotp'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/monitor'

  const [tab, setTab] = useState<Tab>('email')
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
  }

  function doLogin(email: string) {
    login(email || 'usuario@keepbiz.com')
    navigate(from, { replace: true })
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'email', label: 'E-mail', icon: <EnvelopeSimple size={16} weight="bold" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <WhatsappLogo size={16} weight="bold" /> },
    { id: 'emailotp', label: 'OTP E-mail', icon: <Lock size={16} weight="bold" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Buildings size={18} weight="fill" className="text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground tracking-tight">KeepBiz</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-border">
            <h1 className="text-xl font-semibold text-foreground mb-1">Entrar na sua conta</h1>
            <p className="text-sm text-muted-foreground">Acesse o painel KeepBiz</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
                  tab === t.id
                    ? 'border-b-2 border-primary text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="px-8 py-7">
            {tab === 'email' && (
              <EmailTab from={from} doLogin={doLogin} showToast={showToast} />
            )}
            {tab === 'whatsapp' && (
              <WhatsAppTab doLogin={doLogin} />
            )}
            {tab === 'emailotp' && (
              <EmailOtpTab doLogin={doLogin} />
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Não tem conta?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Criar conta grátis
          </Link>
        </p>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── Tab: Email + Senha ───────────────────────────────────────────────────────
function EmailTab({
  from,
  doLogin,
  showToast,
}: {
  from: string
  doLogin: (email: string) => void
  showToast: (msg: string) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    doLogin(email || 'usuario@keepbiz.com')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">E-mail corporativo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@empresa.com.br"
          className="px-3 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">Senha</label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 pr-10 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPwd ? <EyeSlash size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => showToast('Um link de recuperação seria enviado para seu e-mail.')}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Esqueci minha senha
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="w-4 h-4 rounded border-border accent-primary"
        />
        <span className="text-xs text-muted-foreground">Lembrar de mim</span>
      </label>

      <button
        type="submit"
        className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Entrar
      </button>
    </form>
  )
}

// ─── Tab: OTP WhatsApp ────────────────────────────────────────────────────────
function WhatsAppTab({ doLogin }: { doLogin: (email: string) => void }) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'phone' | 'loading' | 'otp'>('phone')
  const [otp, setOtp] = useState('')
  const [timerKey, setTimerKey] = useState(0)

  function sendCode() {
    setStep('loading')
    setTimeout(() => setStep('otp'), 1000)
  }

  function confirm() {
    if (otp.length === 6) doLogin(`whatsapp+${phone}@keepbiz.com`)
  }

  function resend() {
    setOtp('')
    setTimerKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      {step === 'phone' && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Número WhatsApp</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 py-2.5 text-sm rounded-md border border-border bg-muted text-muted-foreground select-none">
                +55
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="11 91234-5678"
                className="flex-1 px-3 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
          <button
            onClick={sendCode}
            disabled={phone.length < 10}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Enviar Código
          </button>
        </>
      )}

      {step === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Enviando código via WhatsApp…</p>
        </div>
      )}

      {step === 'otp' && (
        <>
          <p className="text-sm text-muted-foreground text-center">
            Código enviado para <span className="font-medium text-foreground">+55 {phone}</span>
          </p>
          <OtpInput value={otp} onChange={setOtp} />
          <div className="flex justify-center">
            <OtpTimer key={timerKey} onResend={resend} />
          </div>
          <button
            onClick={confirm}
            disabled={otp.length < 6}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Confirmar
          </button>
          <button
            onClick={() => { setStep('phone'); setOtp('') }}
            className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
          >
            Usar outro número
          </button>
        </>
      )}
    </div>
  )
}

// ─── Tab: OTP Email ───────────────────────────────────────────────────────────
function EmailOtpTab({ doLogin }: { doLogin: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'loading' | 'otp'>('email')
  const [otp, setOtp] = useState('')
  const [timerKey, setTimerKey] = useState(0)

  function sendCode() {
    setStep('loading')
    setTimeout(() => setStep('otp'), 1000)
  }

  function confirm() {
    if (otp.length === 6) doLogin(email || 'usuario@keepbiz.com')
  }

  function resend() {
    setOtp('')
    setTimerKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      {step === 'email' && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com.br"
              className="px-3 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            onClick={sendCode}
            disabled={email.length < 5}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Enviar Código
          </button>
        </>
      )}

      {step === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Enviando código para seu e-mail…</p>
        </div>
      )}

      {step === 'otp' && (
        <>
          <p className="text-sm text-muted-foreground text-center">
            Código enviado para <span className="font-medium text-foreground">{email}</span>
          </p>
          <OtpInput value={otp} onChange={setOtp} />
          <div className="flex justify-center">
            <OtpTimer key={timerKey} onResend={resend} />
          </div>
          <button
            onClick={confirm}
            disabled={otp.length < 6}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Confirmar
          </button>
          <button
            onClick={() => { setStep('email'); setOtp('') }}
            className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
          >
            Usar outro e-mail
          </button>
        </>
      )}
    </div>
  )
}
