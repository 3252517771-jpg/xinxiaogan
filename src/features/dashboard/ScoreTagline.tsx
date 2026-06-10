import ScoreBadge from '@/components/ui/ScoreBadge'

function ScoreTagline() {
  return (
    <section className="max-w-2xl text-white">
      <div className="mb-5 flex items-center gap-3">
        <ScoreBadge label="综合" score={82} />
        <span className="text-xs uppercase tracking-[0.2em] text-white/50">Your health, the forest knows.</span>
      </div>
      <h1 className="text-6xl font-semibold leading-tight">The forest knows your health.</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-white/66">小心肝把作息、饮食、运动、压力和风险装进同一片森林，M3 阶段先让基础界面拥有统一质感。</p>
    </section>
  )
}

export default ScoreTagline
