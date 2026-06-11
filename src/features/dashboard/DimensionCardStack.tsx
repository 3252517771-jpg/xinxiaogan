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

const DIMENSION_STATUS: Record<HealthDimension, { status: string; score: number; description: string }> = {
  sleep: { status: '优秀', score: 83, description: '入睡节律稳定，今晚继续守住 23:00 前。' },
  diet: { status: '一般', score: 74, description: '三餐完整度不错，晚餐可以更轻一点。' },
  exercise: { status: '偏低', score: 58, description: '久坐时间偏长，适合补一段轻运动。' },
  stress: { status: '优秀', score: 86, description: '情绪曲线平稳，保持当下的节奏。' },
  risk: { status: '良好', score: 79, description: '体征整体可控，继续关注睡眠和运动。' },
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
                    <span className="rounded-pill bg-forest-deep/8 px-2 py-1 text-xs font-semibold">{detail.score}</span>
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
