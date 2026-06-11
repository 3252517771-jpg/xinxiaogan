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
import { request } from '@/services/api'
import type { BehaviorInsight, BehaviorSummaryResponse } from '@/types/health'

const DIMENSION_LABELS: Record<BehaviorInsight['dimension'], string> = {
  sleep: '作息',
  diet: '饮食',
  exercise: '运动',
  stress: '压力',
  risk: '风险',
}

function HomePage() {
  const { isAuthenticated, isCheckingAuth } = useAuth()
  const isUnlocked = isAuthenticated
  const [showLogin, setShowLogin] = useState(!isUnlocked && !isCheckingAuth)
  const [highlights, setHighlights] = useState<BehaviorInsight[]>([])
  const [behaviorError, setBehaviorError] = useState<string | null>(null)
  const [profilePrompt, setProfilePrompt] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('home-locked', !isUnlocked)
    return () => document.body.classList.remove('home-locked')
  }, [isUnlocked])

  useEffect(() => {
    setShowLogin(!isUnlocked && !isCheckingAuth)
  }, [isCheckingAuth, isUnlocked])

  useEffect(() => {
    if (!isUnlocked) {
      setHighlights([])
      setBehaviorError(null)
      return
    }

    let isMounted = true

    async function loadHighlights() {
      try {
        const response = await request<BehaviorSummaryResponse>('/behavior/summary')
        if (isMounted) {
          setHighlights(response.highlights)
          setBehaviorError(null)
        }
      } catch (requestError) {
        if (isMounted) {
          setBehaviorError(requestError instanceof Error ? requestError.message : '行为识别加载失败')
        }
      }
    }

    void loadHighlights()

    return () => {
      isMounted = false
    }
  }, [isUnlocked])

  const handleAuthenticated = (mode: 'login' | 'register') => {
    setShowLogin(false)
    setProfilePrompt(mode === 'register')
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
              <section
                aria-label="行为识别标签"
                className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 rounded-[28px] border border-black/18 bg-black/28 px-5 py-4 text-white backdrop-blur-md"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/56">behavior</span>
                {behaviorError ? <span className="text-sm text-white/68">{behaviorError}</span> : null}
                {!behaviorError && highlights.length === 0 ? <span className="text-sm text-white/68">最近状态平稳，暂时没有额外提醒。</span> : null}
                {highlights.map((item) => (
                  <span
                    className="inline-flex min-h-11 items-center gap-3 rounded-pill border border-white/10 bg-black/42 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                    key={item.id}
                  >
                    <span className="rounded-pill bg-white/12 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/72">
                      {DIMENSION_LABELS[item.dimension]}
                    </span>
                    <span className="leading-5 text-white/92">{item.label}</span>
                  </span>
                ))}
              </section>
              <div className="flex justify-center">
                <Link to="/profile">
                  <PillButton variant="outline">个人中心</PillButton>
                </Link>
              </div>
              {profilePrompt ? (
                <section className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-[28px] border border-white/14 bg-black/26 px-5 py-4 text-white backdrop-blur-md">
                  <div>
                    <p className="text-sm font-semibold text-white">先补充你的真实资料</p>
                    <p className="mt-1 text-xs text-white/56">新账号不会使用模板健康档案。补充资料后，AI 建议会更贴近你的实际情况。</p>
                  </div>
                  <Link to="/profile">
                    <PillButton variant="color">去补充</PillButton>
                  </Link>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </PageTransition>
      {showLogin ? <AuthModal onAuthenticated={handleAuthenticated} /> : null}
    </>
  )
}

export default HomePage
