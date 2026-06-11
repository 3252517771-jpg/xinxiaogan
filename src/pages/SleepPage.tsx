import { useEffect, useState } from 'react'
import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import MagicBentoLayout from '@/components/layout/MagicBentoLayout'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import SleepForm from '@/features/sleep/SleepForm'
import SleepSummary from '@/features/sleep/SleepSummary'
import SleepTrend from '@/features/sleep/SleepTrend'
import { useVideoState } from '@/hooks/useVideoState'
import { request } from '@/services/api'
import type { BehaviorInsight, LatestHealthResponse, SleepRecord } from '@/types/health'

function SleepPage() {
  const [score, setScore] = useState<number | null>(null)
  const [record, setRecord] = useState<SleepRecord | null>(null)
  const [advice, setAdvice] = useState<string | undefined>()
  const [behaviorTags, setBehaviorTags] = useState<BehaviorInsight[]>([])
  const { scene, triggerFeedback, handleVideoEnded } = useVideoState('sleep', score ?? 80)

  useEffect(() => {
    let isMounted = true

    async function loadLatest() {
      const response = await request<LatestHealthResponse>('/health/latest')
      if (isMounted && response.sleep) {
        setRecord(response.sleep)
        setScore(response.sleep.score)
      }
    }

    void loadLatest().catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <BackgroundLayer image="图片一.png" onSceneEnded={handleVideoEnded} scene={scene} />
      <PageTransition>
        <PageHeader score={score} title="作息分析" />
        <MagicBentoLayout align="right">
          <GlassCard title="作息录入" tone="medium">
            <SleepForm
              onSubmitted={(response) => {
                setScore(response.score)
                setRecord(response.record)
                setAdvice(response.ai_advice)
                setBehaviorTags(response.behavior_tags)
                triggerFeedback()
              }}
            />
          </GlassCard>
          <SleepSummary advice={advice} behaviorTags={behaviorTags} record={record} />
          <SleepTrend />
        </MagicBentoLayout>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default SleepPage
