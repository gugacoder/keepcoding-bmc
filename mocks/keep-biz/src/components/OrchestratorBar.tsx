import { useEffect, useRef, useState } from 'react'
import { agents } from '@/data'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Buildings, IdentificationBadge, Moon, Sun, Sparkle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { useProfiles } from '@/contexts/ProfileContext'
import { useContentActions } from '@/hooks/useContentActions'
import { useNavigate } from 'react-router-dom'

function getTeamStatus(agentList: typeof agents): 'green' | 'yellow' | 'red' {
  const active = agentList.filter((a) => a.heartbeat)
  if (active.length === 0) return 'red'
  const hasWaiting = agentList.some((a) => a.status === 'Waiting on data')
  return hasWaiting ? 'yellow' : 'green'
}

const statusColors = {
  green: { color: 'bg-success', pulse: 'animate-pulse' },
  yellow: { color: 'bg-warning', pulse: 'animate-pulse' },
  red: { color: 'bg-destructive', pulse: 'animate-pulse' },
}

export function OrchestratorBar() {
  const status = getTeamStatus(agents)
  const activeCount = agents.filter((a) => a.heartbeat).length
  const config = statusColors[status]
  const { theme, toggleTheme } = useTheme()
  const { profiles, activeProfileId } = useProfiles()
  const { t } = useTranslation()
  const { aiSuggestions } = useContentActions(null)
  const navigate = useNavigate()
  const pendingCount = aiSuggestions.length

  const activeProfile = activeProfileId !== null
    ? profiles.find((p) => p.id === activeProfileId) ?? null
    : null

  const profileLabel = activeProfile !== null
    ? activeProfile.identity.businessName
    : t('orchestratorBar.allProfiles')

  const [displayLabel, setDisplayLabel] = useState(profileLabel)
  const [visible, setVisible] = useState(true)
  const prevLabelRef = useRef(profileLabel)

  useEffect(() => {
    if (profileLabel === prevLabelRef.current) return
    prevLabelRef.current = profileLabel
    setVisible(false)
    const t = setTimeout(() => {
      setDisplayLabel(profileLabel)
      setVisible(true)
    }, 200)
    return () => clearTimeout(t)
  }, [profileLabel])

  return (
    <header className="flex items-center justify-between bg-sidebar text-sidebar-foreground px-4 py-2.5 border-b border-sidebar-border min-h-[48px] shrink-0 z-10">
      {/* Left: brand */}
      <div className="flex items-center gap-2">
        <Buildings size={20} weight="duotone" className="text-sidebar-primary" />
        <span className="text-sm font-semibold tracking-wide">KeepBiz</span>
      </div>

      {/* Center: Team Status + Active Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${config.color} ${config.pulse}`} />
          <span className="text-xs font-medium text-sidebar-foreground/70">
            {t('orchestratorBar.teamStatus')}: <span className="text-sidebar-foreground">{t(`orchestratorBar.statusLabels.${status}`)}</span>
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            {t('orchestratorBar.agentsActive', { count: activeCount })}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <IdentificationBadge size={14} weight="duotone" className="text-sidebar-primary shrink-0" />
          <span className="text-xs text-sidebar-foreground/80 truncate max-w-[150px]">
            {displayLabel}
          </span>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={() => navigate('/content')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-colors"
          >
            <Sparkle size={13} weight="duotone" className="text-violet-400 animate-pulse shrink-0" />
            <span className="text-xs font-medium text-violet-400">
              Agente criou {pendingCount} {pendingCount === 1 ? 'sugestão' : 'sugestões'}
            </span>
          </button>
        )}
      </div>

      {/* Right: Dark mode + Language selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label={theme === 'dark' ? t('orchestratorBar.lightMode') : t('orchestratorBar.darkMode')}
          title={theme === 'dark' ? t('orchestratorBar.lightMode') : t('orchestratorBar.darkMode')}
        >
          {theme === 'dark' ? <Sun size={16} weight="duotone" /> : <Moon size={16} weight="duotone" />}
        </button>
        <LanguageSelector />
      </div>
    </header>
  )
}
