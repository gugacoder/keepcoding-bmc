import { NavLink } from 'react-router-dom'
import { Eye, PencilSimple, Robot } from '@phosphor-icons/react'

const navItems = [
  { label: 'Monitor', href: '/monitor', icon: Eye },
  { label: 'Criar', href: '/create', icon: PencilSimple },
  { label: 'Agentes', href: '/agents', icon: Robot },
]

export function BottomNav() {
  return (
    <nav className="flex items-center justify-around bg-white border-t border-amber-100 px-2 py-2 safe-area-pb">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1 px-6 py-3 rounded-xl text-xs font-medium transition-all min-w-[64px] min-h-[48px] justify-center',
                isActive
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-stone-400 hover:text-amber-500',
              ].join(' ')
            }
          >
            <Icon size={24} weight="duotone" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
