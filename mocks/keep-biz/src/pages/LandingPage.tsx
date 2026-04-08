import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Buildings,
  List,
  X,
  ChatText,
  Robot,
  ShieldCheck,
  ChartLineUp,
  ClockCountdown,
  UsersThree,
  ArrowRight,
  Quotes,
} from '@phosphor-icons/react'
import { PricingSection } from '@/components/PricingSection'
import { OrchestratorBarDemo } from '@/components/OrchestratorBarDemo'

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
    icon: ChatText,
    title: 'Mapeamos seus processos',
    description:
      'Nossa equipe analisa os fluxos internos da sua empresa e identifica onde agentes de IA podem gerar mais valor.',
  },
  {
    icon: Robot,
    title: 'Criamos sua equipe de agentes',
    description:
      'Configuramos agentes especializados para vendas, suporte, conteúdo e operações — prontos em dias, não meses.',
  },
  {
    icon: ShieldCheck,
    title: 'Você mantém o controle total',
    description:
      'Monitore cada agente em tempo real, defina limites de atuação e escale com confiança enquanto o negócio cresce.',
  },
]

const benefits = [
  {
    icon: ClockCountdown,
    title: 'Operação 24/7 sem custo extra',
    description:
      'Seus agentes nunca dormem. Atenda clientes, processe pedidos e gere relatórios fora do horário comercial.',
  },
  {
    icon: ChartLineUp,
    title: 'Escale sem contratar',
    description:
      'Duplique a capacidade operacional sem dobrar a folha de pagamento. Os agentes crescem junto com a demanda.',
  },
  {
    icon: UsersThree,
    title: 'Integração com suas ferramentas',
    description:
      'Conectamos com CRM, ERP, WhatsApp Business e mais de 50 integrações — sem refazer o que já funciona.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança corporativa',
    description:
      'Dados isolados por empresa, auditoria de ações, controle de permissões e conformidade com LGPD inclusos.',
  },
]

const testimonials = [
  {
    quote:
      'Reduzimos 40% do tempo gasto em atendimento interno. Os agentes do KeepBiz lidam com perguntas repetitivas enquanto a equipe foca no estratégico.',
    name: 'Carlos Meier',
    role: 'Diretor de Operações',
    company: 'Processa Sistemas',
    initials: 'CM',
  },
  {
    quote:
      'A implementação foi surpreendentemente rápida. Em duas semanas já tínhamos 3 agentes operando em produção, com métricas claras.',
    name: 'Fernanda Lopes',
    role: 'Gerente de TI',
    company: 'Cia Cuidadores',
    initials: 'FL',
  },
  {
    quote:
      'O painel de monitoramento é excelente. Consigo ver o que cada agente está fazendo em tempo real e ajustar prioridades sem precisar de suporte técnico.',
    name: 'Ricardo Tavares',
    role: 'CEO',
    company: 'Nexum Consultoria',
    initials: 'RT',
  },
]

