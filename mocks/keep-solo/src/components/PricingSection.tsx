import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Star } from '@phosphor-icons/react'
import { keepsoloPlans, type Plan } from '@/data/pricing'

interface PricingSectionProps {
  app?: 'keepsolo'
  selectedPlan?: string
  onSelectPlan?: (planId: string) => void
  showBillingToggle?: boolean
}

function PriceDisplay({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  if (plan.monthlyPrice === 0) {
    return (
      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">Grátis</span>
        <p className="text-xs text-muted-foreground mt-1">para sempre</p>
      </div>
    )
  }

  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice

  return (
    <div className="mb-6">
      <div className="flex items-end gap-1">
        <span className="text-sm text-muted-foreground">R$</span>
        <span
          key={`${plan.id}-${yearly}`}
          className="text-4xl font-bold text-foreground"
          style={{ animation: 'priceIn 0.25s ease-out' }}
        >
          {price.toLocaleString('pt-BR')}
        </span>
        <span className="text-sm text-muted-foreground mb-1">/mês</span>
      </div>
      {yearly && plan.yearlyPrice > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          cobrado anualmente (R$ {(plan.yearlyPrice * 12).toLocaleString('pt-BR')}/ano)
        </p>
      )}
    </div>
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
          ? 'border-primary bg-card shadow-lg shadow-primary/10 scale-[1.02]'
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
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 mb-6 ${
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

export function PricingSection({
  selectedPlan,
  onSelectPlan,
  showBillingToggle = true,
}: PricingSectionProps) {
  const [yearly, setYearly] = useState(false)
  const navigate = useNavigate()

  const plans = keepsoloPlans

  const savingsPercent = Math.round(
    ((plans[1]!.monthlyPrice - plans[1]!.yearlyPrice) / plans[1]!.monthlyPrice) * 100
  )

  const handleCta = (plan: Plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan.id)
    } else {
      navigate(`/register?plan=${plan.id}`)
    }
  }

  const isSelected = (planId: string) => selectedPlan === planId

  // Mobile: popular first
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
            Planos para cada etapa da sua jornada
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comece grátis e escale quando precisar. Cancele quando quiser, sem burocracia.
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
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20">
                  Economize {savingsPercent}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Desktop: 3 columns */}
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
    </>
  )
}
