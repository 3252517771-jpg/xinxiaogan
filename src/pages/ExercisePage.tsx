import BackgroundLayer from '@/components/background/BackgroundLayer'
import GooeyNav from '@/components/layout/GooeyNav'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
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
        <div className="grid grid-cols-[minmax(0,520px)_1fr] gap-6">
          <div className="space-y-6" data-layout-zone="exercise-data">
            <GlassCard title="运动录入">
              <ExerciseForm />
            </GlassCard>
            <ExerciseSummary />
            <ExerciseTrend />
          </div>
          <div aria-hidden="true" data-layout-zone="ip-scene-space" />
        </div>
      </PageTransition>
      <GooeyNav />
    </>
  )
}

export default ExercisePage
