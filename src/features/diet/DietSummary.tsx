import GlassCard from '@/components/ui/GlassCard'
import type { BehaviorInsight, DietRecord } from '@/types/health'

interface DietSummaryProps {
  record?: DietRecord | null
  advice?: string
  behaviorTags?: BehaviorInsight[]
}

const MEAL_TYPE_LABELS: Record<DietRecord['meal_type'], string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
}

function DietSummary({ record, advice, behaviorTags = [] }: DietSummaryProps) {
  if (!record) {
    return (
      <GlassCard title="营养分析摘要">
        <p className="text-sm leading-7 text-white/68">暂无饮食记录。录入真实餐次后，系统会基于本次提交生成营养摘要和 AI 建议。</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard title="营养分析摘要">
      <dl className="space-y-3">
        <div className="flex items-center justify-between">
          <dt>餐次</dt>
          <dd>{MEAL_TYPE_LABELS[record.meal_type]}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>食物</dt>
          <dd className="max-w-[13rem] truncate text-right">{record.food_description}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>热量</dt>
          <dd>{record.calories} kcal</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>评分</dt>
          <dd>{record.score}</dd>
        </div>
        <p className="pt-2 text-white/68">{advice ?? '录入后生成个性化建议。'}</p>
      </dl>
      {behaviorTags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {behaviorTags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-pill border border-dimension-diet/30 bg-dimension-diet/14 px-3 py-1 text-xs text-dimension-diet"
            >
              {tag.label}
            </span>
          ))}
        </div>
      ) : null}
    </GlassCard>
  )
}

export default DietSummary
