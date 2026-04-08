import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import {
  OnboardingStepBusiness,
  type BusinessData,
} from '@/components/onboarding/OnboardingStepBusiness'
import { OnboardingStepLoading } from '@/components/onboarding/OnboardingStepLoading'

// ─── Stepper config ────────────────────────────────────────────────────────

// Steps that auto-advance — hide Voltar/Avançar buttons
const AUTO_ADVANCE_STEPS = new Set([1])

const STEPS = [
  { label: 'Seu Negócio', subtitle: 'Me conta um pouco sobre você' },
  { label: 'Pesquisando...', subtitle: 'Deixa eu dar uma olhada' },
  { label: 'Validação', subtitle: 'Isso está certo?' },
  { label: 'Pronto!', subtitle: 'Tudo certo para começar' },
]

// ─── Dot Stepper ───────────────────────────────────────────────────────────

function DotStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dots row */}
      <div className="flex items-center gap-3">
        {STEPS.map((_, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep

          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className={[
                  'rounded-full transition-all duration-300',
                  isActive
                    ? 'w-4 h-4 bg-amber-500 ring-4 ring-amber-500/25'
                    : isCompleted
                      ? 'w-3 h-3 bg-amber-500'
                      : 'w-3 h-3 bg-amber-200 dark:bg-amber-900',
                ].join(' ')}
              />
              {index < STEPS.length - 1 && (
                <div
                  className={[
                    'h-px w-8 transition-colors duration-300',
                    isCompleted ? 'bg-amber-500' : 'bg-amber-200 dark:bg-amber-900',
                  ].join(' ')}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Active step label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
          {STEPS[currentStep].label}
        </p>
        <p className="text-xs text-amber-500/70 dark:text-amber-500/60">
          {currentStep + 1} de {STEPS.length}
        </p>
      </div>
    </div>
  )
}

// ─── Step placeholder (steps 1-3 not yet implemented) ──────────────────────

const PLACEHOLDER_CONTENT = [
  null, // step 0 handled by OnboardingStepBusiness
  { icon: '🔍', title: 'Deixa eu pesquisar um pouco...', description: 'Estou reunindo informações sobre o seu mercado.' },
  { icon: '✅', title: 'Encontrei isso — está certo?', description: 'Confirme o que encontrei para eu te ajudar melhor.' },
  { icon: '🎉', title: 'Pronto! Já sei quem você é.', description: 'Tudo configurado. Vamos começar a trabalhar juntos.' },
]

function StepPlaceholder({ step }: { step: number }) {
  const content = PLACEHOLDER_CONTENT[step]
  if (!content) return null
  const { icon, title, description } = content

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center text-4xl">
        {icon}
      </div>
      <div className="text-center max-w-sm">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
      <div className="w-full max-w-sm">
        <div className="h-24 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center">
          <p className="text-sm text-amber-500/60">Conteúdo da etapa em breve</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: '',
    url: '',
    socialHandle: '',
  })

  const isFirst = currentStep === 0
  const isLast = currentStep === STEPS.length - 1

  // Disable "Avançar" on step 0 when business name is empty
  const canAdvance = currentStep === 0 ? businessData.businessName.trim().length > 0 : true

  function handleBack() {
    if (!isFirst) setCurrentStep((s) => s - 1)
  }

  function handleNext() {
    if (!canAdvance) return
    if (!isLast) setCurrentStep((s) => s + 1)
    else navigate('/monitor')
  }

  function renderStep() {
    if (currentStep === 0) {
      return (
        <OnboardingStepBusiness data={businessData} onChange={setBusinessData} />
      )
    }
    if (currentStep === 1) {
      return <OnboardingStepLoading onComplete={() => setCurrentStep(2)} />
    }
    return <StepPlaceholder step={currentStep} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950/20 dark:via-background dark:to-orange-950/10 flex flex-col">
      {/* Top bar with stepper */}
      <header className="flex-shrink-0 pt-10 pb-6 px-6 flex justify-center">
        <DotStepper currentStep={currentStep} />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-amber-200/70 dark:border-amber-800/30 bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-sm shadow-amber-100 dark:shadow-none p-6 sm:p-8">
            {renderStep()}
          </div>
        </div>
      </main>

      {/* Bottom navigation — hidden on auto-advance steps */}
      <footer className={['flex-shrink-0 pb-10 pt-6 px-6 flex items-center justify-between max-w-lg mx-auto w-full', AUTO_ADVANCE_STEPS.has(currentStep) ? 'invisible' : ''].join(' ')}>
        <button
          onClick={handleBack}
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <button
          onClick={handleNext}
          disabled={!canAdvance}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm shadow-amber-200 dark:shadow-amber-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLast ? 'Começar a usar' : 'Avançar'}
          {!isLast && <ArrowRight size={16} />}
        </button>
      </footer>
    </div>
  )
}
