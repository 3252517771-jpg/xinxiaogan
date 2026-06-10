import type { ReactNode } from 'react'

interface GlassCardProps {
  title?: string
  children?: ReactNode
}

function GlassCard({ title, children }: GlassCardProps) {
  return (
    <section className="glass-light rounded-glass p-5 text-white">
      {title ? <h2 className="mb-3 text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  )
}

export default GlassCard
