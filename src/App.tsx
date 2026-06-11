import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { ROUTES } from '@/config/routes'
import HomePage from '@/pages/HomePage'
import SleepPage from '@/pages/SleepPage'
import DietPage from '@/pages/DietPage'
import ExercisePage from '@/pages/ExercisePage'
import StressPage from '@/pages/StressPage'
import RiskPage from '@/pages/RiskPage'
import ProfilePage from '@/pages/ProfilePage'
import AuthGuard from '@/components/layout/AuthGuard'

function protectedPage(page: ReactElement) {
  return <AuthGuard>{page}</AuthGuard>
}

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.SLEEP} element={protectedPage(<SleepPage />)} />
      <Route path={ROUTES.DIET} element={protectedPage(<DietPage />)} />
      <Route path={ROUTES.EXERCISE} element={protectedPage(<ExercisePage />)} />
      <Route path={ROUTES.STRESS} element={protectedPage(<StressPage />)} />
      <Route path={ROUTES.RISK} element={protectedPage(<RiskPage />)} />
      <Route path={ROUTES.PROFILE} element={protectedPage(<ProfilePage />)} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}

export default App
