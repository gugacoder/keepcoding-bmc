import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Star, ChatCircle } from '@phosphor-icons/react'
import { keepbizPlans, keepsoloPlans, type Plan } from '@/data/pricing'

interface PricingSectionProps {
  app: 'keepbiz' | 'keepsolo'
  selectedPlan?: string
  onSelectPlan?: (planId: string) => void
  showBillingToggle?: boolean
}

interface EnterpriseDialogProps {
  onClose: () => void
}

function EnterpriseDialog({ onClose }: EnterpriseDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ChatCircle size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Falar com Vendas</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Nossa equipe vai entender suas necessidades e montar uma proposta personalizada para sua empresa.
        </p>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle size={16} className="text-primary" />
            <span>Agentes e workflows ilimitados</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle size={16} className="text-primary" />
            <span>SLA garantido + suporte dedicado 24/7</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle size={16} className="text-primary" />
            <span>Integrações e onboarding customizados</span>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href="mailto:vendas@keepbiz.ai?subject=Interesse%20no%20plano%20Enterprise"
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium text-center hover:opacity-90 transition-opacity"
          >
            Enviar email
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

function PriceDisplay({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  if (plan.monthlyPrice === null) {
    return (
      <div className="mb-6">
        <span className="text-3xl font-bold text-foreground">Sob consulta</span>
      </div>
    )
  }

  if (plan.monthlyPrice === 0) {
    return (
      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">Grátis</span>
      </div>
    )
  }

  const price = yearly ? plan.yearlyPrice! : plan.monthlyPrice

  return (
    <div className="mb-6">
      <div className="flex items-end gap-1">
        <span className="text-sm text-muted-foreground">R$</span>
        <span
          key={`${plan.id}-${yearly}`}
          className="text-4xl font-bold text-foreground transition-all duration-300"
          style={{ animation: 'priceIn 0.25s ease-out' }}
        >
          {price.toLocaleString('pt-BR')}
        </span>
        <span className="text-sm text-muted-foreground mb-1">/mês</span>
      </div>
      {yearly && plan.yearlyPrice !== null && plan.monthlyPrice > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          cobrado anualmente (R$ {(plan.yearlyPrice! * 12).toLocaleString('pt-BR')}/ano)
        </p>
      )}
    </div>
  )
}

export function PricingSection({
  app,
  selectedPlan,
  onSelectPlan,
  showBillingToggle = true,
}: PricingSectionProps) {
  const [yearly, setYearly] = useState(false)
  const [showEnterpriseDialog, setShowEnterpriseDialog] = useState(false)
  const navigate = useNavigate()

  const plans = app === 'keepbiz' ? keepbizPlans : keepsoloPlans

  const savingsPercent = (monthly: number, yearly: number) =>
    Math.round(((monthly - yearly) / monthly) * 100)

  const handleCta = (plan: Plan) => {
    if (plan.ctaAction === 'contact') {
      setShowEnterpriseDialog(true)
      return
    }
    if (onSelectPlan) {
      onSelectPlan(plan.id)
    } else {
      navigate(`/register?plan=${plan.id}`)
    }
  }

  const isSelected = (planId: string) => selectedPlan === planId

  // On mobile, show popular plan first
  const sortedPlans = [...plans].sort((a, b) => {
    if (a.popular && !b.popular) return -1
    if (!a.popular && b.popular) return 1
    return 0
  })

  return (
    <>
      <style>{`
        @keyframes priceIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section id="pricing" className="w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Planos para cada etapa do seu crescimento
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comece grátis e escale conforme sua operação cresce. Sem surpresas na fatura.
          </p>

          {showBillingToggle && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Mensal
              </span>
              <button
                role="switch"
                aria-checked={yearly}
                onClick={() => setYearly((v) => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  yearly ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    yearly ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Anual
              </span>
              {yearly && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/20">
                  Economize até {savingsPercent(
                    plans.find((p) => p.monthlyPrice && p.monthlyPrice > 0)?.monthlyPrice ?? 1,
                    plans.find((p) => p.yearlyPrice && p.yearlyPrice > 0)?.yearlyPrice ?? 1
                  )}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Desktop: 3 columns — all plans in original order */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              yearly={yearly}
              selected={isSelected(plan.id)}
              onCta={() => handleCta(plan)}
            />
          ))}
        </div>

        {/* Mobile: stack, popular first */}
        <div className="md:hidden flex flex-col gap-4">
          {sortedPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              yearly={yearly}
              selected={isSelected(plan.id)}
              onCta={() => handleCta(plan)}
            />
          ))}
        </div>
      </section>

      {showEnterpriseDialog && (
        <EnterpriseDialog onClose={() => setShowEnterpriseDialog(false)} />
      )}
    </>
  )
}

interface PricingCardProps {
  plan: Plan
  yearly: boolean
  selected: boolean
  onCta: () => void
}

function PricingCard({ plan, yearly, selected, onCta }: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
        plan.popular
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]'
          : selected
          ? 'border-primary/50 bg-card shadow-md'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
            <Star size={12} weight="fill" />
            Mais Popular
          </span>
        </div>
      )}

      <div className="mb-4 mt-2">
        <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {plan.agentCount} agentes · {plan.workflowCount} workflows
        </p>
      </div>

      <PriceDisplay plan={plan} yearly={yearly} />

      <button
        onClick={onCta}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 mb-6 ${
          plan.popular
            ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
            : 'border border-border text-foreground hover:bg-accent'
        }`}
      >
        {plan.cta}
      </button>

      <ul className="space-y-2.5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
            <CheckCircle
              size={16}
              weight="fill"
              className={`flex-shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
