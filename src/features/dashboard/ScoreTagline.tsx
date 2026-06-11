interface ScoreTaglineProps {
  locked?: boolean
}

function ScoreTagline({ locked = false }: ScoreTaglineProps) {
  const titleLines = [
    ['The', 'forest'],
    ['knows', 'your'],
    ['health.'],
  ]
  let wordIndex = 0

  return (
    <section className="max-w-[980px] text-left text-white drop-shadow-[0_18px_42px_rgba(0,0,0,0.5)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="split-text-word text-xs uppercase tracking-[0.34em] text-white/58">Your health, the forest knows.</span>
      </div>
      <h1 className="font-['Georgia','Cambria','Times_New_Roman',serif] text-[clamp(76px,7.4vw,142px)] font-black leading-[0.88] text-white">
        {titleLines.map((line) => (
          <span className="block overflow-hidden py-1" key={line.join('-')}>
            {line.map((word) => {
              wordIndex += 1
              return (
                <span className="split-text-word inline-block pr-[0.22em]" key={word} style={{ animationDelay: `${wordIndex * 80}ms` }}>
                  {word}
                </span>
              )
            })}
          </span>
        ))}
      </h1>
      <p className="split-text-word mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/84" style={{ animationDelay: '560ms' }}>
        {locked ? '登录后，小心肝会展开五个健康维度、近 7 天趋势和详情页入口。' : '新账号不会使用模板健康档案。先补充资料并完成一次真实记录，小心肝再开始生成你的状态。'}
      </p>
    </section>
  )
}

export default ScoreTagline
