import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BackgroundLayer from '@/components/background/BackgroundLayer'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/transitions/PageTransition'
import AuthModal from '@/features/auth/AuthModal'
import DimensionCardStack from '@/features/dashboard/DimensionCardStack'
import ScoreTagline from '@/features/dashboard/ScoreTagline'
import TrendSection from '@/features/dashboard/TrendSection'
import PillButton from '@/components/ui/PillButton'
import { useAuth } from '@/hooks/useAuth'

function HomePage() {
  const { isAuthenticated } = useAuth()
  const isUnlocked = isAuthenticated
  const [showLogin, setShowLogin] = useState(!isUnlocked)

  useEffect(() => {
    document.body.classList.toggle('home-locked', !isUnlocked)
    return () => document.body.classList.remove('home-locked')
  }, [isUnlocked])

  useEffect(() => {
    setShowLogin(!isUnlocked)
  }, [isUnlocked])

  const handleAuthenticated = () => {
    setShowLogin(false)
  }

  return (
    <>
      <BackgroundLayer image="首页图.png" video="H-01.mp4" />
      <Navbar locked={!isUnlocked} onLoginClick={() => setShowLogin(true)} />
      <PageTransition>
        <div className="space-y-28 pb-24 pt-40">
          <section className="min-h-[calc(100vh-160px)] rounded-glass bg-forest-deep/12 p-4">
            <ScoreTagline locked={!isUnlocked} />
          </section>
          {isUnlocked ? (
            <>
              <DimensionCardStack />
              <TrendSection />
              <div className="flex justify-center">
                <Link to="/profile">
                  <PillButton variant="outline">个人中心</PillButton>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </PageTransition>
      {showLogin ? <AuthModal onAuthenticated={handleAuthenticated} /> : null}
    </>
  )
}

export default HomePage
