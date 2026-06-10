import type { ButtonHTMLAttributes } from 'react'

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'color'
}

function PillButton({ variant = 'primary', className = '', ...props }: PillButtonProps) {
  const variantClass = {
    primary: 'bg-white text-forest-deep shadow-[0_10px_24px_rgba(255,255,255,0.18)] hover:bg-white/90',
    outline: 'border border-white/30 text-white hover:border-white/55 hover:bg-white/10',
    ghost: 'text-white hover:bg-white/10',
    color: 'bg-dimension-exercise text-forest-deep shadow-[0_12px_28px_rgba(168,255,180,0.22)] hover:bg-dimension-exercise/90',
  }[variant]

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-pill px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dimension-exercise disabled:cursor-not-allowed disabled:opacity-45 ${variantClass} ${className}`}
      type="button"
      {...props}
    />
  )
}

export default PillButton
