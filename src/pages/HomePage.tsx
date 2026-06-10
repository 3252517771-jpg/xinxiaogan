import BackgroundLayer from '@/components/background/BackgroundLayer'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/transitions/PageTransition'
import DimensionCardStack from '@/features/dashboard/DimensionCardStack'
import ScoreTagline from '@/features/dashboard/ScoreTagline'
import TrendSection from '@/features/dashboard/TrendSection'

function HomePage() {
  return (
    <>
      <BackgroundLayer />
      <Navbar />
      <PageTransition>
        <div className="flex min-h-screen flex-col justify-center gap-16">
          <ScoreTagline />
          <DimensionCardStack />
          <TrendSection />
        </div>
      </PageTransition>
    </>
  )
}

export default HomePage
