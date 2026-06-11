import GlassCard from '@/components/ui/GlassCard'

function RiskSummary() {
  return (
    <GlassCard title="风险分析摘要">
      <ul className="space-y-2">
        <li>状态：体征处于稳定范围</li>
        <li>关注点：久坐与腰围变化</li>
        <li>建议：每周记录 2-3 次体征，观察趋势而不是单日波动</li>
      </ul>
    </GlassCard>
  )
}

export default RiskSummary
