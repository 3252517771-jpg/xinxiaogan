import { createContext, createElement, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface PendingTransition {
  video: string
  targetPath: string
}

interface TransitionState {
  pendingTransition: PendingTransition | null
  queueTransition: (transition: PendingTransition) => void
  clearTransition: () => void
}

const TransitionContext = createContext<TransitionState | null>(null)

interface TransitionProviderProps {
  children: ReactNode
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const [pendingTransition, setPendingTransition] = useState<PendingTransition | null>(null)

  const value = useMemo<TransitionState>(
    () => ({
      pendingTransition,
      queueTransition: setPendingTransition,
      clearTransition: () => setPendingTransition(null),
    }),
    [pendingTransition],
  )

  return createElement(TransitionContext.Provider, { value }, children)
}

export function useTransitionStore() {
  const context = useContext(TransitionContext)

  if (!context) {
    throw new Error('useTransitionStore must be used inside TransitionProvider')
  }

  return context
}
