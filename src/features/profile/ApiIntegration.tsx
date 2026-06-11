import GlassCard from '@/components/ui/GlassCard'

function ApiIntegration() {
  return (
    <GlassCard title="API 接入预留">
      <div className="space-y-3">
        <div className="rounded-glass border border-white/10 bg-white/6 px-4 py-3">
          <p className="text-sm font-semibold text-white">智能手表 / 手环</p>
          <p className="mt-1 text-xs text-white/52">开发中，第一期保留入口与字段映射位置。</p>
        </div>
        <div className="rounded-glass border border-white/10 bg-white/6 px-4 py-3">
          <p className="text-sm font-semibold text-white">第三方健康 API</p>
          <p className="mt-1 text-xs text-white/52">规划中，后续对接真实数据时复用统一请求层。</p>
        </div>
      </div>
    </GlassCard>
  )
}

export default ApiIntegration
