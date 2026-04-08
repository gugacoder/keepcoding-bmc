import { useState } from 'react'
import { Brain, X, ArrowRight } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { useProfiles } from '@/contexts/ProfileContext'

const INSIGHTS_BY_PROFILE: Record<string, string[]> = {
  'PRF-001': [
    'O perfil Processa Sistemas teve 2x mais alcance no LinkedIn esta semana — sugerindo intensificar presença nessa plataforma.',
    'Conteúdo do tipo carrossel gera 60% mais engajamento. O agente já preparou sugestões nesse formato.',
  ],
  'PRF-002': [
    'Posts educacionais do perfil Processa Academy têm taxa de salvamento 3x maior no Instagram.',
    'Vídeos curtos com dicas práticas geram 45% mais compartilhamentos. Confira as sugestões preparadas.',
  ],
}

const DEFAULT_INSIGHTS = [
  'O perfil Processa Sistemas teve 2x mais alcance no LinkedIn esta semana — sugerindo intensificar presença nessa plataforma.',
  'Conteúdo do tipo carrossel gera 60% mais engajamento. O agente já preparou sugestões nesse formato.',
]

export function AiInsightCard() {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()
  const { activeProfileId } = useProfiles()

  if (dismissed) return null

  const insights =
    activeProfileId !== null
      ? (INSIGHTS_BY_PROFILE[activeProfileId] ?? DEFAULT_INSIGHTS)
      : DEFAULT_INSIGHTS

  return (
    <div className="relative bg-violet-50 dark:bg-violet-950/20 rounded-md border border-violet-200 dark:border-violet-800 border-l-4 border-l-violet-500 p-4 shadow-sm">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-violet-400 hover:text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
        aria-label="Dispensar"
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-2 mb-3 pr-6">
        <Brain size={18} weight="duotone" className="text-violet-500 shrink-0" />
        <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-200">
          Baseado no seu desempenho recente
        </h3>
      </div>

      <ul className="space-y-2 mb-4">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-violet-800 dark:text-violet-300">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
            {insight}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate('/content')}
        className="flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
      >
        Ver sugestões de conteúdo
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
