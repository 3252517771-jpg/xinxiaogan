import type { HealthDimension } from '@/config/routes'

type TrendDimension = HealthDimension | 'overall'

interface TrendAreaChartProps {
  dimension?: TrendDimension
}

function TrendAreaChart({ dimension = 'overall' }: TrendAreaChartProps) {
  const dimensionLabel: Record<TrendDimension, string> = {
    overall: '综合',
    sleep: '作息',
    diet: '饮食',
    exercise: '运动',
    stress: '压力',
    risk: '风险',
  }

  return (
    <div className="relative flex h-64 min-h-64 items-center justify-center overflow-hidden rounded-glass border border-white/20 bg-forest-deep/46 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div>
        <p className="text-sm font-semibold text-white">暂无{dimensionLabel[dimension]}趋势数据</p>
        <p className="mt-2 text-xs leading-6 text-white/52">完成真实记录后，趋势图再展示近 7 天变化。</p>
      </div>
    </div>
  )
}

export default TrendAreaChart
