import MergedShape from '@/components/ui/MergedShape'
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack'
import { IP_CHARACTERS } from '@/config/constants'
import { DETAIL_ROUTES } from '@/config/routes'
import type { HealthDimension } from '@/config/routes'
import { useTransitionStore } from '@/store/transitionStore'

const DIMENSION_ACCENTS: Record<HealthDimension, string> = {
  sleep: '#A8D8FF',
  diet: '#FFD4A8',
  exercise: '#A8FFB4',
  stress: '#FFB8D4',
  risk: '#FFE8A8',
}

const DIMENSION_STATUS: Record<HealthDimension, { status: string; description: string }> = {
  sleep: { status: '待录入', description: '还没有作息记录，进入详情页记录今天的睡眠。' },
  diet: { status: '待录入', description: '还没有饮食记录，先从一次真实餐次开始。' },
  exercise: { status: '待录入', description: '还没有运动记录，提交后再生成运动建议。' },
  stress: { status: '待录入', description: '还没有压力自评，完成后会生成陪伴建议。' },
  risk: { status: '待录入', description: '还没有体征记录，提交后再运行风险预测。' },
}

function DimensionCardStack() {
  const { queueTransition } = useTransitionStore()
  const fallbackTransitionVideo = IP_CHARACTERS.sleep?.transitionVideo ?? 'T-01.mp4'

  return (
    <section aria-label="ScrollStack 健康维度卡片" className="flex justify-center">
      <ScrollStack
        baseScale={0.82}
        blurAmount={0.4}
        className="home-scroll-stack"
        itemDistance={92}
        itemScale={0.035}
        itemStackDistance={28}
        rotationAmount={0.2}
        scaleEndPosition="8%"
        stackPosition="18%"
      >
        {DETAIL_ROUTES.map((route, index) => {
          const dimension: HealthDimension = route.dimension ?? 'exercise'
          const detail = DIMENSION_STATUS[dimension]
          const transitionVideo = IP_CHARACTERS[dimension]?.transitionVideo ?? fallbackTransitionVideo

          return (
            <ScrollStackItem key={route.path}>
              <button
                aria-label={`进入${route.label}详情页`}
                className="dashboard-card-entry block text-left"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    queueTransition({ video: transitionVideo, targetPath: route.path })
                  }
                }}
                onClick={() => {
                  queueTransition({ video: transitionVideo, targetPath: route.path })
                }}
                style={{ animationDelay: `${index * 90}ms` }}
                type="button"
              >
                <MergedShape accent={DIMENSION_ACCENTS[dimension]} label="健康维度">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold">{route.label}</h2>
                    <span className="rounded-pill bg-forest-deep/8 px-2 py-1 text-xs font-semibold">--</span>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DIMENSION_ACCENTS[dimension] }} />
                    <span>{detail.status}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-forest-deep/68">{detail.description}</p>
                  <p className="mt-5 text-xs font-semibold uppercase text-forest-deep/42">点击进入详情</p>
                </MergedShape>
              </button>
            </ScrollStackItem>
          )
        })}
      </ScrollStack>
    </section>
  )
}

export default DimensionCardStack
