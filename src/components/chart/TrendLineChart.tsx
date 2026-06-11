interface TrendLineChartProps {
  label?: string
}

function TrendLineChart({ label = '近 7 天评分趋势' }: TrendLineChartProps) {
  return (
    <div className="relative h-40 overflow-hidden rounded-glass border border-white/12 bg-black/14 p-4">
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 320 120">
        <path d="M8 92 C54 72 72 78 112 52 S182 30 224 44 278 74 312 38" fill="none" stroke="rgba(168,255,180,0.82)" strokeLinecap="round" strokeWidth="4" />
        <path d="M8 92 C54 72 72 78 112 52 S182 30 224 44 278 74 312 38 L312 120 L8 120 Z" fill="rgba(168,255,180,0.12)" />
      </svg>
      <p className="absolute left-4 top-3 text-xs text-white/45">{label}</p>
    </div>
  )
}

export default TrendLineChart
