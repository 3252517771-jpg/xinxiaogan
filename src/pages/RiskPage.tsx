import { useState } from 'react'
import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import PageHeader from '@/components/layout/PageHeader'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import TiltedPanel from '@/components/layout/TiltedPanel'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import HealthForm from '@/features/risk/HealthForm'
import RiskRadarPanel from '@/features/risk/RiskRadarPanel'
import RiskSummary from '@/features/risk/RiskSummary'
import RiskTrend from '@/features/risk/RiskTrend'
import { useVideoState } from '@/hooks/useVideoState'

function RiskPage() {
  const [score, setScore] = useState(88)
  const { scene, triggerFeedback, handleVideoEnded } = useVideoState('risk', score)

  return (
    <>
      <BackgroundLayer image="图五.png" onSceneEnded={handleVideoEnded} scene={scene} />
      <PageTransition>
        <PageHeader score={score} title="健康风险" />
        <ThreeColumnLayout
          centerLabel="两脚兽全屏背景留白"
          left={
            <>
              <TiltedPanel caption="体征数据录入" minHeight="470px">
                <GlassCard title="体征数据录入">
                  <HealthForm
                    onSubmitted={(nextScore) => {
                      setScore(nextScore)
                      triggerFeedback()
                    }}
                  />
                </GlassCard>
              </TiltedPanel>
              <TiltedPanel caption="风险雷达图" minHeight="260px">
                <RiskRadarPanel />
              </TiltedPanel>
            </>
          }
          right={
            <>
              <TiltedPanel caption="风险趋势" minHeight="180px">
                <RiskTrend />
              </TiltedPanel>
              <TiltedPanel caption="风险分析摘要" minHeight="240px">
                <RiskSummary />
              </TiltedPanel>
            </>
          }
        />
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default RiskPage
