import { NavLink } from 'react-router-dom'
import { DETAIL_ROUTES } from '@/config/routes'

function GooeyNav() {
  return (
    <nav className="fixed bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3 rounded-pill bg-white/12 px-5 py-3 text-sm text-white backdrop-blur">
      {DETAIL_ROUTES.map((route) => (
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold text-white' : 'text-white/65')} key={route.path} to={route.path}>
          {route.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default GooeyNav
