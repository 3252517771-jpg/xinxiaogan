import GlassCard from '@/components/ui/GlassCard'
import type { BehaviorInsight, ExerciseRecord } from '@/types/health'

interface ExerciseSummaryProps {
  record?: ExerciseRecord | null
  advice?: string
  behaviorTags?: BehaviorInsight[]
}

const EXERCISE_TYPE_LABELS: Record<ExerciseRecord['exercise_type'], string> = {
  running: '跑步',
  walking: '步行',
  cycling: '骑行',
  fitness: '健身',
  ball: '球类',
  other: '其他',
}

const INTENSITY_LABELS: Record<ExerciseRecord['intensity'], string> = {
  low: '低',
  medium: '中',
  high: '高',
}

function ExerciseSummary({ record, advice, behaviorTags = [] }: ExerciseSummaryProps) {
  if (!record) {
    return (
      <GlassCard title="分析摘要">
        <p className="text-sm leading-7 text-white/68">暂无运动记录。提交一次真实运动数据后，这里会显示本次评分、活动摘要和 AI 建议。</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard title="分析摘要">
      <ul className="space-y-2">
        <li>运动类型：{EXERCISE_TYPE_LABELS[record.exercise_type]}</li>
        <li>运动时长：{record.duration_min} 分钟，强度 {INTENSITY_LABELS[record.intensity]}</li>
        <li>步数：{record.steps ?? '未填写'}</li>
        <li>建议：{advice ?? '录入后生成个性化建议。'}</li>
      </ul>
      {behaviorTags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {behaviorTags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-pill border border-dimension-exercise/30 bg-dimension-exercise/14 px-3 py-1 text-xs text-dimension-exercise"
            >
              {tag.label}
            </span>
          ))}
        </div>
      ) : null}
    </GlassCard>
  )
}

export default ExerciseSummary
