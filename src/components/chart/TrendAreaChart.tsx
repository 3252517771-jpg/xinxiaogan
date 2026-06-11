import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HealthDimension } from '@/config/routes'

type TrendDimension = HealthDimension | 'overall'

interface TrendAreaChartProps {
  dimension?: TrendDimension
}

const TREND_POINTS: Record<TrendDimension, number[]> = {
  overall: [72, 74, 71, 78, 80, 81, 82],
  sleep: [76, 79, 74, 81, 82, 80, 83],
  diet: [68, 70, 72, 73, 75, 74, 76],
  exercise: [54, 58, 56, 61, 60, 57, 62],
  stress: [82, 84, 80, 83, 85, 84, 86],
  risk: [74, 75, 76, 78, 79, 78, 79],
}

function TrendAreaChart({ dimension = 'overall' }: TrendAreaChartProps) {
  const data = TREND_POINTS[dimension].map((score, index) => ({
    day: `D${index + 1}`,
    score,
  }))

  return (
    <div className="relative h-64 min-h-64 overflow-hidden rounded-glass border border-white/20 bg-forest-deep/46 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data} margin={{ bottom: 4, left: -20, right: 10, top: 12 }}>
          <defs>
            <linearGradient id="m4TrendGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#A8FFB4" stopOpacity={0.65} />
              <stop offset="100%" stopColor="#A8FFB4" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <XAxis axisLine={false} dataKey="day" tick={{ fill: 'rgba(255,255,255,0.42)', fontSize: 11 }} tickLine={false} />
          <YAxis axisLine={false} domain={[40, 100]} tick={{ fill: 'rgba(255,255,255,0.34)', fontSize: 11 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,28,21,0.92)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 8,
              color: '#fff',
            }}
          />
          <Area dataKey="score" fill="url(#m4TrendGradient)" stroke="#A8FFB4" strokeWidth={3} type="monotone" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendAreaChart
