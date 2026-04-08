import { agents } from '@/data'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Buildings, Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '@/contexts/ThemeContext'

function getTeamStatus(agentList: typeof agents): 'green' | 'yellow' | 'red' {
  const active = agentList.filter((a) => a.heartbeat)
  if (active.length === 0) return 'red'
  const hasWaiting = agentList.some((a) => a.status === 'Waiting on data')
  return hasWaiting ? 'yellow' : 'green'
}

const statusConfig = {
  green: { color: 'bg-success', label: 'Operacional', pulse: 'animate-pulse' },
  yellow: { color: 'bg-warning', label: 'Atenção', pulse: 'animate-pulse' },
  red: { color: 'bg-destructive', label: 'Alerta', pulse: 'animate-pulse' },
}

export function OrchestratorBar() {
  const status = getTeamStatus(agents)
  const activeCount = agents.filter((a) => a.heartbeat).length
  const config = statusConfig[status]
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between bg-sidebar text-sidebar-foreground px-4 py-2.5 border-b border-sidebar-border min-h-[48px] shrink-0 z-10">
      {/* Left: brand */}
      <div className="flex items-center gap-2">
        <Buildings size={20} weight="duotone" className="text-sidebar-primary" />
        <span className="text-sm font-semibold tracking-wide">KeepBiz</span>
      </div>

      {/* Center: Team Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${config.color} ${config.pulse}`} />
        <span className="text-xs font-medium text-sidebar-foreground/70">
          Team Status: <span className="text-sidebar-foreground">{config.label}</span>
        </span>
        <span className="text-xs text-muted-foreground ml-1">
          {activeCount} agente{activeCount !== 1 ? 's' : ''} ativo{activeCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Right: Dark mode + Language selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun size={16} weight="duotone" /> : <Moon size={16} weight="duotone" />}
        </button>
        <LanguageSelector />
      </div>
    </header>
  )
}
