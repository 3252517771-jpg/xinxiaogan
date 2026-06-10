import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import IPVideoPlayer from '@/components/ip/IPVideoPlayer'
import GlassCard from '@/components/ui/GlassCard'
import SleepForm from '@/features/sleep/SleepForm'
import SleepSummary from '@/features/sleep/SleepSummary'
import SleepTrend from '@/features/sleep/SleepTrend'

function SleepPage() {
  return (
    <>
      <BackgroundLayer image="图一.png" />
      <Navbar />
      <PageTransition>
        <PageHeader score={83} title="作息分析" />
        <div className="grid grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            <GlassCard title="作息录入">
              <SleepForm />
            </GlassCard>
            <SleepSummary />
            <SleepTrend />
          </div>
          <IPVideoPlayer ipId="sleep" score={83} />
        </div>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default SleepPage
