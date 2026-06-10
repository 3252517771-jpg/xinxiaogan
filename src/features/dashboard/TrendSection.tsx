import GlassCard from '@/components/ui/GlassCard'
import TrendAreaChart from '@/components/chart/TrendAreaChart'

function TrendSection() {
  return (
    <GlassCard title="近 7 天趋势">
      <TrendAreaChart />
    </GlassCard>
  )
}

export default TrendSection
