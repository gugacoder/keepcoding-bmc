import { useCallback, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Check, CheckCircle, X } from '@phosphor-icons/react'
import {
  WizardStepIdentity,
  type IdentityData,
} from '../components/wizard/WizardStepIdentity'
import { WizardStepResearch } from '../components/wizard/WizardStepResearch'
import { WizardStepValidation } from '../components/wizard/WizardStepValidation'
import {
  WizardStepNiche,
  type NicheData,
} from '../components/wizard/WizardStepNiche'
import {
  WizardStepSummary,
  type SummaryData,
} from '../components/wizard/WizardStepSummary'
import { useProfiles } from '../contexts/ProfileContext'
import type { Profile } from '../data/types'

// ─── Edit mode helpers ─────────────────────────────────────────────────────

function profileToWizardData(profile: Profile): WizardData {
  const socialLinks = profile.identity.socialLinks.map((s) => {
    const colonIdx = s.indexOf(': ')
    if (colonIdx !== -1) {
      return { platform: s.slice(0, colonIdx), handle: s.slice(colonIdx + 2) }
    }
    return { platform: 'Instagram', handle: s }
  })

  return {
    identity: {
      businessName: profile.identity.businessName,
      websiteUrl: profile.identity.url ?? '',
      socialLinks,
    },
    niche: {
      selectedSegment: profile.niche.segment,
      targetAudience: profile.niche.targetAudience
        ? profile.niche.targetAudience.split(', ').filter(Boolean)
        : [],
      positioningStatement: profile.positioning.statement,
    },
    summary: {
      toneOfVoice: profile.tone.primary,
      platforms: profile.platforms,
    },
  }
}

// ─── Stepper config ────────────────────────────────────────────────────────

const STEP_COUNT = 5

// ─── Stepper ───────────────────────────────────────────────────────────────

