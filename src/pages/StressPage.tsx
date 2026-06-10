import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import IPVideoPlayer from '@/components/ip/IPVideoPlayer'
import GlassCard from '@/components/ui/GlassCard'
import StressAdvice from '@/features/stress/StressAdvice'
import StressForm from '@/features/stress/StressForm'
import StressSummary from '@/features/stress/StressSummary'
import StressTrend from '@/features/stress/StressTrend'

function StressPage() {
  return (
    <>
      <BackgroundLayer image="图四.png" />
      <Navbar />
      <PageTransition>
        <PageHeader score={86} title="压力分析" />
        <div className="grid grid-cols-3 gap-6">
          <GlassCard title="压力录入">
            <StressForm />
          </GlassCard>
          <div className="space-y-6">
            <StressSummary />
            <StressAdvice />
            <StressTrend />
          </div>
          <IPVideoPlayer ipId="stress" score={86} />
        </div>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default StressPage
