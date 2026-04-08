import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from '@phosphor-icons/react'

// ─── Stepper config ────────────────────────────────────────────────────────

const STEPS = [
  'Seu Negócio',
  'Pesquisando...',
  'Validação',
  'Nicho & Posicionamento',
  'Resumo',
]

// ─── Stepper ───────────────────────────────────────────────────────────────

function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        return (
          <div key={index} className="flex items-center">
            {/* Step indicator */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {isCompleted ? <Check size={14} weight="bold" /> : index + 1}
              </div>
              <span
                className={[
                  'text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                ].join(' ')}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={[
                  'h-px w-12 sm:w-16 mb-5 mx-1 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-border',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step placeholders ─────────────────────────────────────────────────────

function StepPlaceholder({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground/40">
        {step + 1}
      </div>
      <p className="text-sm">
        Etapa <span className="font-semibold">{STEPS[step]}</span> — conteúdo em breve
      </p>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────

export function ProfileWizardPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const isFirst = currentStep === 0
  const isLast = currentStep === STEPS.length - 1

  function handleBack() {
    if (!isFirst) setCurrentStep((s) => s - 1)
  }

  function handleNext() {
    if (!isLast) setCurrentStep((s) => s + 1)
    else navigate('/profiles')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Criar Novo Perfil</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preencha as etapas abaixo para criar seu perfil de negócio.
          </p>
        </div>

        {/* Stepper */}
        <div className="overflow-x-auto pb-1">
          <WizardStepper currentStep={currentStep} />
        </div>

        {/* Step content */}
        <div className="min-h-[280px] rounded-xl border border-border bg-card p-6">
          <StepPlaceholder step={currentStep} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <span className="text-xs text-muted-foreground">
            {currentStep + 1} / {STEPS.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {isLast ? 'Criar Perfil' : 'Avançar'}
            {!isLast && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
