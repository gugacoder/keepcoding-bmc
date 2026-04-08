import { useState } from 'react'
import { Robot } from '@phosphor-icons/react'
import type { Agent } from '@/data/types'

// Color palette for fallback avatars (one per agent name initial)
const AVATAR_COLORS: Record<string, string> = {
  I: 'bg-info/10 text-info',
  L: 'bg-success/10 text-success',
  S: 'bg-violet/10 text-violet',
  C: 'bg-orange/10 text-orange',
}

function getColor(name: string): string {
  const initial = name.charAt(0).toUpperCase()
  return AVATAR_COLORS[initial] ?? 'bg-muted text-muted-foreground'
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
