import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import IPVideoPlayer from '@/components/ip/IPVideoPlayer'
import GlassCard from '@/components/ui/GlassCard'
import ExerciseForm from '@/features/exercise/ExerciseForm'
import ExerciseSummary from '@/features/exercise/ExerciseSummary'
import ExerciseTrend from '@/features/exercise/ExerciseTrend'

function ExercisePage() {
  return (
    <>
      <BackgroundLayer image="图三.png" />
      <Navbar />
      <PageTransition>
        <PageHeader score={80} title="运动分析" />
        <div className="grid grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            <GlassCard title="运动录入">
              <ExerciseForm />
            </GlassCard>
            <ExerciseSummary />
            <ExerciseTrend />
          </div>
          <IPVideoPlayer ipId="exercise" score={80} />
        </div>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default ExercisePage
