import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HealthDimension } from '@/config/routes'
import { request } from '@/services/api'
import type { HealthTrendPoint, HealthTrendResponse } from '@/types/health'

type TrendDimension = HealthDimension | 'overall'

interface TrendAreaChartProps {
  dimension?: TrendDimension
}

const DIMENSION_LABELS: Record<TrendDimension, string> = {
  overall: '综合',
  sleep: '作息',
  diet: '饮食',
  exercise: '运动',
  stress: '压力',
  risk: '风险',
}

function TrendAreaChart({ dimension = 'overall' }: TrendAreaChartProps) {
  const [points, setPoints] = useState<HealthTrendPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasData = useMemo(() => points.some((point) => point[dimension] !== null), [dimension, points])

  useEffect(() => {
    let isMounted = true

    async function loadTrend() {
      setIsLoading(true)
      try {
        const response = await request<HealthTrendResponse>('/health/trend?days=7')
        if (isMounted) {
          setPoints(response.points)
          setError(null)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : '趋势数据加载失败')
          setPoints([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTrend()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="relative flex h-64 min-h-64 items-center justify-center overflow-hidden rounded-glass border border-white/20 bg-forest-deep/46 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <p className="text-sm font-semibold text-white/76">正在读取真实趋势数据...</p>
      </div>
    )
  }

  if (error || !hasData) {
    return (
      <div className="relative flex h-64 min-h-64 items-center justify-center overflow-hidden rounded-glass border border-white/20 bg-forest-deep/46 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div>
          <p className="text-sm font-semibold text-white">暂无{DIMENSION_LABELS[dimension]}趋势数据</p>
          <p className="mt-2 text-xs leading-6 text-white/52">{error ?? '完成真实记录后，趋势图再展示近 7 天变化。'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-64 min-h-64 overflow-hidden rounded-glass border border-white/20 bg-forest-deep/46 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={points} margin={{ bottom: 8, left: -18, right: 12, top: 12 }}>
          <defs>
            <linearGradient id={`trend-${dimension}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#A8FFB4" stopOpacity={0.52} />
              <stop offset="95%" stopColor="#A8FFB4" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="4 8" vertical={false} />
          <XAxis
            dataKey="date"
            minTickGap={18}
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.62)', fontSize: 11 }}
            tickFormatter={(value: string) => value.slice(5)}
          />
          <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.35)" tick={{ fill: 'rgba(255,255,255,0.56)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,28,21,0.92)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 8,
              color: 'white',
            }}
            formatter={(value) => [`${value} 分`, DIMENSION_LABELS[dimension]]}
            labelFormatter={(label) => `日期 ${label}`}
          />
          <Area
            connectNulls
            dataKey={dimension}
            fill={`url(#trend-${dimension})`}
            fillOpacity={1}
            isAnimationActive
            name={DIMENSION_LABELS[dimension]}
            stroke="#A8FFB4"
            strokeWidth={3}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendAreaChart
