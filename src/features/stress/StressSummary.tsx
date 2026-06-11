import GlassCard from '@/components/ui/GlassCard'
import type { StressRecord } from '@/types/health'

interface StressSummaryProps {
  record?: StressRecord | null
}

function StressSummary({ record }: StressSummaryProps) {
  if (!record) {
    return (
      <GlassCard title="压力摘要">
        <p className="text-sm leading-7 text-white/68">暂无压力记录。完成一次压力自评后，这里会显示真实记录摘要。</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard title="压力摘要">
      <ul className="space-y-2">
        <li>压力等级：{record.stress_level}/10</li>
        <li>焦虑状态：{record.anxiety_level}/10</li>
        <li>情绪状态：{record.emotion_tag}</li>
      </ul>
    </GlassCard>
  )
}

export default StressSummary