const clientLogos = [
  { name: 'Processa Sistemas', abbr: 'PS' },
  { name: 'Cia Cuidadores', abbr: 'CC' },
  { name: 'Nexum Consultoria', abbr: 'NC' },
  { name: 'Vortex Engenharia', abbr: 'VE' },
  { name: 'Alphamar Logística', abbr: 'AL' },
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
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 transition-all duration-200 ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Buildings size={18} weight="fill" className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-base tracking-tight">KeepBiz</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
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
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Começar Grátis
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu-open md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 text-sm text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                className="px-3 py-2.5 text-sm text-center text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="px-3 py-2.5 text-sm font-semibold text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Começar Grátis
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
      className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Agentes de IA para empresas
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
            Sua equipe de agentes de IA.{' '}
            <span className="text-blue-600">Pronta para trabalhar.</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
            KeepBiz mapeia os processos da sua empresa, cria aplicações sob medida e ativa agentes
            que operam 24/7 — com controle total nas suas mãos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-colors text-sm"
            >
              Começar Grátis
              <ArrowRight size={16} weight="bold" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors text-sm"
            >
              Agendar Demo
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Sem cartão de crédito. Setup em menos de 48h.
          </p>
        </div>

        {/* Visual */}
        <div className="flex flex-col gap-4 items-center lg:items-end">
          {/* Hero image or gradient fallback */}
          {!imgError ? (
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
              <img
                src="/images/hero-keepbiz.png"
                alt="KeepBiz — agentes de IA para sua empresa"
                className="w-full h-auto object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 bg-gradient-to-br from-slate-800 to-blue-900 aspect-video flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-white/80">
                <Buildings size={48} weight="duotone" className="text-blue-300" />
                <span className="text-sm font-medium">KeepBiz Platform</span>
                <div className="flex gap-2 mt-1">
                  {['Vendas', 'Suporte', 'Ops'].map((a) => (
                    <div key={a} className="px-2.5 py-1 bg-white/10 rounded-md text-xs text-white/70">
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OrchestratorBar Demo */}
          <div className="w-full max-w-sm">
            <OrchestratorBarDemo />
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
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            De zero a operacional em 3 passos
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-base">
            Sem meses de consultoria. Sem equipe de TI dedicada. Você foca no negócio enquanto
            construímos a equipe digital.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeUp key={step.title} delay={((i + 1) as 1 | 2 | 3)}>
                <div className="relative flex flex-col items-start p-6 rounded-2xl bg-slate-50 border border-slate-100 h-full hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shrink-0">
                    <Icon size={24} weight="duotone" className="text-white" />
                  </div>
                  <div className="absolute top-5 right-5 text-5xl font-black text-slate-100 select-none">
                    {i + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
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
    <section id="benefits" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Benefícios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Resultados reais, não promessas
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-base">
            Empresas que adotam o KeepBiz reduzem custos operacionais em até 35% no primeiro ano.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon
            const delay = ([1, 2, 3, 4] as const)[i]
            return (
              <FadeUp key={b.title} delay={delay}>
                <div className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all h-full">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon size={22} weight="duotone" className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1.5 text-sm">{b.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{b.description}</p>
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
    <section id="testimonials" className="py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Client logos */}
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
            Empresas que confiam no KeepBiz
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {clientLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl"
              >
                <div className="w-7 h-7 rounded bg-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-blue-300">{logo.abbr}</span>
                </div>
                <span className="text-sm font-medium text-slate-300 whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Testimonials */}
        <FadeUp className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3 block">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Quem usa, recomenda
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const delay = ([1, 2, 3] as const)[i]
            return (
              <FadeUp key={t.name} delay={delay} className="testimonial-card">
                <div className="flex flex-col p-6 bg-white/5 border border-white/10 rounded-2xl h-full">
                  <Quotes size={28} weight="fill" className="text-blue-400 mb-4 shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="w-9 h-9 rounded-full bg-blue-600/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-300">{t.initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-slate-500">
                        {t.role} · {t.company}
                      </div>
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
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
            Planos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Preços transparentes, sem surpresas
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-base">
            Comece com o plano que faz sentido hoje. Escale quando precisar.
          </p>
        </FadeUp>

        <FadeUp>
          <PricingSection app="keepbiz" />
        </FadeUp>
      </div>
    </section>
  )
}

// ─── CTA Final ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeUp>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Pronto para transformar sua operação?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Junte-se a empresas que já operam com agentes de IA. Comece hoje, veja resultados em
            semanas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl shadow-lg transition-colors text-sm"
            >
              Começar Grátis
              <ArrowRight size={16} weight="bold" />
            </Link>
            <a
              href="mailto:contato@keepbiz.ai"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Falar com especialista
            </a>
          </div>
          <p className="mt-4 text-xs text-blue-200">
            Sem cartão de crédito · Cancele quando quiser
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
    <footer className="bg-slate-900 border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Buildings size={15} weight="fill" className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">KeepBiz</span>
            <span className="text-slate-600 text-sm">·</span>
            <span className="text-slate-500 text-xs">Agentes de IA para PMEs</span>
          </div>

          <nav className="flex flex-wrap gap-4 justify-center">
            {['Privacidade', 'Termos', 'Contato', 'Documentação'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <p className="text-xs text-slate-600">© {year} KeepBiz. Todos os direitos reservados.</p>
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
