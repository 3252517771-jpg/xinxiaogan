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

function StressPage() {
  return (
    <>
      <BackgroundLayer image="图四.png" />
      <PageTransition>
        <PageHeader score={86} title="压力分析" />
        <ThreeColumnLayout
          centerLabel="无翼鸟全屏背景留白"
          left={
            <>
              <TiltedPanel caption="压力自评录入" minHeight="390px">
                <GlassCard title="压力自评录入">
                  <StressForm />
                </GlassCard>
              </TiltedPanel>
              <TiltedPanel caption="压力摘要" minHeight="180px">
                <StressSummary />
              </TiltedPanel>
            </>
          }
          right={
            <>
              <TiltedPanel caption="个性化建议" minHeight="170px">
                <StressAdvice />
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
