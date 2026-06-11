import { useMemo, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import SlimTag from '@/components/ui/SlimTag'
import TrendAreaChart from '@/components/chart/TrendAreaChart'
import type { HealthDimension } from '@/config/routes'

function TrendSection() {
  const dimensions = useMemo(
    () => [
      { key: 'overall', label: '综合' },
      { key: 'sleep', label: '作息' },
      { key: 'diet', label: '饮食' },
      { key: 'exercise', label: '运动' },
      { key: 'stress', label: '压力' },
      { key: 'risk', label: '风险' },
    ],
    [],
  )
  const [active, setActive] = useState<string>('overall')

  return (
    <GlassCard className="border-glow mx-auto w-full max-w-5xl" eyebrow="trend" title="近 7 天综合趋势">
      <div className="mb-4 flex gap-2">
        {dimensions.map((dimension) => (
          <button key={dimension.key} onClick={() => setActive(dimension.key)} type="button">
            <SlimTag active={active === dimension.key} label={dimension.label} />
          </button>
        ))}
      </div>
      <TrendAreaChart dimension={active as HealthDimension | 'overall'} />
    </GlassCard>
  )
}

export default TrendSection