function WizardStepper({ currentStep }: { currentStep: number }) {
  const { t } = useTranslation()
  const steps = [
    t('wizard.steps.identity'),
    t('wizard.steps.researching'),
    t('wizard.steps.validation'),
    t('wizard.steps.niche'),
    t('wizard.steps.summary'),
  ]
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, index) => {
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
            {index < steps.length - 1 && (
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

// ─── Toast ─────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-md shadow-xl">
      <CheckCircle size={18} weight="fill" className="shrink-0" />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Wizard state ──────────────────────────────────────────────────────────

interface WizardData {
  identity: IdentityData
  niche: NicheData
  summary: SummaryData
}

const INITIAL_WIZARD_DATA: WizardData = {
  identity: {
    businessName: '',
    websiteUrl: '',
    socialLinks: [],
  },
  niche: {
    selectedSegment: 'tecnologia', // pre-selected: matches the mock validation finding "Tecnologia B2B"
    targetAudience: [],
    positioningStatement: '',
  },
  summary: {
    toneOfVoice: 'casual',
    platforms: [],
  },
}

function isStepValid(step: number, data: WizardData): boolean {
  if (step === 0) return data.identity.businessName.trim() !== ''
  return true
}

// ─── Main page ─────────────────────────────────────────────────────────────

// Steps with internal navigation (no Voltar/Avançar footer nav)
// Step 1 (Pesquisando) auto-advances; step 2 (Validação) has its own CTA;
// step 4 (Resumo) has its own button
const AUTO_ADVANCE_STEPS_CREATE = new Set([1, 2, 4])
const AUTO_ADVANCE_STEPS_EDIT = new Set([4])

// In edit mode, steps 1 (Research) and 2 (Validation) are skipped.
// Navigation jumps: 0 → 3 → 4 and back: 4 → 3 → 0
function getNextStep(current: number, editMode: boolean): number {
  if (editMode) {
    if (current === 0) return 3
    return current + 1
  }
  return current + 1
}

function getPrevStep(current: number, editMode: boolean): number {
  if (editMode) {
    if (current === 3) return 0
    return current - 1
  }
  return current - 1
}

export function ProfileWizardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const { addProfile, updateProfile, profiles } = useProfiles()

  const editId = searchParams.get('edit')
  const editMode = editId !== null

  const editProfile = useMemo(
    () => (editId ? profiles.find((p) => p.id === editId) ?? null : null),
    [editId, profiles]
  )

  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState<WizardData>(() =>
    editProfile ? profileToWizardData(editProfile) : INITIAL_WIZARD_DATA
  )
  const [toast, setToast] = useState<string | null>(null)

  const AUTO_ADVANCE_STEPS = editMode ? AUTO_ADVANCE_STEPS_EDIT : AUTO_ADVANCE_STEPS_CREATE

  const isFirst = currentStep === 0
  const isAutoStep = AUTO_ADVANCE_STEPS.has(currentStep)
  const isLast = currentStep === STEP_COUNT - 1
  const canAdvance = isStepValid(currentStep, wizardData)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  function handleBack() {
    if (!isFirst) setCurrentStep(getPrevStep(currentStep, editMode))
  }

  function handleNext() {
    if (!canAdvance) return
    if (!isLast) setCurrentStep(getNextStep(currentStep, editMode))
  }

  const handleResearchComplete = useCallback(() => {
    setCurrentStep(2)
  }, [])

  const handleValidationContinue = useCallback(() => {
    setCurrentStep(3)
  }, [])

  function handleGoToStep(step: number) {
    setCurrentStep(step)
  }

  function handleCreateProfile() {
    const now = new Date().toISOString()
    const profileData = {
      identity: {
        businessName: wizardData.identity.businessName,
        url: wizardData.identity.websiteUrl,
        socialLinks: wizardData.identity.socialLinks.map((sl) => `${sl.platform}: ${sl.handle}`),
      },
      niche: {
        segment: wizardData.niche.selectedSegment,
        targetAudience: wizardData.niche.targetAudience.join(', '),
        competitors: editProfile?.niche.competitors ?? [],
      },
      positioning: {
        differentials: editProfile?.positioning.differentials ?? [],
        statement: wizardData.niche.positioningStatement,
        agentSuggestion: editProfile?.positioning.agentSuggestion ?? '',
      },
      tone: {
        primary: wizardData.summary.toneOfVoice,
        examples: editProfile?.tone.examples ?? [],
      },
      platforms: wizardData.summary.platforms,
    }

    if (editMode && editId) {
      updateProfile(editId, profileData)
      showToast(t('wizard.toastUpdated'))
      setTimeout(() => navigate('/profiles'), 500)
    } else {
      const newProfile: Profile = {
        id: `PRF-${Date.now()}`,
        ...profileData,
        status: 'rascunho',
        completeness: 80,
        createdAt: now,
        updatedAt: now,
      }
      addProfile(newProfile)
      showToast(t('wizard.toastCreated'))
      setTimeout(() => navigate('/profiles'), 500)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {editMode ? t('wizard.editTitle') : t('wizard.createTitle')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editMode ? t('wizard.editSubtitle') : t('wizard.createSubtitle')}
          </p>
        </div>

        {/* Stepper */}
        <div className="overflow-x-auto pb-1">
          <WizardStepper currentStep={currentStep} />
        </div>

        {/* Step content */}
        <div className="min-h-[280px] rounded-xl border border-border bg-card p-6">
          {currentStep === 0 ? (
            <WizardStepIdentity
              data={wizardData.identity}
              onChange={(identity) => setWizardData((d) => ({ ...d, identity }))}
            />
          ) : currentStep === 1 ? (
            <WizardStepResearch
              businessName={wizardData.identity.businessName}
              onComplete={handleResearchComplete}
            />
          ) : currentStep === 2 ? (
            <WizardStepValidation onContinue={handleValidationContinue} />
          ) : currentStep === 3 ? (
            <WizardStepNiche
              data={wizardData.niche}
              onChange={(niche) => setWizardData((d) => ({ ...d, niche }))}
            />
          ) : (
            <WizardStepSummary
              identity={wizardData.identity}
              niche={wizardData.niche}
              data={wizardData.summary}
              onChange={(summary) => setWizardData((d) => ({ ...d, summary }))}
              onGoToStep={handleGoToStep}
              onCreateProfile={handleCreateProfile}
              submitLabel={editMode ? t('wizard.summary.submitEdit') : t('wizard.summary.submitCreate')}
            />
          )}
        </div>

        {/* Navigation — hidden for auto-advance steps */}
        {!isAutoStep && (
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={isFirst}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              {t('wizard.back')}
            </button>

            <span className="text-xs text-muted-foreground">
              {t('wizard.stepOf', { current: currentStep + 1, total: STEP_COUNT })}
            </span>

            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('wizard.next')}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
