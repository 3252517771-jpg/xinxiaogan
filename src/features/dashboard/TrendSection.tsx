import GlassCard from '@/components/ui/GlassCard'
import SlimTag from '@/components/ui/SlimTag'
import TrendAreaChart from '@/components/chart/TrendAreaChart'

function TrendSection() {
  return (
    <GlassCard eyebrow="trend" title="近 7 天趋势">
      <div className="mb-4 flex gap-2">
        <SlimTag active label="综合" />
        <SlimTag label="作息" />
        <SlimTag label="饮食" />
        <SlimTag label="运动" />
      </div>
      <TrendAreaChart />
    </GlassCard>
  )
}

export default TrendSection
