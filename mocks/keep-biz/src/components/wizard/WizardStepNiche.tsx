import { useState } from 'react'
import { Check, Robot, PencilSimple } from '@phosphor-icons/react'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NicheData {
  selectedSegment: string
  targetAudience: string[]
  positioningStatement: string
}

// ─── Segment data ────────────────────────────────────────────────────────────

interface Segment {
  id: string
  label: string
  icon: string
  audiences: string[]
  agentSuggestion: string
}

const SEGMENTS: Segment[] = [
  {
    id: 'saude',
    label: 'Saúde & Bem-estar',
    icon: '🏥',
    audiences: ['Pacientes', 'Profissionais de saúde', 'Esportistas', 'Idosos'],
    agentSuggestion:
      'Somos referência em cuidados integrados de saúde, combinando tecnologia e humanização para promover bem-estar duradouro aos nossos clientes.',
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia',
    icon: '💻',
    audiences: ['Empresas de médio porte', 'Startups', 'Desenvolvedores', 'Gestores de TI'],
    agentSuggestion:
      'Transformamos desafios digitais em soluções escaláveis, entregando tecnologia de ponta com suporte especializado para empresas que buscam crescimento sustentável.',
  },
  {
    id: 'varejo',
    label: 'Varejo',
    icon: '🛍️',
    audiences: ['Consumidor final', 'Famílias', 'Jovens adultos', 'Compradores recorrentes'],
    agentSuggestion:
      'Oferecemos uma experiência de compra única, com produtos cuidadosamente selecionados e atendimento personalizado que fideliza nossos clientes.',
  },
  {
    id: 'servicos-b2b',
    label: 'Serviços B2B',
    icon: '🤝',
    audiences: ['Empresas de médio porte', 'Grandes corporações', 'Gestores', 'Diretores'],
    agentSuggestion:
      'Somos o parceiro estratégico que empresas escolhem para otimizar processos e escalar resultados com eficiência e confiabilidade.',
  },
  {
    id: 'educacao',
    label: 'Educação',
    icon: '🎓',
    audiences: ['Estudantes', 'Profissionais em transição', 'Pais', 'Empresas (treinamento)'],
    agentSuggestion:
      'Democratizamos o acesso ao conhecimento com metodologias inovadoras que transformam aprendizagem em resultados concretos para pessoas e organizações.',
  },
  {
    id: 'alimentacao',
    label: 'Alimentação',
    icon: '🍽️',
    audiences: ['Famílias', 'Jovens profissionais', 'Veganos/vegetarianos', 'Atletas'],
    agentSuggestion:
      'Combinamos sabor, nutrição e conveniência para oferecer experiências gastronômicas que encantam e nutrem nossos clientes no dia a dia.',
  },
  {
    id: 'financas',
    label: 'Finanças',
    icon: '💰',
    audiences: ['Investidores', 'Pequenas empresas', 'Autônomos', 'Famílias'],
    agentSuggestion:
      'Simplificamos a gestão financeira com soluções inteligentes e transparentes que empoderam nossos clientes a alcançar seus objetivos econômicos.',
  },
  {
    id: 'industria',
    label: 'Indústria',
    icon: '🏭',
    audiences: ['Engenheiros', 'Gerentes de produção', 'Fornecedores', 'Compradores industriais'],
    agentSuggestion:
      'Elevamos a eficiência industrial com inovação tecnológica e expertise operacional, sendo o parceiro confiável de empresas que lideram seus setores.',
  },
]

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  data: NicheData
  onChange: (data: NicheData) => void
}

export function WizardStepNiche({ data, onChange }: Props) {
  const [useAgentSuggestion, setUseAgentSuggestion] = useState(
    data.positioningStatement === '' || data.positioningStatement === getSegmentSuggestion(data.selectedSegment),
  )

  function getSegmentSuggestion(segmentId: string): string {
    return SEGMENTS.find((s) => s.id === segmentId)?.agentSuggestion ?? ''
  }

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

  const activeSegment = SEGMENTS.find((s) => s.id === data.selectedSegment)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Nicho & Posicionamento</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Selecione o segmento do seu negócio e defina como você se posiciona no mercado.
        </p>
      </div>

      {/* Segment grid */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Segmento de mercado</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SEGMENTS.map((segment) => {
            const isSelected = data.selectedSegment === segment.id
            return (
              <button
                key={segment.id}
                type="button"
                onClick={() => handleSelectSegment(segment.id)}
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

                <span className="text-2xl leading-none">{segment.icon}</span>
                <span
                  className={[
                    'text-sm font-medium leading-tight',
                    isSelected ? 'text-primary' : 'text-foreground',
                  ].join(' ')}
                >
                  {segment.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Target audience chips — shown when segment is selected */}
      {activeSegment && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Público-alvo{' '}
            <span className="text-xs font-normal text-muted-foreground">(selecione os que se aplicam)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSegment.audiences.map((audience) => {
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
      {activeSegment && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Posicionamento</p>
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
                Usar sugestão do agente
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
                Escrever do meu jeito
              </button>
            </div>
          </div>

          {/* Agent suggestion banner */}
          {useAgentSuggestion && (
            <div className="flex items-start gap-2 mb-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Robot size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sugestão gerada pelo agente com base no seu segmento e achados da pesquisa.
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
            placeholder="Descreva como seu negócio se posiciona no mercado..."
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
