import { useRef, KeyboardEvent, ClipboardEvent } from 'react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
}

export function OtpInput({ value, onChange, length = 6, disabled = false }: OtpInputProps) {
  const digits = value.padEnd(length, '').split('').slice(0, length)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function focus(i: number) {
    refs.current[i]?.focus()
  }

  function handleChange(i: number, char: string) {
    const d = char.replace(/\D/g, '').slice(-1)
    const next = digits.map((v, idx) => (idx === i ? d : v)).join('').replace(/ /g, '')
    onChange(next)
    if (d && i < length - 1) focus(i + 1)
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = digits.map((v, idx) => (idx === i ? '' : v)).join('').replace(/ /g, '')
        onChange(next)
      } else if (i > 0) {
        focus(i - 1)
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focus(i - 1)
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      focus(i + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted)
    const nextFocus = Math.min(pasted.length, length - 1)
    focus(nextFocus)
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() ?? ''}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="w-11 h-13 text-center text-lg font-semibold rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition-colors"
        />
      ))}
    </div>
  )
}
