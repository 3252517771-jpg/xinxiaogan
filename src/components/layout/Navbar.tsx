import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

function Navbar() {
  return (
    <nav className="fixed left-8 right-8 top-6 z-10 flex items-center justify-between rounded-pill bg-white/12 px-6 py-3 text-white backdrop-blur">
      <Link className="font-semibold" to={ROUTES.HOME}>小心肝</Link>
      <div className="flex gap-4 text-sm">
        <Link to={ROUTES.SLEEP}>作息</Link>
        <Link to={ROUTES.DIET}>饮食</Link>
        <Link to={ROUTES.EXERCISE}>运动</Link>
        <Link to={ROUTES.STRESS}>压力</Link>
        <Link to={ROUTES.RISK}>风险</Link>
        <Link to={ROUTES.PROFILE}>个人主页</Link>
      </div>
    </nav>
  )
}

export default Navbar
