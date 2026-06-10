import type { ReactNode } from 'react'

interface GlassCardProps {
  title?: string
  eyebrow?: string
  tone?: 'light' | 'medium' | 'strong'
  className?: string
  children?: ReactNode
}

function GlassCard({ title, eyebrow, tone = 'light', className = '', children }: GlassCardProps) {
  const toneClass = {
    light: 'glass-light',
    medium: 'glass-medium',
    strong: 'glass-strong',
  }[tone]

  return (
    <section className={`glass-edge lift-on-hover ${toneClass} rounded-glass p-5 text-white ${className}`}>
      {eyebrow ? <p className="mb-2 text-xs font-medium uppercase text-white/45">{eyebrow}</p> : null}
      {title ? <h2 className="mb-4 text-lg font-semibold leading-tight text-white">{title}</h2> : null}
      <div className="text-sm leading-6 text-white/72">{children}</div>
    </section>
  )
}

export default GlassCard
