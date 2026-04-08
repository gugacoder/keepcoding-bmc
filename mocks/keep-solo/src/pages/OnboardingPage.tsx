import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import {
  OnboardingStepBusiness,
  type BusinessData,
} from '@/components/onboarding/OnboardingStepBusiness'
import { OnboardingStepLoading } from '@/components/onboarding/OnboardingStepLoading'
import { OnboardingStepValidation } from '@/components/onboarding/OnboardingStepValidation'
import { OnboardingStepReady } from '@/components/onboarding/OnboardingStepReady'

// ─── Stepper config ────────────────────────────────────────────────────────

// Steps that auto-advance OR manage their own CTA — hide Voltar/Avançar buttons
const AUTO_ADVANCE_STEPS = new Set([1, 2, 3])

const STEP_COUNT = 4

// ─── Dot Stepper ───────────────────────────────────────────────────────────

function DotStepper({ currentStep }: { currentStep: number }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dots row */}
      <div className="flex items-center gap-3">
        {Array.from({ length: STEP_COUNT }).map((_, index) => {
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
              {index < STEP_COUNT - 1 && (
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
          {t(`onboarding.steps.${currentStep}.label`)}
        </p>
        <p className="text-xs text-amber-500/70 dark:text-amber-500/60">
          {t('onboarding.stepOf', { step: currentStep + 1, total: STEP_COUNT })}
        </p>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: '',
    url: '',
    socialHandle: '',
  })

  const isFirst = currentStep === 0
  const isLast = currentStep === STEP_COUNT - 1

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
    if (currentStep === 2) {
      return <OnboardingStepValidation onContinue={() => setCurrentStep(3)} />
    }
    if (currentStep === 3) {
      return (
        <OnboardingStepReady
          businessName={businessData.businessName}
          socialHandle={businessData.socialHandle}
        />
      )
    }
    return null
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
          {t('onboarding.nav.back')}
        </button>

        <button
          onClick={handleNext}
          disabled={!canAdvance}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm shadow-amber-200 dark:shadow-amber-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLast ? t('onboarding.nav.start') : t('onboarding.nav.next')}
          {!isLast && <ArrowRight size={16} />}
        </button>
      </footer>
    </div>
  )
}
