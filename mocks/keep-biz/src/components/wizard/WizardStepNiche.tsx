import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Robot, PencilSimple } from '@phosphor-icons/react'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NicheData {
  selectedSegment: string
  targetAudience: string[]
  positioningStatement: string
}

// ─── Segment data ────────────────────────────────────────────────────────────

const SEGMENT_IDS = [
  'saude',
  'tecnologia',
  'varejo',
  'servicos-b2b',
  'educacao',
  'alimentacao',
  'financas',
  'industria',
] as const

const SEGMENT_ICONS: Record<string, string> = {
  saude: '🏥',
  tecnologia: '💻',
  varejo: '🛍️',
  'servicos-b2b': '🤝',
  educacao: '🎓',
  alimentacao: '🍽️',
  financas: '💰',
  industria: '🏭',
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  data: NicheData
  onChange: (data: NicheData) => void
}

export function WizardStepNiche({ data, onChange }: Props) {
  const { t } = useTranslation()

  const getSegmentSuggestion = (segmentId: string): string =>
    t(`wizard.niche.agentSuggestions.${segmentId}`)

  const getSegmentAudiences = (segmentId: string): string[] =>
    t(`wizard.niche.audiences.${segmentId}`, { returnObjects: true }) as string[]

  const [useAgentSuggestion, setUseAgentSuggestion] = useState(
    data.positioningStatement === '' || data.positioningStatement === getSegmentSuggestion(data.selectedSegment),
  )

  function handleSelectSegment(segmentId: string) {
    const suggestion = getSegmentSuggestion(segmentId)
    onChange({
      selectedSegment: segmentId,
      targetAudience: [],
      positioningStatement: useAgentSuggestion ? suggestion : data.positioningStatement,
    })
  }

  function handleToggleAudience(audience: string) {
    const current = data.targetAudience
    const next = current.includes(audience)
      ? current.filter((a) => a !== audience)
      : [...current, audience]
    onChange({ ...data, targetAudience: next })
  }

  function handleUseAgentSuggestion() {
    const suggestion = getSegmentSuggestion(data.selectedSegment)
    setUseAgentSuggestion(true)
    onChange({ ...data, positioningStatement: suggestion })
  }

  function handleWriteMyWay() {
    setUseAgentSuggestion(false)
    onChange({ ...data, positioningStatement: '' })
  }

  const activeAudiences = data.selectedSegment ? getSegmentAudiences(data.selectedSegment) : []

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">{t('wizard.niche.title')}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t('wizard.niche.description')}
        </p>
      </div>

      {/* Segment grid */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">{t('wizard.niche.marketSegment')}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SEGMENT_IDS.map((segmentId) => {
            const isSelected = data.selectedSegment === segmentId
            return (
              <button
                key={segmentId}
                type="button"
                onClick={() => handleSelectSegment(segmentId)}
                className={[
                  'relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30',
                ].join(' ')}
              >
                {/* Radio indicator */}
                <div
                  className={[
                    'absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                  ].join(' ')}
                >
                  {isSelected && <Check size={10} weight="bold" className="text-primary-foreground" />}
                </div>

                <span className="text-2xl leading-none">{SEGMENT_ICONS[segmentId]}</span>
                <span
                  className={[
                    'text-sm font-medium leading-tight',
                    isSelected ? 'text-primary' : 'text-foreground',
                  ].join(' ')}
                >
                  {t(`wizard.niche.segments.${segmentId}`)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Target audience chips — shown when segment is selected */}
      {data.selectedSegment && activeAudiences.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            {t('wizard.niche.targetAudience')}{' '}
            <span className="text-xs font-normal text-muted-foreground">
              {t('wizard.niche.targetAudienceHint')}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {activeAudiences.map((audience) => {
              const isSelected = data.targetAudience.includes(audience)
              return (
                <button
                  key={audience}
                  type="button"
                  onClick={() => handleToggleAudience(audience)}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-muted/30',
                  ].join(' ')}
                >
                  {isSelected && <Check size={12} weight="bold" />}
                  {audience}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Positioning statement */}
      {data.selectedSegment && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">{t('wizard.niche.positioning')}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseAgentSuggestion}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                  useAgentSuggestion
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-foreground hover:bg-muted/50',
                ].join(' ')}
              >
                <Robot size={13} />
                {t('wizard.niche.useAgentSuggestion')}
              </button>
              <button
                type="button"
                onClick={handleWriteMyWay}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                  !useAgentSuggestion
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-foreground hover:bg-muted/50',
                ].join(' ')}
              >
                <PencilSimple size={13} />
                {t('wizard.niche.writeMyWay')}
              </button>
            </div>
          </div>

          {/* Agent suggestion banner */}
          {useAgentSuggestion && (
            <div className="flex items-start gap-2 mb-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Robot size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('wizard.niche.agentSuggestionBanner')}
              </p>
            </div>
          )}

          <textarea
            value={data.positioningStatement}
            onChange={(e) => {
              setUseAgentSuggestion(false)
              onChange({ ...data, positioningStatement: e.target.value })
            }}
            readOnly={useAgentSuggestion}
            rows={4}
            placeholder={t('wizard.niche.positioningPlaceholder')}
            className={[
              'w-full text-sm rounded-lg border px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors',
              useAgentSuggestion
                ? 'bg-muted/40 border-border text-foreground cursor-default'
                : 'bg-background border-border text-foreground',
            ].join(' ')}
          />
        </div>
      )}
    </div>
  )
}
