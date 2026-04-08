import { useState } from 'react'
import { Robot } from '@phosphor-icons/react'
import type { Agent } from '@/data/types'

interface AgentAvatarProps {
  agent: Pick<Agent, 'name' | 'avatar'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
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
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0 bg-accent text-secondary-foreground ${className}`}
      title={agent.name}
    >
      {initials || <Robot weight="duotone" />}
    </div>
  )
}
