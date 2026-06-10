import type { ButtonHTMLAttributes } from 'react'

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
}

function PillButton({ variant = 'primary', className = '', ...props }: PillButtonProps) {
  const variantClass = {
    primary: 'bg-white text-forest-deep',
    outline: 'border border-white/30 text-white',
    ghost: 'text-white hover:bg-white/10',
  }[variant]

  return (
    <button
      className={`rounded-pill px-5 py-2 text-sm font-medium transition ${variantClass} ${className}`}
      type="button"
      {...props}
    />
  )
}

export default PillButton
