import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkle,
  List,
  X,
  ChatCircle,
  Lightning,
  Eye,
  Clock,
  TrendUp,
  Heart,
  Handshake,
  ArrowRight,
  Quotes,
} from '@phosphor-icons/react'
import { PricingSection } from '@/components/PricingSection'
import { MonitorDemo } from '@/components/MonitorDemo'

// ─── Scroll animation hook ───────────────────────────────────────────────────

function useFadeUp(ref: React.RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

function FadeUp({
  children,
  delay,
  className = '',
}: {
  children: React.ReactNode
  delay?: 1 | 2 | 3 | 4
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useFadeUp(ref)
  return (
    <div ref={ref} className={`fade-up${delay ? ` delay-${delay}` : ''} ${className}`}>
      {children}
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    icon: ChatCircle,
    title: 'Você conta o que precisa',
    description:
      'Diz ao seu agente quais tarefas consomem mais seu tempo — WhatsApp, follow-ups, agendamentos, conteúdo. Sem formulários longos.',
  },
  {
    icon: Lightning,
    title: 'Seu agente entra em ação',
    description:
      'KeepSolo ativa os agentes certos para o seu negócio: CRM, automações, respostas — tudo rodando enquanto você foca no que ama.',
  },
  {
    icon: Eye,
    title: 'Você acompanha tudo',
    description:
      'Painel simples com o que seus agentes fizeram, quantos leads chegaram e o que está pendente. Controle na palma da mão.',
  },
]

const benefits = [
  {
    icon: Clock,
    title: 'Recupere suas horas',
    description:
      'Pare de gastar horas em tarefas repetitivas. Seus agentes cuidam do operacional enquanto você entrega o que só você sabe fazer.',
  },
  {
    icon: TrendUp,
    title: 'Cresça sem contratar',
    description:
      'Escale sua carteira de clientes sem precisar de equipe. KeepSolo é a equipe que você não sabia que podia ter.',
  },
  {
    icon: Heart,
    title: 'Cuide da sua energia',
    description:
      'Menos sobrecarga, menos estresse. Quando as tarefas menores somem, sobra espaço para fazer seu melhor trabalho.',
  },
  {
    icon: Handshake,
    title: 'Relacionamentos que convertem',
    description:
      'Follow-ups automáticos, respostas rápidas, lembretes na hora certa. Seu cliente sente que você está sempre presente.',
  },
]

const testimonials = [
  {
    quote:
      'Eu tinha medo de parecer impessoal usando automação. Mas com KeepSolo os meus clientes sentem que estou ainda mais presente. Triplicou minha taxa de resposta.',
    name: 'Renata Vidal',
    role: 'Coach de Carreira',
    initials: 'RV',
  },
  {
    quote:
      'Como consultor autônomo, perdia horas por semana em follow-ups. Agora o agente faz isso por mim e eu foco nas reuniões que realmente importam.',
    name: 'Thiago Nunes',
    role: 'Consultor de Negócios',
    initials: 'TN',
  },
  {
    quote:
      'Sou designer freelancer e precisava de algo que não exigisse que eu virasse técnica. KeepSolo é exatamente isso — funciona e eu não preciso entender como.',
    name: 'Camila Reis',
    role: 'Designer Freelancer',
    initials: 'CR',
  },
]

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#how-it-works', label: 'Como Funciona' },
    { href: '#benefits', label: 'Benefícios' },
    { href: '#testimonials', label: 'Depoimentos' },
    { href: '#pricing', label: 'Planos' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100/60 transition-all duration-200 ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Sparkle size={16} weight="fill" className="text-white" />
          </div>
          <span className="font-bold text-stone-900 text-base tracking-tight">KeepSolo</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-lg hover:bg-amber-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-amber-50 rounded-lg transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-sm shadow-amber-200 transition-all"
          >
            Começar Agora
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-amber-50 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu-open md:hidden border-t border-amber-100/60 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 text-sm text-stone-700 rounded-lg hover:bg-amber-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-amber-100/60 mt-2 pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                className="px-3 py-2.5 text-sm text-center text-stone-700 border border-stone-200 rounded-xl hover:bg-amber-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="px-3 py-2.5 text-sm font-semibold text-center text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [imgError, setImgError] = useState(false)

  return (
    <section
      id="hero"
      className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700 mb-6">
            <Sparkle size={12} weight="fill" className="text-amber-500" />
            Agentes de IA para solopreneurs
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-stone-900 leading-[1.1] tracking-tight mb-5">
            Você não precisa{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              fazer tudo sozinho.
            </span>
          </h1>

          <p className="text-lg text-stone-600 leading-relaxed mb-8 max-w-lg">
            KeepSolo te dá uma equipe de agentes de IA que cuida dos seus clientes, conteúdo e
            operações — enquanto você foca no que importa.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-md shadow-amber-200 transition-all text-sm"
            >
              Começar Agora
              <ArrowRight size={16} weight="bold" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-stone-200 bg-white hover:bg-amber-50 text-stone-700 font-medium rounded-2xl transition-colors text-sm"
            >
              Ver Demo
            </a>
          </div>

          <p className="mt-4 text-xs text-stone-400">
            Grátis para começar. Sem cartão de crédito.
          </p>
        </div>

        {/* Visual */}
        <div className="flex flex-col gap-4 items-center lg:items-end">
          {/* Hero image or gradient fallback */}
          {!imgError ? (
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-amber-100 border border-amber-100">
              <img
                src="/images/hero-keepsolo.png"
                alt="KeepSolo — seu agente de IA pessoal"
                className="w-full h-auto object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-amber-100 border border-amber-100 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 aspect-video flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-white">
                <Sparkle size={52} weight="duotone" className="text-white/80" />
                <span className="text-base font-bold">KeepSolo</span>
                <div className="flex gap-2 mt-1">
                  {['CRM', 'Conteúdo', 'Agenda'].map((a) => (
                    <div key={a} className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-medium text-white/90">
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Monitor Demo */}
          <div className="w-full max-w-sm">
            <MonitorDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Como Funciona ────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Simples como deve ser
          </h2>
          <p className="mt-3 text-stone-500 max-w-xl mx-auto text-base">
            Você não precisa ser técnico. Precisa só saber o que te toma mais tempo — o resto a
            gente resolve.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeUp key={step.title} delay={((i + 1) as 1 | 2 | 3)}>
                <div className="relative flex flex-col items-start p-6 rounded-2xl bg-amber-50/50 border border-amber-100 h-full hover:border-amber-200 hover:bg-amber-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shrink-0 shadow-sm shadow-amber-200">
                    <Icon size={24} weight="duotone" className="text-white" />
                  </div>
                  <div className="absolute top-5 right-5 text-5xl font-black text-amber-100 select-none">
                    {i + 1}
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{step.description}</p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Benefícios ───────────────────────────────────────────────────────────────

function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-amber-50/60 to-orange-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">
            Benefícios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Para quem faz acontecer sozinho
          </h2>
          <p className="mt-3 text-stone-500 max-w-xl mx-auto text-base">
            Feito para coaches, consultores, freelancers e criadores que querem crescer sem abrir
            mão do que fazem de melhor.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon
            const delay = ([1, 2, 3, 4] as const)[i]
            return (
              <FadeUp key={b.title} delay={delay}>
                <div className="flex gap-4 p-6 bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all h-full">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <Icon size={22} weight="duotone" className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 mb-1.5 text-sm">{b.title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Social Proof ─────────────────────────────────────────────────────────────

function SocialProof() {
  return (
    <section id="testimonials" className="py-20 bg-stone-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Quem já parou de fazer tudo sozinho
          </h2>
          <p className="mt-3 text-stone-400 max-w-xl mx-auto text-base">
            Profissionais reais que passaram a trabalhar com mais leveza e resultado.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const delay = ([1, 2, 3] as const)[i]
            return (
              <FadeUp key={t.name} delay={delay}>
                <div className="flex flex-col p-6 bg-white/5 border border-white/10 rounded-2xl h-full hover:bg-white/8 hover:border-amber-500/20 transition-all">
                  <Quotes size={28} weight="fill" className="text-amber-400 mb-4 shrink-0" />
                  <p className="text-stone-300 text-sm leading-relaxed flex-1 mb-5">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">{t.initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-stone-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function PricingWrapper() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3 block">
            Planos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Comece de graça. Cresça quando precisar.
          </h2>
          <p className="mt-3 text-stone-500 max-w-xl mx-auto text-base">
            Sem contrato. Sem surpresa. Cancele quando quiser.
          </p>
        </FadeUp>

        <FadeUp>
          <PricingSection app="keepsolo" />
        </FadeUp>
      </div>
    </section>
  )
}

// ─── CTA Final ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-400">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeUp>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-6 mx-auto">
            <Sparkle size={28} weight="fill" className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Sua equipe está esperando por você.
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            Comece agora e veja o que acontece quando você para de fazer tudo sozinho.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-amber-50 text-amber-700 font-bold rounded-2xl shadow-lg transition-colors text-sm"
            >
              Começar Agora — É Grátis
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl transition-colors text-sm"
            >
              Já tenho conta
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/60">
            Grátis para sempre no plano Free · Upgrade quando quiser
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-stone-900 border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkle size={13} weight="fill" className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">KeepSolo</span>
            <span className="text-stone-600 text-sm">·</span>
            <span className="text-stone-500 text-xs">Agentes de IA para solopreneurs</span>
          </div>

          <nav className="flex flex-wrap gap-4 justify-center">
            {['Privacidade', 'Termos', 'Contato', 'Blog'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <p className="text-xs text-stone-600">© {year} KeepSolo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <SocialProof />
        <PricingWrapper />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
