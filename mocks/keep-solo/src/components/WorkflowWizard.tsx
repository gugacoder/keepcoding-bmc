import { useState } from 'react'
import {
  Microphone,
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Wrench,
  ClipboardText,
} from '@phosphor-icons/react'
import { useWorkflows } from '@/contexts/WorkflowContext'
import { connectors } from '@/data/connectors'

interface WorkflowWizardProps {
  open: boolean
  onClose: () => void
}

const STEP_LABELS = ['Descrever', 'Ferramentas', 'Confirmar']

const connectedConnectors = connectors.filter((c) => c.status === 'connected')

interface FormData {
  description: string
  connectorIds: string[]
}

export function WorkflowWizard({ open, onClose }: WorkflowWizardProps) {
  const { addWorkflow } = useWorkflows()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    description: '',
    connectorIds: [],
  })

  const reset = () => {
    setStep(0)
    setForm({ description: '', connectorIds: [] })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const canNext = () => {
    if (step === 0) return form.description.trim().length > 0
    return true
  }

  const handleNext = () => {
    if (step < 2) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const handleConfirm = () => {
    const raw = form.description.trim()
    const name = raw.length > 60 ? raw.slice(0, 60) + '...' : raw
    addWorkflow({
      name,
      description: raw,
      connectorIds: form.connectorIds,
    })
    handleClose()
  }

  const toggleConnector = (id: string) => {
    setForm((prev) => ({
      ...prev,
      connectorIds: prev.connectorIds.includes(id)
        ? prev.connectorIds.filter((c) => c !== id)
        : [...prev.connectorIds, id],
    }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg sm:mx-4 bg-card rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Novo Workflow</h2>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 px-6 pt-5 pb-2">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors',
                    i < step
                      ? 'bg-primary text-primary-foreground'
                      : i === step
                      ? 'bg-primary text-primary-foreground ring-4 ring-accent'
                      : 'bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  {i < step ? <Check size={13} weight="bold" /> : i + 1}
                </div>
                <span
                  className={[
                    'mt-1 text-[10px] font-medium whitespace-nowrap',
                    i <= step ? 'text-accent-foreground' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={[
                    'flex-1 h-px mx-2 mb-4 transition-colors',
                    i < step ? 'bg-primary' : 'bg-border',
                  ].join(' ')}
                />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[220px]">
          {/* Step 0 — Descrever */}
          {step === 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                O que você faz repetidamente?
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-32 px-4 py-3 pr-10 text-sm bg-secondary/50 border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
                  placeholder="Ex: 'Toda semana respondo os mesmos DMs de orçamento no Instagram. Copio os dados para uma planilha e mando link de pagamento pelo WhatsApp.'"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  autoFocus
                />
                {/* Mic icon decorative */}
                <div className="absolute bottom-3 right-3 text-muted-foreground/50 pointer-events-none">
                  <Microphone size={20} weight="duotone" />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Microphone size={12} weight="duotone" className="text-primary" />
                Em breve: descreva por voz
              </p>
            </div>
          )}

          {/* Step 1 — Ferramentas */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                <Wrench size={16} weight="duotone" className="text-primary" />
                Ferramentas que você usa
              </label>
              <p className="text-xs text-muted-foreground mb-3">Selecione as ferramentas deste workflow</p>
              <div className="space-y-2">
                {connectedConnectors.map((conn) => {
                  const selected = form.connectorIds.includes(conn.id)
                  return (
                    <button
                      key={conn.id}
                      onClick={() => toggleConnector(conn.id)}
                      className={[
                        'w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm transition-all text-left',
                        selected
                          ? 'border-primary bg-secondary shadow-sm'
                          : 'border-border bg-card hover:border-primary/30 hover:bg-secondary/50',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex items-center justify-center w-5 h-5 rounded-lg border-2 shrink-0 transition-colors',
                          selected ? 'border-primary bg-primary' : 'border-muted-foreground/30',
                        ].join(' ')}
                      >
                        {selected && <Check size={11} weight="bold" className="text-primary-foreground" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground">{conn.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{conn.category}</span>
                      </div>
                    </button>
                  )
                })}
                {connectedConnectors.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Nenhuma ferramenta conectada ainda.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Confirmar */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardText size={18} weight="duotone" className="text-primary" />
                <span className="text-sm font-semibold text-foreground">Resumo do workflow</span>
              </div>

              <div className="bg-secondary/60 rounded-2xl border border-border p-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</span>
                  <p className="mt-1 text-foreground leading-relaxed">{form.description}</p>
                </div>

                <div className="flex gap-6 items-start">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status inicial</span>
                    <p className="mt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border">
                        mapeado
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ferramentas</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {form.connectorIds.length === 0 ? (
                      <span className="text-muted-foreground text-xs">Nenhuma selecionada</span>
                    ) : (
                      form.connectorIds.map((id) => {
                        const c = connectedConnectors.find((x) => x.id === id)
                        return c ? (
                          <span
                            key={id}
                            className="px-2.5 py-0.5 text-xs font-medium bg-accent text-secondary-foreground rounded-full border border-border"
                          >
                            {c.name}
                          </span>
                        ) : null
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={15} weight="bold" />
            Voltar
          </button>

          {step < 2 ? (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Próximo
              <ArrowRight size={15} weight="bold" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Check size={15} weight="bold" />
              Criar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
