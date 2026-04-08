import { NavLink } from 'react-router-dom'
import { Eye, PencilSimple, Robot, Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '@/contexts/ThemeContext'
import { useContentActions } from '@/hooks/useContentActions'

export function BottomNav() {
  const { theme, toggleTheme } = useTheme()
  const { aiSuggestions } = useContentActions()
  const pendingCount = aiSuggestions.length

  const navItems = [
    { label: 'Monitor', href: '/monitor', icon: Eye, badge: 0 },
    { label: 'Criar', href: '/create', icon: PencilSimple, badge: pendingCount },
    { label: 'Agentes', href: '/agents', icon: Robot, badge: 0 },
  ]

  return (
    <nav className="flex items-center justify-around bg-background border-t border-border px-2 py-2 safe-area-pb transition-colors">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-xs font-medium transition-all min-w-[56px] min-h-[48px] justify-center',
                isActive
                  ? 'text-accent-foreground bg-secondary'
                  : 'text-muted-foreground hover:text-primary',
              ].join(' ')
            }
          >
            <div className="relative">
              <Icon size={24} weight="duotone" />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        )
      })}
      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-xs font-medium transition-all min-w-[56px] min-h-[48px] justify-center text-muted-foreground hover:text-primary"
        aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {theme === 'dark' ? <Sun size={24} weight="duotone" /> : <Moon size={24} weight="duotone" />}
        <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
      </button>
    </nav>
  )
}
