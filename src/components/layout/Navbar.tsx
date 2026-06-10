import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import SlimTag from '@/components/ui/SlimTag'
import ScoreBadge from '@/components/ui/ScoreBadge'

interface NavbarProps {
  locked?: boolean
  onLoginClick?: () => void
}

function Navbar({ locked = false, onLoginClick }: NavbarProps) {
  return (
    <nav className="glass-edge fixed left-8 right-8 top-6 z-10 flex h-14 items-center justify-between rounded-pill border border-white/14 bg-white/10 px-6 text-white shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <Link className="text-sm font-semibold tracking-wide" to={ROUTES.HOME}>小心肝</Link>
      <div className="flex items-center gap-2">
        {locked ? (
          <SlimTag active label="早上好，先登录" />
        ) : (
          <>
            <SlimTag active label="早上好" />
            <ScoreBadge label="综合" score={82} />
          </>
        )}
      </div>
      {locked ? (
        <button
          className="rounded-pill border border-white/18 px-3 py-1 text-xs text-white/72 transition hover:bg-white/10 hover:text-white"
          onClick={onLoginClick}
          type="button"
        >
          登录
        </button>
      ) : (
        <Link className="rounded-pill border border-white/18 px-3 py-1 text-xs text-white/72 transition hover:bg-white/10 hover:text-white" to={ROUTES.PROFILE}>
          个人主页
        </Link>
      )}
    </nav>
  )
}

export default Navbar
