import { NavLink } from 'react-router-dom'
import { Eye, PencilSimple, Robot, Gear } from '@phosphor-icons/react'

const navItems = [
  { label: 'Monitor', href: '/monitor', icon: Eye },
  { label: 'Criar', href: '/create', icon: PencilSimple },
  { label: 'Agentes', href: '/agents', icon: Robot },
  { label: 'Config', href: '/config', icon: Gear },
]

export function DesktopHeader() {
  return (
    <header className="hidden lg:flex items-center justify-between bg-white border-b border-amber-100 px-8 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">KS</span>
        </div>
        <span className="font-semibold text-stone-800 text-lg">KeepSolo</span>
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

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-medium">
          A
        </div>
      </div>
    </header>
  )
}
