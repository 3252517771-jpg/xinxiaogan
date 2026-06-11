import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
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
        <div className="grid grid-cols-[minmax(0,520px)_1fr] gap-6">
          <div className="space-y-6" data-layout-zone="sleep-data">
            <GlassCard title="作息录入">
              <SleepForm />
            </GlassCard>
            <SleepSummary />
            <SleepTrend />
          </div>
          <div aria-hidden="true" data-layout-zone="ip-scene-space" />
        </div>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default SleepPage
