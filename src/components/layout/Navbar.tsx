import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import SlimTag from '@/components/ui/SlimTag'

function Navbar() {
  return (
    <nav className="glass-edge fixed left-8 right-8 top-6 z-10 flex h-14 items-center justify-between rounded-pill border border-white/14 bg-white/10 px-6 text-white shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <Link className="text-sm font-semibold tracking-wide" to={ROUTES.HOME}>小心肝</Link>
      <div className="flex items-center gap-2">
        <Link to={ROUTES.SLEEP}><SlimTag label="作息" /></Link>
        <Link to={ROUTES.DIET}><SlimTag label="饮食" /></Link>
        <Link to={ROUTES.EXERCISE}><SlimTag label="运动" /></Link>
        <Link to={ROUTES.STRESS}><SlimTag label="压力" /></Link>
        <Link to={ROUTES.RISK}><SlimTag label="风险" /></Link>
      </div>
      <Link className="rounded-pill border border-white/18 px-3 py-1 text-xs text-white/72 transition hover:bg-white/10 hover:text-white" to={ROUTES.PROFILE}>
        个人主页
      </Link>
    </nav>
  )
}

export default Navbar
