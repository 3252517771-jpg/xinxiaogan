import { useState } from 'react'
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

function ExercisePage() {
  const [score, setScore] = useState(80)
  const { scene, triggerFeedback, handleVideoEnded } = useVideoState('exercise', score)

  return (
    <>
      <BackgroundLayer image="图三.png" onSceneEnded={handleVideoEnded} scene={scene} />
      <PageTransition>
        <PageHeader score={score} title="运动分析" />
        <MagicBentoLayout align="left">
          <GlassCard title="运动录入" tone="medium">
            <ExerciseForm
              onSubmitted={(nextScore) => {
                setScore(nextScore)
                triggerFeedback()
              }}
            />
          </GlassCard>
          <ExerciseSummary />
          <ExerciseTrend />
        </MagicBentoLayout>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default ExercisePage
