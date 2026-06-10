import { NavLink } from 'react-router-dom'
import { DETAIL_ROUTES } from '@/config/routes'

function GooeyNav() {
  return (
    <nav className="fixed bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-pill border border-white/14 bg-white/10 px-4 py-3 text-sm text-white shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      {DETAIL_ROUTES.map((route) => (
        <NavLink
          className={({ isActive }) =>
            `rounded-pill px-4 py-2 transition ${isActive ? 'bg-white text-forest-deep shadow-[0_10px_24px_rgba(255,255,255,0.16)]' : 'text-white/65 hover:bg-white/10 hover:text-white'}`
          }
          key={route.path}
          to={route.path}
        >
          {route.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default GooeyNav
