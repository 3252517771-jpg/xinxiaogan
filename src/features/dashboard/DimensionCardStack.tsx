import { Link } from 'react-router-dom'
import MergedShape from '@/components/ui/MergedShape'
import { DETAIL_ROUTES } from '@/config/routes'

const DIMENSION_ACCENTS: Record<string, string> = {
  sleep: '#A8D8FF',
  diet: '#FFD4A8',
  exercise: '#A8FFB4',
  stress: '#FFB8D4',
  risk: '#FFE8A8',
}

function DimensionCardStack() {
  return (
    <section className="grid max-w-5xl grid-cols-5 gap-5">
      {DETAIL_ROUTES.map((route) => (
        <Link className="block" key={route.path} to={route.path}>
          <MergedShape accent={DIMENSION_ACCENTS[route.dimension ?? 'exercise']} label="健康维度">
            <h2 className="text-2xl font-semibold">{route.label}</h2>
            <p className="mt-5 text-sm leading-6 text-forest-deep/68">结构占位已就绪，后续接入表单、趋势和 IP 状态。</p>
          </MergedShape>
        </Link>
      ))}
    </section>
  )
}

export default DimensionCardStack
