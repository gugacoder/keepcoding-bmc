import { NavLink } from 'react-router-dom'
import { Eye, PencilSimple, Robot, Gear, Moon, Sun, Sparkle } from '@phosphor-icons/react'
import { useTheme } from '@/contexts/ThemeContext'

const navItems = [
  { label: 'Monitor', href: '/monitor', icon: Eye },
  { label: 'Criar', href: '/create', icon: PencilSimple },
  { label: 'Agentes', href: '/agents', icon: Robot },
  { label: 'Config', href: '/config', icon: Gear },
]

export function DesktopHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="hidden lg:block bg-background border-b border-border px-8 py-4 transition-colors">
    <div className="mx-auto max-w-5xl flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
          <Sparkle size={16} weight="fill" className="text-white" />
        </div>
        <span className="font-semibold text-foreground text-lg">KeepSolo</span>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'text-secondary-foreground bg-secondary border border-border'
                    : 'text-muted-foreground hover:text-accent-foreground hover:bg-secondary',
                ].join(' ')
              }
            >
              <Icon size={18} weight="duotone" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Dark mode + User */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun size={18} weight="duotone" /> : <Moon size={18} weight="duotone" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-secondary-foreground text-sm font-medium">
          A
        </div>
      </div>
    </div>
    </header>
  )
}
