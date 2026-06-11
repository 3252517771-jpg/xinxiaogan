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
import type { RiskPrediction } from '@/types/health'

function RiskPage() {
  const [score, setScore] = useState(88)
  const [prediction, setPrediction] = useState<RiskPrediction | null>({
    risk_level: 'low',
    risk_probability: 0.912,
    risk_alert: false,
  })
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
                    onSubmitted={(result) => {
                      setScore(result.score)
                      setPrediction({
                        risk_level: result.risk_level,
                        risk_probability: result.risk_probability,
                        risk_alert: result.risk_alert,
                      })
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
                <RiskSummary prediction={prediction} />
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
