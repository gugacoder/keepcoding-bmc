import { useState, useEffect } from 'react'

interface OtpTimerProps {
  onResend: () => void
  seconds?: number
}

export function OtpTimer({ onResend, seconds = 60 }: OtpTimerProps) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [seconds])

  if (remaining === 0) {
    return (
      <button
        type="button"
        onClick={() => {
          setRemaining(seconds)
          onResend()
        }}
        className="text-sm text-primary hover:underline font-medium"
      >
        Reenviar código
      </button>
    )
  }

  const mm = String(Math.floor(remaining / 60)).padStart(1, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <span className="text-sm text-muted-foreground">
      Reenviar em <span className="font-medium text-foreground">{mm}:{ss}</span>
    </span>
  )
}
