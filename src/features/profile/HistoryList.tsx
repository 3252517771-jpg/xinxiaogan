import { useEffect, useMemo, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import type { HealthDimension } from '@/config/routes'
import { request } from '@/services/api'
import type { HealthHistoryItem, HealthHistoryResponse } from '@/types/health'

const FILTERS: Array<{ key: HealthDimension | 'all'; label: string; icon: string }> = [
  { key: 'all', label: '全部', icon: '◎' },
  { key: 'sleep', label: '作息', icon: '💤' },
  { key: 'diet', label: '饮食', icon: '🍎' },
  { key: 'exercise', label: '运动', icon: '💪' },
  { key: 'stress', label: '压力', icon: '💭' },
  { key: 'risk', label: '风险', icon: '❤' },
]

function HistoryRow({ item }: { item: HealthHistoryItem }) {
  return (
    <div className="grid grid-cols-[116px_88px_80px_1fr] items-center gap-3 rounded-glass border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78">
      <span className="text-white/52">{item.record_date}</span>
      <span className="font-semibold text-white">{item.title}</span>
      <span className="text-dimension-exercise">{item.score}分</span>
      <span className="truncate text-white/58">{item.summary}</span>
    </div>
  )
}

function HistoryList() {
  const [activeFilter, setActiveFilter] = useState<HealthDimension | 'all'>('all')
  const [visibleCount, setVisibleCount] = useState(5)
  const [items, setItems] = useState<HealthHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await request<HealthHistoryResponse>('/health/history')
        if (isMounted) {
          setItems(response.items)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : '历史记录加载失败')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadHistory()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return items
    }

    return items.filter((item) => item.dimension === activeFilter)
  }, [activeFilter, items])

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
                  setVisibleCount(5)
                }}
                type="button"
              >
                <span className="mr-1.5">{filter.icon}</span>
                {filter.label}
              </button>
            )
          })}
        </div>

        {isLoading ? <Toast message="正在读取历史记录..." tone="info" /> : null}
        {error ? <Toast message={error} tone="info" /> : null}

        {!isLoading && !error && visibleItems.length === 0 ? (
          <div className="rounded-glass border border-white/10 bg-white/6 px-4 py-10 text-center">
            <p className="text-sm font-semibold text-white">暂无历史健康记录</p>
            <p className="mt-2 text-xs leading-6 text-white/52">新账号不会展示模板记录。完成详情页真实录入后，这里会展示当前账号的记录。</p>
          </div>
        ) : null}

        {visibleItems.length ? (
          <div className="space-y-3">
            {visibleItems.map((item) => (
              <HistoryRow item={item} key={item.id} />
            ))}
          </div>
        ) : null}

        {filteredItems.length ? (
          <div className="flex items-center justify-between rounded-glass border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs text-white/50">
              当前显示 {visibleItems.length} / {filteredItems.length} 条
            </p>
            <PillButton
              disabled={visibleCount >= filteredItems.length}
              onClick={() => setVisibleCount((count) => Math.min(count + 5, filteredItems.length))}
              variant="outline"
            >
              查看更多
            </PillButton>
          </div>
        ) : null}
      </div>
    </GlassCard>
  )
}

export default HistoryList
