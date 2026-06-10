import { Link } from 'react-router-dom'
import MergedShape from '@/components/ui/MergedShape'
import { DETAIL_ROUTES } from '@/config/routes'

function DimensionCardStack() {
  return (
    <section className="grid max-w-5xl grid-cols-5 gap-4">
      {DETAIL_ROUTES.map((route) => (
        <Link key={route.path} to={route.path}>
          <MergedShape>
            <p className="text-sm text-forest-deep/60">健康维度</p>
            <h2 className="mt-2 text-2xl font-semibold">{route.label}</h2>
          </MergedShape>
        </Link>
      ))}
    </section>
  )
}

export default DimensionCardStack
