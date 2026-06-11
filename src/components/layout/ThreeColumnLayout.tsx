import type { ReactNode } from 'react'

interface ThreeColumnLayoutProps {
  left: ReactNode
  right: ReactNode
  centerLabel?: string
}

function ThreeColumnLayout({ left, right, centerLabel = 'IP 场景留白' }: ThreeColumnLayoutProps) {
  return (
    <main className="min-h-[calc(100vh-210px)] pb-28" data-layout="three-column-detail">
      <div className="grid min-h-[620px] grid-cols-[minmax(280px,1fr)_minmax(560px,2fr)_minmax(280px,1fr)] gap-6">
        <section className="space-y-5" data-layout-zone="left-tools">
          {left}
        </section>
        <section
          aria-label={centerLabel}
          className="relative min-h-[620px]"
          data-layout-zone="ip-scene-space"
        />
        <section className="space-y-5" data-layout-zone="right-insight">
          {right}
        </section>
      </div>
    </main>
  )
}

export default ThreeColumnLayout
