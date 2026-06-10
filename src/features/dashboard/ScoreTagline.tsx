import ScoreBadge from '@/components/ui/ScoreBadge'

interface ScoreTaglineProps {
  locked?: boolean
}

function ScoreTagline({ locked = false }: ScoreTaglineProps) {
  return (
    <section className="split-text-in max-w-2xl text-white drop-shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <div className="mb-5 flex items-center gap-3">
        <ScoreBadge label="综合" score={82} />
        <span className="text-xs uppercase tracking-[0.2em] text-white/50">Your health, the forest knows.</span>
      </div>
      <h1 className="text-6xl font-semibold leading-tight text-white">The forest knows your health.</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
        {locked ? '登录后，小心肝会展开五个健康维度、近 7 天趋势和详情页入口。' : '小心肝把作息、饮食、运动、压力和风险装进同一片森林，今天的综合状态正在稳定发光。'}
      </p>
    </section>
  )
}

export default ScoreTagline
