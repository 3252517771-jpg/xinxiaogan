import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import HomePage from '@/pages/HomePage'
import SleepPage from '@/pages/SleepPage'
import DietPage from '@/pages/DietPage'
import ExercisePage from '@/pages/ExercisePage'
import StressPage from '@/pages/StressPage'
import RiskPage from '@/pages/RiskPage'
import ProfilePage from '@/pages/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.SLEEP} element={<SleepPage />} />
      <Route path={ROUTES.DIET} element={<DietPage />} />
      <Route path={ROUTES.EXERCISE} element={<ExercisePage />} />
      <Route path={ROUTES.STRESS} element={<StressPage />} />
      <Route path={ROUTES.RISK} element={<RiskPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}

export default App
