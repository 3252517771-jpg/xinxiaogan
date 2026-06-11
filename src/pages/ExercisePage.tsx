import { useEffect, useState } from 'react'
import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import MagicBentoLayout from '@/components/layout/MagicBentoLayout'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import ExerciseForm from '@/features/exercise/ExerciseForm'
import ExerciseSummary from '@/features/exercise/ExerciseSummary'
import ExerciseTrend from '@/features/exercise/ExerciseTrend'
import { useVideoState } from '@/hooks/useVideoState'
import { request } from '@/services/api'
import type { BehaviorInsight, ExerciseRecord, LatestHealthResponse } from '@/types/health'

function ExercisePage() {
  const [score, setScore] = useState<number | null>(null)
  const [record, setRecord] = useState<ExerciseRecord | null>(null)
  const [advice, setAdvice] = useState<string | undefined>()
  const [behaviorTags, setBehaviorTags] = useState<BehaviorInsight[]>([])
  const { scene, triggerFeedback, handleVideoEnded } = useVideoState('exercise', score ?? 80)

  useEffect(() => {
    let isMounted = true

    async function loadLatest() {
      const response = await request<LatestHealthResponse>('/health/latest')
      if (isMounted && response.exercise) {
        setRecord(response.exercise)
        setScore(response.exercise.score)
      }
    }

    void loadLatest().catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <BackgroundLayer image="图片三.png" onSceneEnded={handleVideoEnded} scene={scene} />
      <PageTransition>
        <PageHeader score={score} title="运动分析" />
        <MagicBentoLayout align="left">
          <GlassCard title="运动录入" tone="medium">
            <ExerciseForm
              onSubmitted={(response) => {
                setScore(response.score)
                setRecord(response.record)
                setAdvice(response.ai_advice)
                setBehaviorTags(response.behavior_tags)
                triggerFeedback()
              }}
            />
          </GlassCard>
          <ExerciseSummary advice={advice} behaviorTags={behaviorTags} record={record} />
          <ExerciseTrend />
        </MagicBentoLayout>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default ExercisePage
