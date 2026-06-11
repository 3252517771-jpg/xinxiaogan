import GlassCard from '@/components/ui/GlassCard'

interface StressAdviceProps {
  advice?: string
}

function StressAdvice({ advice }: StressAdviceProps) {
  return <GlassCard title="个性化建议">{advice ?? '暂无压力记录。完成一次压力自评后，这里会显示 AI 个性化建议。'}</GlassCard>
}

export default StressAdvice
