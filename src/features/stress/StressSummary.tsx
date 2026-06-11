import GlassCard from '@/components/ui/GlassCard'

function StressSummary() {
  return (
    <GlassCard title="压力摘要">
      <ul className="space-y-2">
        <li>压力等级：4/10，处于可控区间</li>
        <li>焦虑状态：3/10，较平稳</li>
        <li>情绪状态：平静</li>
      </ul>
    </GlassCard>
  )
}

export default StressSummary
