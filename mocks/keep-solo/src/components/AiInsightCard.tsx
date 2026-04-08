import { useState } from 'react'
import { Lightbulb, X, ArrowRight } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const INSIGHTS = [
  'Seu conteúdo de Instagram teve 3x mais engajamento esta semana — sugerindo mais posts para essa plataforma.',
  'Posts publicados às terças-feiras performam 40% melhor. Considere agendar conteúdo para esse dia.',
]

export function AiInsightCard() {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (dismissed) return null

  return (
    <div className="relative bg-violet-500/5 dark:bg-violet-500/10 rounded-2xl border border-violet-200/50 dark:border-violet-800/40 border-l-4 border-l-violet-500 p-4 shadow-sm">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label={t('autocreation.campaign.dismiss')}
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-2 mb-3 pr-6">
        <Lightbulb size={18} weight="duotone" className="text-violet-500 shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">
          {t('autocreation.monitor.insightTitle')}
        </h3>
      </div>

      <ul className="space-y-2 mb-4">
        {INSIGHTS.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
            {insight}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate('/create')}
        className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
      >
        {t('autocreation.monitor.viewSuggestions')}
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
