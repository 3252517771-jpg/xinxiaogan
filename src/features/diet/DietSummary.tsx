import GlassCard from '@/components/ui/GlassCard'

function DietSummary() {
  return (
    <GlassCard title="营养分析摘要">
      <dl className="space-y-3">
        <div className="flex items-center justify-between">
          <dt>热量</dt>
          <dd>约 1680 kcal</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>蛋白质</dt>
          <dd>充足</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>碳水</dt>
          <dd>适中</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>脂肪</dt>
          <dd>略高</dd>
        </div>
        <p className="pt-2 text-white/68">评价：三餐结构基本完整，建议晚餐减少油脂摄入。</p>
      </dl>
    </GlassCard>
  )
}

export default DietSummary
