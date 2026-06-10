import { Routes, Route } from 'react-router-dom'

const ROUTES = {
  HOME:     '/',
  SLEEP:    '/sleep',
  DIET:     '/diet',
  EXERCISE: '/exercise',
  STRESS:   '/stress',
  RISK:     '/health-risk',
  PROFILE:  '/profile',
} as const

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<div className="h-screen flex items-center justify-center bg-forest-deep text-white">小心肝</div>} />
    </Routes>
  )
}

export default App
