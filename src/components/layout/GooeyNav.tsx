import { useLocation, useNavigate } from 'react-router-dom'
import Dock from '@/components/react-bits/Dock'
import { DETAIL_ROUTES, type HealthDimension } from '@/config/routes'

const DETAIL_LABELS: Record<HealthDimension, string> = {
  sleep: '作息',
  diet: '饮食',
  exercise: '运动',
  stress: '压力',
  risk: '风险',
}

const DETAIL_ICONS: Record<HealthDimension, string> = {
  sleep: '息',
  diet: '食',
  exercise: '动',
  stress: '压',
  risk: '险',
}

function GooeyNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const items = DETAIL_ROUTES.map((route) => {
    const isActive = route.path === location.pathname
    const label = route.dimension ? DETAIL_LABELS[route.dimension] : route.label
    const icon = route.dimension ? DETAIL_ICONS[route.dimension] : label.slice(0, 1)

    return {
      className: isActive ? 'is-active' : '',
      icon: <span>{icon}</span>,
      label,
      onClick: () => {
        if (route.path === location.pathname) {
          return
        }

        navigate(route.path)
      },
    }
  })

  return (
    <div className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2">
      <Dock baseItemSize={48} dockHeight={120} items={items} magnification={66} panelHeight={64} />
    </div>
  )
}

export default GooeyNav
