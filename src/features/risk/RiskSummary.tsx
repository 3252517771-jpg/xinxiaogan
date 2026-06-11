import GlassCard from '@/components/ui/GlassCard'
import type { BehaviorInsight, RiskPrediction } from '@/types/health'

interface RiskSummaryProps {
  prediction?: RiskPrediction | null
  advice?: string
  behaviorTags?: BehaviorInsight[]
}

function RiskSummary({ prediction, advice, behaviorTags = [] }: RiskSummaryProps) {
  if (!prediction) {
    return (
      <GlassCard title="风险分析摘要">
        <p className="text-sm leading-7 text-white/68">暂无体征记录。提交真实体征数据后，这里会显示风险等级、模型置信度和 AI 建议。</p>
      </GlassCard>
    )
  }

  const riskLevelText =
    prediction?.risk_level === 'high'
      ? '高风险预警'
      : prediction?.risk_level === 'medium'
        ? '中风险观察'
        : '低风险稳定'

  const focusText =
    prediction?.risk_alert
      ? '模型识别到体征组合偏危险，建议尽快复查并持续记录。'
      : '当前体征整体平稳，继续保持定期记录与观察。'

  return (
    <GlassCard title="风险分析摘要">
      <ul className="space-y-2">
        <li>状态：{riskLevelText}</li>
        <li>模型置信度：{prediction.risk_probability > 0 ? `${Math.round(prediction.risk_probability * 100)}%` : '重新提交后生成'}</li>
        <li>关注点：{focusText}</li>
        <li>建议：{advice ?? '录入后生成个性化建议。'}</li>
      </ul>
      {behaviorTags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {behaviorTags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-pill border border-dimension-risk/30 bg-dimension-risk/14 px-3 py-1 text-xs text-dimension-risk"
            >
              {tag.label}
            </span>
          ))}
        </div>
      ) : null}
    </GlassCard>
  )
}

export default RiskSummary
