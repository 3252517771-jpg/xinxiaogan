import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import HealthForm from '@/features/risk/HealthForm'
import RiskRadarPanel from '@/features/risk/RiskRadarPanel'
import RiskSummary from '@/features/risk/RiskSummary'
import RiskTrend from '@/features/risk/RiskTrend'

function RiskPage() {
  return (
    <>
      <BackgroundLayer image="图五.png" />
      <Navbar />
      <PageTransition>
        <PageHeader score={88} title="健康风险" />
        <div className="grid grid-cols-3 gap-6">
          <GlassCard title="体征录入">
            <HealthForm />
          </GlassCard>
          <div className="space-y-6">
            <RiskRadarPanel />
            <RiskTrend />
          </div>
          <div className="space-y-6">
            <RiskSummary />
          </div>
        </div>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default RiskPage
