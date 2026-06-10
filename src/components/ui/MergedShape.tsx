import type { ReactNode } from 'react'

interface MergedShapeProps {
  children?: ReactNode
}

function MergedShape({ children }: MergedShapeProps) {
  return <div className="min-h-44 rounded-[28px] bg-white/90 p-5 text-forest-deep shadow-xl">{children}</div>
}

export default MergedShape
