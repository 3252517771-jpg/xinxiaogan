import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import DietForm from '@/features/diet/DietForm'
import DietSummary from '@/features/diet/DietSummary'
import DietTip from '@/features/diet/DietTip'

function DietPage() {
  return (
    <>
      <BackgroundLayer image="图二.png" />
      <Navbar />
      <PageTransition>
        <PageHeader score={75} title="饮食分析" />
        <div className="grid grid-cols-3 gap-6">
          <DietTip />
          <GlassCard title="饮食录入">
            <DietForm />
          </GlassCard>
          <DietSummary />
        </div>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default DietPage
