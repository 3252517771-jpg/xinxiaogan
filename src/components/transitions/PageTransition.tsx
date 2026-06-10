import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

function PageTransition({ children }: PageTransitionProps) {
  return <main className="fade-in min-h-screen px-12 py-10">{children}</main>
}

export default PageTransition
