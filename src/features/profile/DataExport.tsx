import { useState } from 'react'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { mockHistoryItems } from '@/services/mock/health.mock'
import { mockUserProfile } from '@/services/mock/user.mock'

function DataExport() {
  const [message, setMessage] = useState<string | null>(null)

  function handleExport() {
    const header = ['nickname', 'age', 'gender', 'height_cm', 'weight_kg', 'timezone', 'record_date', 'dimension', 'score', 'summary']
    const rows = mockHistoryItems.map((item) => [
      mockUserProfile.nickname ?? '',
      mockUserProfile.age ?? '',
      mockUserProfile.gender ?? '',
      mockUserProfile.height_cm ?? '',
      mockUserProfile.weight_kg ?? '',
      mockUserProfile.timezone,
      item.record_date,
      item.dimension,
      item.score,
      item.summary,
    ])
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).split('"').join('""')}"`)
          .join(','),
      )
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = 'xinxiaogan-profile-export.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setMessage('CSV 已导出到本地下载。')
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-white/62">
        导出你最近的个人资料与健康记录摘要，当前阶段提供 CSV 结构验证，后续可替换真实下载流。
      </p>
      <div className="flex items-center justify-between rounded-glass border border-white/10 bg-white/6 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">CSV 快照</p>
          <p className="text-xs text-white/48">包含个人信息、维度分数、最近 5 条历史记录。</p>
        </div>
        <PillButton onClick={handleExport} variant="outline">
          导出 CSV
        </PillButton>
      </div>
      {message ? <Toast message={message} /> : null}
    </div>
  )
}

export default DataExport
