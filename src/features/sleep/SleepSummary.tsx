import GlassCard from '@/components/ui/GlassCard'
import type { BehaviorInsight, SleepRecord } from '@/types/health'

interface SleepSummaryProps {
  record?: SleepRecord | null
  advice?: string
  behaviorTags?: BehaviorInsight[]
}

function SleepSummary({ record, advice, behaviorTags = [] }: SleepSummaryProps) {
  if (!record) {
    return (
      <GlassCard title="分析摘要">
        <p className="text-sm leading-7 text-white/68">暂无作息记录。完成一次今日录入后，这里会显示真实评分、行为标签和 AI 建议。</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard title="分析摘要">
      <ul className="space-y-2">
        <li>入睡时间：{record.sleep_time}</li>
        <li>起床时间：{record.wake_time}</li>
        <li>睡眠质量：{record.sleep_quality} 星，中断 {record.interruption_count} 次</li>
        <li>建议：{advice ?? '录入后生成个性化建议。'}</li>
      </ul>
      {behaviorTags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {behaviorTags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-pill border border-dimension-sleep/30 bg-dimension-sleep/14 px-3 py-1 text-xs text-dimension-sleep"
            >
              {tag.label}
            </span>
          ))}
        </div>
      ) : null}
    </GlassCard>
  )
}

export default SleepSummary
