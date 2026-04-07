import { useState } from 'react'
import {
  Microphone,
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Buildings,
  Wrench,
  ClipboardText,
} from '@phosphor-icons/react'
import { useWorkflows } from '@/contexts/WorkflowContext'
import { connectors } from '@/data/connectors'
import type { Department } from '@/data/types'

interface WorkflowWizardProps {
  open: boolean
  onClose: () => void
}

const DEPARTMENTS: Department[] = ['RH', 'Financeiro', 'Operações', 'Marketing', 'Atendimento']

const STEP_LABELS = ['Descrever', 'Departamento', 'Ferramentas', 'Confirmar']

const connectedConnectors = connectors.filter((c) => c.status === 'connected')

interface FormData {
  description: string
  department: Department | ''
  connectorIds: string[]
}

export function WorkflowWizard({ open, onClose }: WorkflowWizardProps) {
  const { addWorkflow } = useWorkflows()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    description: '',
    department: '',
    connectorIds: [],
  })

  const reset = () => {
    setStep(0)
    setForm({ description: '', department: '', connectorIds: [] })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const canNext = () => {
    if (step === 0) return form.description.trim().length > 0
    if (step === 1) return form.department !== ''
    return true
  }

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const handleConfirm = () => {
    if (!form.department) return
    const name = form.description.trim().slice(0, 60) + (form.description.trim().length > 60 ? '...' : '')
    addWorkflow({
      name,
      description: form.description.trim(),
      department: form.department as Department,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Novo Workflow</h2>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 px-6 pt-4 pb-2">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors',
                    i < step
                      ? 'bg-blue-600 text-white'
                      : i === step
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-slate-100 text-slate-400',
                  ].join(' ')}
                >
                  {i < step ? <Check size={12} weight="bold" /> : i + 1}
                </div>
                <span
                  className={[
                    'mt-1 text-[10px] font-medium whitespace-nowrap',
                    i <= step ? 'text-blue-600' : 'text-slate-400',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={[
                    'flex-1 h-px mx-1 mb-4 transition-colors',
                    i < step ? 'bg-blue-600' : 'bg-slate-200',
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descreva o workflow
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-32 px-3 py-3 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  placeholder="Descreva o que o pessoal faz repetidamente… ex: 'Toda segunda-feira o time financeiro reconcilia os extratos bancários com o ERP e gera um relatório de divergências.'"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  autoFocus
                />
                {/* Mic icon decorative */}
                <div className="absolute bottom-3 right-3 text-slate-300 pointer-events-none">
                  <Microphone size={20} weight="duotone" />
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                <Microphone size={12} weight="duotone" className="inline mr-1" />
                Em breve: descreva por voz
              </p>
            </div>
          )}

          {/* Step 1 — Departamento */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Buildings size={16} weight="duotone" className="inline mr-1.5 text-blue-500" />
                Departamento responsável
              </label>
              <div className="grid grid-cols-1 gap-2">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setForm((p) => ({ ...p, department: dept }))}
                    className={[
                      'flex items-center gap-3 px-4 py-3 rounded-md border text-sm font-medium transition-colors text-left',
                      form.department === dept
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'w-3 h-3 rounded-full border-2 transition-colors',
                        form.department === dept ? 'border-blue-500 bg-blue-500' : 'border-slate-300',
                      ].join(' ')}
                    />
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Ferramentas */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Wrench size={16} weight="duotone" className="inline mr-1.5 text-blue-500" />
                Ferramentas utilizadas
              </label>
              <p className="text-xs text-slate-400 mb-3">Selecione os conectores que este workflow usa</p>
              <div className="space-y-2">
                {connectedConnectors.map((conn) => {
                  const selected = form.connectorIds.includes(conn.id)
                  return (
                    <button
                      key={conn.id}
                      onClick={() => toggleConnector(conn.id)}
                      className={[
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-md border text-sm transition-colors text-left',
                        selected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex items-center justify-center w-4 h-4 rounded border-2 shrink-0 transition-colors',
                          selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300',
                        ].join(' ')}
                      >
                        {selected && <Check size={10} weight="bold" className="text-white" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-slate-800">{conn.name}</span>
                        <span className="ml-2 text-xs text-slate-400">{conn.category}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              {connectedConnectors.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">
                  Nenhum conector conectado. Adicione conectores nas configurações.
                </p>
              )}
            </div>
          )}

          {/* Step 3 — Confirmar */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardText size={18} weight="duotone" className="text-blue-500" />
                <span className="text-sm font-semibold text-slate-800">Resumo do workflow</span>
              </div>

              <div className="bg-slate-50 rounded-md border border-slate-200 p-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Descrição</span>
                  <p className="mt-1 text-slate-800 leading-relaxed">{form.description}</p>
                </div>

                <div className="flex gap-6">
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Departamento</span>
                    <p className="mt-1 text-slate-800 font-medium">{form.department}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status inicial</span>
                    <p className="mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        mapeado
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ferramentas</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {form.connectorIds.length === 0 ? (
                      <span className="text-slate-400 text-xs">Nenhuma selecionada</span>
                    ) : (
                      form.connectorIds.map((id) => {
                        const c = connectedConnectors.find((x) => x.id === id)
                        return c ? (
                          <span
                            key={id}
                            className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={15} weight="bold" />
            Voltar
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Próximo
              <ArrowRight size={15} weight="bold" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
            >
              <Check size={15} weight="bold" />
              Criar Workflow
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
