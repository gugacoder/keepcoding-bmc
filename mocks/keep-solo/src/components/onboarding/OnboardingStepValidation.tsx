import { useState } from 'react'
import { Check, PencilSimple, X } from '@phosphor-icons/react'

// ─── Types ──────────────────────────────────────────────────────────────────

type Category = 'segmento' | 'servico' | 'rede_social' | 'localizacao' | 'site' | 'publico'
type Decision = 'pending' | 'confirmed' | 'corrected' | 'ignored'

interface Finding {
  id: string
  categoria: Category
  label: string
  valor: string
}

interface FindingState {
  decision: Decision
  correction: string
  editing: boolean
}

// ─── Mock data — Cia Cuidadores ─────────────────────────────────────────────

const MOCK_FINDINGS: Finding[] = [
  { id: 'f1', categoria: 'segmento',    label: 'Segmento detectado',  valor: 'Saúde & Bem-estar' },
  { id: 'f2', categoria: 'servico',     label: 'Serviço principal',   valor: 'Atendimento domiciliar de idosos' },
  { id: 'f3', categoria: 'rede_social', label: 'Instagram',           valor: '@ciacuidadores' },
  { id: 'f4', categoria: 'localizacao', label: 'Cidade',              valor: 'São Paulo, SP' },
  { id: 'f5', categoria: 'site',        label: 'Site',                valor: 'ciacuidadores.com.br' },
  { id: 'f6', categoria: 'publico',     label: 'Público-alvo',        valor: 'Famílias com idosos dependentes' },
]

// ─── Category badge ─────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<Category, string> = {
  segmento:    'Segmento',
  servico:     'Serviço',
  rede_social: 'Rede Social',
  localizacao: 'Localização',
  site:        'Site',
  publico:     'Público',
}

const CATEGORY_COLORS: Record<Category, string> = {
  segmento:    'bg-purple-100 text-purple-700',
  servico:     'bg-teal-100 text-teal-700',
  rede_social: 'bg-pink-100 text-pink-700',
  localizacao: 'bg-blue-100 text-blue-700',
  site:        'bg-gray-100 text-gray-600',
  publico:     'bg-orange-100 text-orange-700',
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  onContinue: () => void
}

export function OnboardingStepValidation({ onContinue }: Props) {
  const [states, setStates] = useState<Record<string, FindingState>>(() =>
    Object.fromEntries(
      MOCK_FINDINGS.map((f) => [
        f.id,
        { decision: 'pending', correction: f.valor, editing: false },
      ]),
    ),
  )

  const reviewedCount = Object.values(states).filter((s) => s.decision !== 'pending').length
  const total = MOCK_FINDINGS.length
  const allReviewed = reviewedCount === total

  function setDecision(id: string, decision: Decision) {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, decision, editing: false },
    }))
  }

  function startEditing(id: string) {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, decision: 'corrected', editing: true },
    }))
  }

  function stopEditing(id: string) {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, editing: false },
    }))
  }

  function setCorrection(id: string, value: string) {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, correction: value },
    }))
  }

  function resetDecision(id: string, originalValue: string) {
    setStates((prev) => ({
      ...prev,
      [id]: { decision: 'pending', correction: originalValue, editing: false },
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Encontrei isso — está certo?</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Confirme, corrija ou ignore cada item que encontrei.
          </p>
        </div>
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {reviewedCount} de {total} revisados
        </span>
      </div>

      {/* Findings list */}
      <div className="flex flex-col gap-3">
        {MOCK_FINDINGS.map((finding) => {
          const state = states[finding.id]!
          const { decision, correction, editing } = state

          const isConfirmed = decision === 'confirmed'
          const isCorrected = decision === 'corrected'
          const isIgnored  = decision === 'ignored'
          const isPending  = decision === 'pending'

          return (
            <div
              key={finding.id}
              className={[
                'rounded-lg border p-4 transition-colors',
                isConfirmed
                  ? 'bg-green-50 border-green-200'
                  : isCorrected
                    ? 'bg-blue-50 border-blue-200'
                    : isIgnored
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-card border-border',
              ].join(' ')}
            >
              {/* Top row: badge + label + reset */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={[
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      CATEGORY_COLORS[finding.categoria],
                    ].join(' ')}
                  >
                    {CATEGORY_LABELS[finding.categoria]}
                  </span>
                  <span
                    className={[
                      'text-sm font-medium',
                      isIgnored ? 'text-muted-foreground' : 'text-foreground',
                    ].join(' ')}
                  >
                    {finding.label}
                  </span>
                </div>

                {/* Reset — only when reviewed */}
                {!isPending && (
                  <button
                    onClick={() => resetDecision(finding.id, finding.valor)}
                    className="flex-shrink-0 p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                    title="Desfazer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Value display */}
              <div className="mb-3">
                {isCorrected ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm text-muted-foreground line-through">{finding.valor}</span>
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={correction}
                          onChange={(e) => setCorrection(finding.id, e.target.value)}
                          className="flex-1 text-sm text-blue-700 font-medium bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') stopEditing(finding.id)
                            if (e.key === 'Escape') stopEditing(finding.id)
                          }}
                        />
                        <button
                          onClick={() => stopEditing(finding.id)}
                          className="flex-shrink-0 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(finding.id)}
                        className="text-left text-sm text-blue-700 font-medium hover:underline"
                      >
                        {correction}
                      </button>
                    )}
                  </div>
                ) : (
                  <span
                    className={[
                      'text-sm',
                      isIgnored
                        ? 'text-muted-foreground line-through'
                        : isConfirmed
                          ? 'text-green-800 font-medium'
                          : 'text-foreground',
                    ].join(' ')}
                  >
                    {finding.valor}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {/* Confirmar */}
                <button
                  onClick={() => setDecision(finding.id, isConfirmed ? 'pending' : 'confirmed')}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                    isConfirmed
                      ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                      : 'border-border text-foreground hover:bg-green-50 hover:border-green-300 hover:text-green-700',
                  ].join(' ')}
                >
                  <Check size={12} weight="bold" />
                  Confirmar
                </button>

                {/* Corrigir */}
                <button
                  onClick={() => {
                    if (isCorrected) {
                      setDecision(finding.id, 'pending')
                    } else {
                      startEditing(finding.id)
                    }
                  }}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                    isCorrected
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      : 'border-border text-foreground hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700',
                  ].join(' ')}
                >
                  <PencilSimple size={12} />
                  Corrigir
                </button>

                {/* Ignorar */}
                <button
                  onClick={() => setDecision(finding.id, isIgnored ? 'pending' : 'ignored')}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                    isIgnored
                      ? 'bg-gray-400 text-white border-gray-400 hover:bg-gray-500'
                      : 'border-border text-foreground hover:bg-gray-100 hover:border-gray-300',
                  ].join(' ')}
                >
                  <X size={12} />
                  Ignorar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {allReviewed ? 'Tudo revisado!' : `Faltam ${total - reviewedCount} item(ns)`}
        </span>
        <button
          onClick={onContinue}
          disabled={!allReviewed}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Tudo certo!
        </button>
      </div>
    </div>
  )
}
