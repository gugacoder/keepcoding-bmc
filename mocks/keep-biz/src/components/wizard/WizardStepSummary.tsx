import { PencilSimple, CheckCircle } from '@phosphor-icons/react'
import type { ToneOfVoice } from '@/data/types'
import type { IdentityData } from './WizardStepIdentity'
import type { NicheData } from './WizardStepNiche'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SummaryData {
  toneOfVoice: ToneOfVoice
  platforms: string[]
}

// ─── Constants ──────────────────────────────────────────────────────────────

const TONE_OPTIONS: { value: ToneOfVoice; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'técnico', label: 'Técnico' },
  { value: 'inspiracional', label: 'Inspiracional' },
  { value: 'amigável', label: 'Amigável' },
]

const PLATFORM_OPTIONS = [
  'Instagram',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Twitter/X',
  'Facebook',
  'WhatsApp',
  'Google Meu Negócio',
]

const SEGMENT_LABELS: Record<string, string> = {
  saude: 'Saúde & Bem-estar',
  tecnologia: 'Tecnologia',
  varejo: 'Varejo',
  'servicos-b2b': 'Serviços B2B',
  educacao: 'Educação',
  alimentacao: 'Alimentação',
  financas: 'Finanças',
  industria: 'Indústria',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({
  title,
  step,
  onGoToStep,
}: {
  title: string
  step: number
  onGoToStep: (step: number) => void
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <button
        type="button"
        onClick={() => onGoToStep(step)}
        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
      >
        <PencilSimple size={12} />
        Editar
      </button>
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  identity: IdentityData
  niche: NicheData
  data: SummaryData
  onChange: (data: SummaryData) => void
  onGoToStep: (step: number) => void
  onCreateProfile: () => void
}

export function WizardStepSummary({ identity, niche, data, onChange, onGoToStep, onCreateProfile }: Props) {
  function handleTogglePlatform(platform: string) {
    const next = data.platforms.includes(platform)
      ? data.platforms.filter((p) => p !== platform)
      : [...data.platforms, platform]
    onChange({ ...data, platforms: next })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Resumo do Perfil</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Revise as informações e finalize a criação do seu perfil.
        </p>
      </div>

      {/* Identidade */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <SectionHeader title="Identidade" step={0} onGoToStep={onGoToStep} />
        <div className="space-y-1.5 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground min-w-[80px]">Nome</span>
            <span className="font-medium text-foreground">{identity.businessName || '—'}</span>
          </div>
          {identity.websiteUrl && (
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[80px]">Site</span>
              <span className="text-foreground">{identity.websiteUrl}</span>
            </div>
          )}
          {identity.socialLinks.length > 0 && (
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[80px]">Redes</span>
              <div className="flex flex-col gap-0.5">
                {identity.socialLinks.map((link, i) => (
                  <span key={i} className="text-foreground">
                    {link.platform}: {link.handle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Segmento */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <SectionHeader title="Segmento" step={3} onGoToStep={onGoToStep} />
        <div className="space-y-1.5 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground min-w-[80px]">Mercado</span>
            <span className="font-medium text-foreground">
              {SEGMENT_LABELS[niche.selectedSegment] ?? niche.selectedSegment}
            </span>
          </div>
          {niche.targetAudience.length > 0 && (
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[80px]">Público</span>
              <span className="text-foreground">{niche.targetAudience.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Posicionamento */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <SectionHeader title="Posicionamento" step={3} onGoToStep={onGoToStep} />
        <p className="text-sm text-foreground leading-relaxed">
          {niche.positioningStatement || <span className="text-muted-foreground italic">Não definido</span>}
        </p>
      </div>

      {/* Tom de voz */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Tom de voz</h3>
        <select
          value={data.toneOfVoice}
          onChange={(e) => onChange({ ...data, toneOfVoice: e.target.value as ToneOfVoice })}
          className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
        >
          {TONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Plataformas */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Plataformas</h3>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORM_OPTIONS.map((platform) => {
            const checked = data.platforms.includes(platform)
            return (
              <label
                key={platform}
                className={[
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors select-none',
                  checked
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/30',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleTogglePlatform(platform)}
                  className="accent-primary w-4 h-4"
                />
                {checked && <CheckCircle size={14} className="text-primary shrink-0 -ml-1" />}
                <span>{platform}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Create profile button */}
      <button
        type="button"
        onClick={onCreateProfile}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Criar Perfil
      </button>
    </div>
  )
}
