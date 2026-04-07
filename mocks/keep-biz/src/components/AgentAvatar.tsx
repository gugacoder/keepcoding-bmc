import { useState } from 'react'
import { Robot } from '@phosphor-icons/react'
import type { Agent } from '@/data/types'

// Color palette for fallback avatars (one per agent name initial)
const AVATAR_COLORS: Record<string, string> = {
  I: 'bg-blue-100 text-blue-700',
  L: 'bg-emerald-100 text-emerald-700',
  S: 'bg-purple-100 text-purple-700',
  C: 'bg-orange-100 text-orange-700',
}

function getColor(name: string): string {
  const initial = name.charAt(0).toUpperCase()
  return AVATAR_COLORS[initial] ?? 'bg-slate-100 text-slate-600'
}

interface AgentAvatarProps {
  agent: Pick<Agent, 'name' | 'avatar'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
}

export function AgentAvatar({ agent, size = 'md', className = '' }: AgentAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const sizeClass = SIZE_CLASS[size]

  if (agent.avatar && !imgError) {
    return (
      <img
        src={agent.avatar}
        alt={agent.name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
        onError={() => setImgError(true)}
      />
    )
  }

  const initials = agent.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${getColor(agent.name)} ${className}`}
      title={agent.name}
    >
      {initials || <Robot weight="duotone" />}
    </div>
  )
}
