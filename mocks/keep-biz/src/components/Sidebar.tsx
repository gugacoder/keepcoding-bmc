import { NavLink, useLocation } from 'react-router-dom'
import {
  Eye,
  Megaphone,
  Robot,
  Gear,
  CalendarDots,
  Chat,
  PlugsConnected,
  CaretDoubleLeft,
  CaretDoubleRight,
  GitBranch,
} from '@phosphor-icons/react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string; icon: React.ElementType }[]
}

const navItems: NavItem[] = [
  {
    label: 'Social Monitor',
    href: '/monitor',
    icon: Eye,
  },
  {
    label: 'Content Forge',
    href: '/content',
    icon: Megaphone,
    children: [
      { label: 'Calendário', href: '/content/calendar', icon: CalendarDots },
    ],
  },
  {
    label: 'Agent Core',
    href: '/agents',
    icon: Robot,
    children: [
      { label: 'Workflows', href: '/agents/workflows', icon: GitBranch },
      { label: 'Chat', href: '/agents/chat', icon: Chat },
      { label: 'Conectores', href: '/agents/connectors', icon: PlugsConnected },
    ],
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <aside
      className="flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out border-r border-sidebar-border"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border min-h-[56px]">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground tracking-wide truncate">
            KeepBiz
          </span>
        )}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors ml-auto"
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? (
            <CaretDoubleRight size={14} weight="bold" />
          ) : (
            <CaretDoubleLeft size={14} weight="bold" />
          )}
        </button>
      </div>

      {/* Navigation zones */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const hasActiveChild = item.children?.some((c) => isActive(c.href))
          const expanded = !collapsed && (active || hasActiveChild)

          return (
            <div key={item.href}>
              <NavLink
                to={item.href}
                end={!item.children}
                className={() =>
                  [
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    collapsed ? 'justify-center' : '',
                    active || hasActiveChild
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent',
                  ].join(' ')
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} weight="duotone" className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>

              {/* Sub-items */}
              {!collapsed && expanded && item.children && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const childActive = isActive(child.href)
                    return (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={() =>
                          [
                            'flex items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-colors',
                            childActive
                              ? 'text-sidebar-primary bg-sidebar-accent'
                              : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent',
                          ].join(' ')
                        }
                      >
                        <ChildIcon size={16} weight="duotone" />
                        <span>{child.label}</span>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="border-t border-sidebar-border p-2">
        <NavLink
          to="/settings"
          className={({ isActive: active }) =>
            [
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
              collapsed ? 'justify-center' : '',
              active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent',
            ].join(' ')
          }
          title={collapsed ? 'Configurações' : undefined}
        >
          <Gear size={20} weight="duotone" className="shrink-0" />
          {!collapsed && <span>Configurações</span>}
        </NavLink>
      </div>
    </aside>
  )
}
