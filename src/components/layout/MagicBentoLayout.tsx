import type { ReactNode } from 'react'
import MagicBento, { MagicBentoCard } from '@/components/react-bits/MagicBento'

interface MagicBentoLayoutProps {
  children: ReactNode
  align?: 'left' | 'right'
}

function MagicBentoLayout({ children, align = 'right' }: MagicBentoLayoutProps) {
  const panelPosition = align === 'right' ? 'col-start-2' : 'col-start-1'
  const gridTemplate =
    align === 'right'
      ? 'grid-cols-[1fr_minmax(440px,520px)]'
      : 'grid-cols-[minmax(440px,520px)_1fr]'

  return (
    <main className="min-h-[calc(100vh-210px)] pb-28" data-layout="magic-bento-detail">
      <div className={`grid min-h-[620px] ${gridTemplate} gap-6`}>
        <MagicBento
          className={panelPosition}
          enableSpotlight
          glowColor="168, 255, 180"
          particleCount={10}
          spotlightRadius={280}
        >
          <MagicBentoCard className="space-y-5 rounded-[28px] border border-white/18 bg-[#1F2A1D]/68 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28),0_0_42px_rgba(168,255,180,0.12)] backdrop-blur-md">
            {children}
          </MagicBentoCard>
        </MagicBento>
      </div>
    </main>
  )
}

export default MagicBentoLayout
