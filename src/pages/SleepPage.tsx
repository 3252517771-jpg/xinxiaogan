import { useState } from 'react'
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

function SleepPage() {
  const [score, setScore] = useState(83)
  const { scene, triggerFeedback, handleVideoEnded } = useVideoState('sleep', score)

  return (
    <>
      <BackgroundLayer image="图一.png" onSceneEnded={handleVideoEnded} scene={scene} />
      <PageTransition>
        <PageHeader score={score} title="作息分析" />
        <MagicBentoLayout align="right">
          <GlassCard title="作息录入" tone="medium">
            <SleepForm
              onSubmitted={(nextScore) => {
                setScore(nextScore)
                triggerFeedback()
              }}
            />
          </GlassCard>
          <SleepSummary />
          <SleepTrend />
        </MagicBentoLayout>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default SleepPage
