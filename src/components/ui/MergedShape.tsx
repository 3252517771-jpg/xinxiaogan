import type { ReactNode } from 'react'

interface MergedShapeProps {
  accent?: string
  label?: string
  children?: ReactNode
}

function MergedShape({ accent = '#A8FFB4', label, children }: MergedShapeProps) {
  return (
    <div className="lift-on-hover relative min-h-44 overflow-hidden rounded-glass bg-[rgba(248,252,244,0.96)] p-5 text-forest-deep shadow-[0_16px_38px_rgba(4,10,7,0.26)] ring-1 ring-white/60 backdrop-blur-sm">
      <div className="absolute right-4 top-4 h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
      <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-20" style={{ backgroundColor: accent }} />
      {label ? <p className="mb-8 text-xs font-semibold uppercase text-forest-deep/58">{label}</p> : null}
      <div className="relative">{children}</div>
    </div>
  )
}

export default MergedShape
