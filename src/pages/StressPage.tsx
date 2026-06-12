import { useEffect, useState } from 'react'
import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import PageHeader from '@/components/layout/PageHeader'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import TiltedPanel from '@/components/layout/TiltedPanel'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import StressAdvice from '@/features/stress/StressAdvice'
import StressForm from '@/features/stress/StressForm'
import StressSummary from '@/features/stress/StressSummary'
import StressTrend from '@/features/stress/StressTrend'
import { useVideoState } from '@/hooks/useVideoState'
import { request } from '@/services/api'
import type { LatestHealthResponse, StressRecord } from '@/types/health'

function StressPage() {
  const [score, setScore] = useState<number | null>(null)
  const [record, setRecord] = useState<StressRecord | null>(null)
  const [advice, setAdvice] = useState<string | undefined>()
  const { scene, triggerFeedback, handleVideoEnded } = useVideoState('stress', score ?? 80)

  useEffect(() => {
    let isMounted = true

    async function loadLatest() {
      const response = await request<LatestHealthResponse>('/health/latest')
      if (isMounted && response.stress) {
        setRecord(response.stress)
        setScore(response.stress.score)
      }
    }

    void loadLatest().catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <BackgroundLayer image="图四.png" onSceneEnded={handleVideoEnded} scene={scene} />
      <PageTransition>
        <PageHeader score={score} title="压力分析" />
        <ThreeColumnLayout
          centerLabel="无脚鸟全屏背景留白"
          left={
            <>
              <TiltedPanel caption="压力自评录入" minHeight="390px">
                <GlassCard title="压力自评录入">
                  <StressForm
                    onSubmitted={(response) => {
                      setScore(response.score)
                      setRecord(response.record)
                      setAdvice(response.ai_advice)
                      triggerFeedback()
                    }}
                  />
                </GlassCard>
              </TiltedPanel>
              <TiltedPanel caption="压力摘要" minHeight="180px">
                <StressSummary record={record} />
              </TiltedPanel>
            </>
          }
          right={
            <>
              <TiltedPanel caption="个性化建议" minHeight="170px">
                <StressAdvice advice={advice} />
              </TiltedPanel>
              <TiltedPanel caption="压力趋势" minHeight="180px">
                <StressTrend />
              </TiltedPanel>
            </>
          }
        />
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default StressPage
