import { NavLink } from 'react-router-dom'
import { Eye, PencilSimple, Robot, Gear, Moon, Sun } from '@phosphor-icons/react'
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
    <header className="hidden lg:flex items-center justify-between bg-background border-b border-border px-8 py-4 transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">KS</span>
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
                    ? 'text-amber-700 bg-amber-50 border border-amber-200'
                    : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50',
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
          className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-amber-50 dark:hover:bg-muted transition-colors"
          aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun size={18} weight="duotone" /> : <Moon size={18} weight="duotone" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-medium">
          A
        </div>
      </div>
    </header>
  )
}
