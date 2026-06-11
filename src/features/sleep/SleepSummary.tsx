import GlassCard from '@/components/ui/GlassCard'

function SleepSummary() {
  return (
    <GlassCard title="分析摘要">
      <ul className="space-y-2">
        <li>今日睡眠：8.5 小时，节律稳定</li>
        <li>睡眠质量：4 星，中断 1 次</li>
        <li>建议：23:00 前进入放松状态，保持固定起床时间</li>
      </ul>
    </GlassCard>
  )
}

export default SleepSummary
