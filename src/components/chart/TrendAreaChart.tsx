const POINTS = [42, 62, 54, 78, 70, 84, 82]

function TrendAreaChart() {
  return (
    <div className="relative h-44 overflow-hidden rounded-glass border border-white/12 bg-black/14 p-4">
      <div className="absolute inset-x-4 bottom-4 top-4 flex items-end gap-3">
        {POINTS.map((point, index) => (
          <div className="flex flex-1 flex-col items-center gap-2" key={`${point}-${index}`}>
            <div
              className="w-full rounded-t-glass bg-gradient-to-t from-dimension-exercise/22 to-dimension-exercise/75"
              style={{ height: `${point}%` }}
            />
            <span className="text-[10px] text-white/36">{index + 1}</span>
          </div>
        ))}
      </div>
      <p className="absolute left-4 top-3 text-xs text-white/45">mock trend</p>
    </div>
  )
}

export default TrendAreaChart
