interface PasswordStrengthProps {
  password: string
}

function getStrength(password: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (password.length === 0) return { level: 0, label: '' }
  if (password.length < 6) return { level: 1, label: 'Fraca' }
  if (password.length < 10) return { level: 2, label: 'Média' }
  return { level: 3, label: 'Forte' }
}

const colors: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-yellow-500',
  3: 'bg-green-500',
}

const labelColors: Record<number, string> = {
  1: 'text-red-600 dark:text-red-400',
  2: 'text-yellow-600 dark:text-yellow-400',
  3: 'text-green-600 dark:text-green-400',
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { level, label } = getStrength(password)

  if (level === 0) return null

  return (
    <div className="mt-1.5">
      <div className="flex gap-1.5 mb-1">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              bar <= level ? colors[level] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${labelColors[level]}`}>{label}</p>
    </div>
  )
}
