import { useMemo, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import PillButton from '@/components/ui/PillButton'
import type { HealthDimension, HistoryItem } from '@/services/mock/health.mock'
import { mockHistoryItems } from '@/services/mock/health.mock'

const FILTERS: Array<{ key: HealthDimension | 'all'; label: string; icon: string }> = [
  { key: 'all', label: '全部', icon: '◎' },
  { key: 'sleep', label: '作息', icon: '💤' },
  { key: 'diet', label: '饮食', icon: '🍎' },
  { key: 'exercise', label: '运动', icon: '💪' },
  { key: 'stress', label: '压力', icon: '💭' },
  { key: 'risk', label: '风险', icon: '❤' },
]

function HistoryRow({ item }: { item: HistoryItem }) {
  return (
    <div className="grid grid-cols-[116px_88px_80px_1fr_80px] items-center gap-3 rounded-glass border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78">
      <span className="text-white/52">{item.record_date}</span>
      <span className="font-semibold text-white">{item.title}</span>
      <span className="text-dimension-exercise">{item.score}分</span>
      <span className="truncate text-white/58">{item.summary}</span>
      <button className="text-right text-xs font-semibold text-white/60 transition hover:text-white" type="button">
        查看
      </button>
    </div>
  )
}

function HistoryList() {
  const [activeFilter, setActiveFilter] = useState<HealthDimension | 'all'>('all')
  const [visibleCount, setVisibleCount] = useState(3)

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return mockHistoryItems
    }

    return mockHistoryItems.filter((item) => item.dimension === activeFilter)
  }, [activeFilter])

  const visibleItems = filteredItems.slice(0, visibleCount)

  return (
    <GlassCard title="历史健康记录">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = filter.key === activeFilter
            return (
              <button
                className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'border-dimension-exercise/45 bg-dimension-exercise/18 text-white'
                    : 'border-white/12 bg-white/6 text-white/58 hover:border-white/24 hover:text-white'
                }`}
                key={filter.key}
                onClick={() => {
                  setActiveFilter(filter.key)
                  setVisibleCount(3)
                }}
                type="button"
              >
                <span className="mr-1.5">{filter.icon}</span>
                {filter.label}
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          {visibleItems.map((item) => (
            <HistoryRow item={item} key={item.id} />
          ))}
        </div>

        <div className="flex items-center justify-between rounded-glass border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs text-white/50">
            当前显示 {visibleItems.length} / {filteredItems.length} 条
          </p>
          <PillButton
            disabled={visibleCount >= filteredItems.length}
            onClick={() => setVisibleCount((count) => Math.min(count + 2, filteredItems.length))}
            variant="outline"
          >
            查看更多
          </PillButton>
        </div>
      </div>
    </GlassCard>
  )
}

export default HistoryList
