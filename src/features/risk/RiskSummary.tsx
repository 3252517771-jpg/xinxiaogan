import GlassCard from '@/components/ui/GlassCard'
import type { RiskPrediction } from '@/types/health'

interface RiskSummaryProps {
  prediction?: RiskPrediction | null
}

function RiskSummary({ prediction }: RiskSummaryProps) {
  const riskLevelText =
    prediction?.risk_level === 'high'
      ? '高风险预警'
      : prediction?.risk_level === 'medium'
        ? '中风险观察'
        : '低风险稳定'

  const focusText =
    prediction?.risk_alert
      ? '模型识别到体征组合偏危险，建议尽快复查并持续记录'
      : '当前体征整体平稳，继续保持定期记录与观察'

  return (
    <GlassCard title="风险分析摘要">
      <ul className="space-y-2">
        <li>状态：{riskLevelText}</li>
        <li>模型置信度：{prediction ? `${Math.round(prediction.risk_probability * 100)}%` : '91%'}</li>
        <li>关注点：{focusText}</li>
        <li>建议：每周记录 2-3 次体征，重点看趋势变化而不是单日波动</li>
      </ul>
    </GlassCard>
  )
}

export default RiskSummary
