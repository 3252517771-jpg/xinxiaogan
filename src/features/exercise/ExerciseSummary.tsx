import GlassCard from '@/components/ui/GlassCard'

function ExerciseSummary() {
  return (
    <GlassCard title="分析摘要">
      <ul className="space-y-2">
        <li>今日运动量：35 分钟</li>
        <li>日推荐达标：已达标</li>
        <li>建议：保持中等强度，久坐时每小时起身活动 5 分钟</li>
      </ul>
    </GlassCard>
  )
}

export default ExerciseSummary
