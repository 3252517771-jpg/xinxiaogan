import { useEffect, useState } from 'react'
import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import PageHeader from '@/components/layout/PageHeader'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import TiltedPanel from '@/components/layout/TiltedPanel'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import DietForm from '@/features/diet/DietForm'
import DietSummary from '@/features/diet/DietSummary'
import DietTip from '@/features/diet/DietTip'
import { useVideoState } from '@/hooks/useVideoState'
import { request } from '@/services/api'
import type { BehaviorInsight, DietRecord, LatestHealthResponse } from '@/types/health'

function DietPage() {
  const [score, setScore] = useState<number | null>(null)
  const [record, setRecord] = useState<DietRecord | null>(null)
  const [advice, setAdvice] = useState<string | undefined>()
  const [behaviorTags, setBehaviorTags] = useState<BehaviorInsight[]>([])
  const { scene, triggerFeedback, handleVideoEnded } = useVideoState('diet', score ?? 80)

  useEffect(() => {
    let isMounted = true

    async function loadLatest() {
      const response = await request<LatestHealthResponse>('/health/latest')
      if (isMounted && response.diet) {
        setRecord(response.diet)
        setScore(response.diet.score)
      }
    }

    void loadLatest().catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <BackgroundLayer image="图二.png" onSceneEnded={handleVideoEnded} scene={scene} />
      <PageTransition>
        <PageHeader score={score} title="饮食分析" />
        <ThreeColumnLayout
          centerLabel="龙猫全屏背景留白"
          left={
            <>
              <TiltedPanel caption="每日饮食推荐" minHeight="136px">
                <DietTip />
              </TiltedPanel>
              <TiltedPanel caption="饮食录入" minHeight="440px">
                <GlassCard title="饮食录入">
                  <DietForm
                    onSubmitted={(response) => {
                      setScore(response.score)
                      setRecord(response.record)
                      setAdvice(response.ai_advice)
                      setBehaviorTags(response.behavior_tags)
                      triggerFeedback()
                    }}
                  />
                </GlassCard>
              </TiltedPanel>
            </>
          }
          right={
            <TiltedPanel caption="营养分析摘要" minHeight="260px">
              <DietSummary advice={advice} behaviorTags={behaviorTags} record={record} />
            </TiltedPanel>
          }
        />
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default DietPage
