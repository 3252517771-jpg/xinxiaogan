import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

interface PageHeaderProps {
  title: string
  score?: number
}

function PageHeader({ title, score }: PageHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between pt-20 text-white">
      <div>
        <p className="text-sm text-white/60">XiaoXinGan</p>
        <h1 className="text-4xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {score ? <span className="text-2xl font-semibold">{score}</span> : null}
        <Link className="rounded-pill border border-white/25 px-4 py-2 text-sm" to={ROUTES.HOME}>返回首页</Link>
      </div>
    </header>
  )
}

export default PageHeader
