import { useEffect, useState } from 'react'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { request } from '@/services/api'
import type { HealthHistoryItem, HealthHistoryResponse } from '@/types/health'

function escapeCsvCell(value: string | number): string {
  return `"${String(value).split('"').join('""')}"`
}

function DataExport() {
  const [items, setItems] = useState<HealthHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      setIsLoading(true)
      try {
        const response = await request<HealthHistoryResponse>('/health/history')
        if (isMounted) {
          setItems(response.items)
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error instanceof Error ? error.message : '历史记录加载失败')
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

  function handleExport() {
    const header = ['record_date', 'dimension', 'title', 'score', 'summary']
    const rows = items.map((item) => [item.record_date, item.dimension, item.title, item.score, item.summary])
    const csv = [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = 'xinxiaogan-health-history.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setMessage(`已导出 ${items.length} 条真实记录。`)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-white/62">
        导出当前账号的真实历史记录，不再生成模板 CSV。
      </p>
      <div className="flex items-center justify-between rounded-glass border border-white/10 bg-white/6 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">CSV 快照</p>
          <p className="text-xs text-white/48">{isLoading ? '正在读取历史记录...' : items.length ? `可导出 ${items.length} 条真实记录。` : '暂无可导出的真实历史记录。'}</p>
        </div>
        <PillButton disabled={isLoading || items.length === 0} onClick={handleExport} variant="outline">
          导出 CSV
        </PillButton>
      </div>
      {message ? <Toast message={message} tone={items.length ? 'success' : 'info'} /> : null}
    </div>
  )
}

export default DataExport
