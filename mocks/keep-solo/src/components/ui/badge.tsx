import { type ReactNode } from 'react'

type BadgeColor =
  | 'blue'
  | 'orange'
  | 'rose'
  | 'amber'
  | 'purple'
  | 'cyan'
  | 'emerald'
  | 'green'
  | 'yellow'
  | 'muted'

interface BadgeProps {
  color: BadgeColor
  children: ReactNode
  border?: boolean
  pulse?: boolean
  className?: string
}

const COLOR_MAP: Record<BadgeColor, { base: string; dot: string }> = {
  blue:    { base: 'bg-blue-700/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-400', dot: 'bg-blue-500' },
  orange:  { base: 'bg-orange-700/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-400', dot: 'bg-orange-500' },
  rose:    { base: 'bg-rose-700/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-400', dot: 'bg-rose-500' },
  amber:   { base: 'bg-amber-700/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400', dot: 'bg-amber-500' },
  purple:  { base: 'bg-purple-700/10 text-purple-700 dark:bg-purple-400/15 dark:text-purple-400', dot: 'bg-purple-500' },
  cyan:    { base: 'bg-cyan-700/10 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-400', dot: 'bg-cyan-500' },
  emerald: { base: 'bg-emerald-700/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400', dot: 'bg-emerald-500' },
  green:   { base: 'bg-green-700/10 text-green-700 dark:bg-green-400/15 dark:text-green-400', dot: 'bg-green-500' },
  yellow:  { base: 'bg-yellow-700/10 text-yellow-700 dark:bg-yellow-400/15 dark:text-yellow-400', dot: 'bg-yellow-500' },
  muted:   { base: 'bg-muted-foreground/10 text-muted-foreground', dot: 'bg-muted-foreground' },
}

const BORDER_MAP: Record<BadgeColor, string> = {
  blue:    'border-blue-700/20 dark:border-blue-400/20',
  orange:  'border-orange-700/20 dark:border-orange-400/20',
  rose:    'border-rose-700/20 dark:border-rose-400/20',
  amber:   'border-amber-700/20 dark:border-amber-400/20',
  purple:  'border-purple-700/20 dark:border-purple-400/20',
  cyan:    'border-cyan-700/20 dark:border-cyan-400/20',
  emerald: 'border-emerald-700/20 dark:border-emerald-400/20',
  green:   'border-green-700/20 dark:border-green-400/20',
  yellow:  'border-yellow-700/20 dark:border-yellow-400/20',
  muted:   'border-muted-foreground/20',
}

export function Badge({ color, children, border, pulse, className = '' }: BadgeProps) {
  const { base, dot } = COLOR_MAP[color]
  const borderCls = border ? `border ${BORDER_MAP[color]}` : ''

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${base} ${borderCls} ${className}`}
    >
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
      )}
      {children}
    </span>
  )
}

export function badgeDotClass(color: BadgeColor) {
  return COLOR_MAP[color].dot
}

export function badgeBaseClass(color: BadgeColor) {
  return COLOR_MAP[color].base
}

interface IconBubbleProps {
  color: BadgeColor
  children: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

export function IconBubble({ color, children, size = 'md', className = '' }: IconBubbleProps) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-8 h-8 rounded-xl'
  return (
    <div className={`${sizeClass} ${COLOR_MAP[color].base} flex items-center justify-center ${className}`}>
      {children}
    </div>
  )
}

export type { BadgeColor }
