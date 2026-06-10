import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import ScoreBadge from '@/components/ui/ScoreBadge'

interface PageHeaderProps {
  title: string
  score?: number
}

function PageHeader({ title, score }: PageHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between pt-20 text-white">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">XiaoXinGan</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {score ? <ScoreBadge label="今日" score={score} /> : null}
        <Link className="rounded-pill border border-white/25 px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 hover:text-white" to={ROUTES.HOME}>
          返回首页
        </Link>
      </div>
    </header>
  )
}

export default PageHeader
