import { NavLink } from 'react-router-dom'
import { Eye, Megaphone, Robot, Gear } from '@phosphor-icons/react'

const navItems = [
  { label: 'Monitor', href: '/monitor', icon: Eye },
  { label: 'Content', href: '/content', icon: Megaphone },
  { label: 'Agents', href: '/agents', icon: Robot },
  { label: 'Config', href: '/settings', icon: Gear },
]

export function BottomNav() {
  return (
    <nav className="flex items-center justify-around bg-sidebar border-t border-sidebar-border px-2 py-1 safe-area-pb">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-0.5 px-4 py-3 rounded-md text-xs font-medium transition-colors min-w-[56px] min-h-[48px] justify-center',
                isActive
                  ? 'text-sidebar-primary'
                  : 'text-muted-foreground hover:text-sidebar-foreground',
              ].join(' ')
            }
          >
            <Icon size={22} weight="duotone" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
