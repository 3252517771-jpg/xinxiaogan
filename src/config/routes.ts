export const ROUTES = {
  HOME: '/',
  SLEEP: '/sleep',
  DIET: '/diet',
  EXERCISE: '/exercise',
  STRESS: '/stress',
  RISK: '/health-risk',
  PROFILE: '/profile',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

export interface RouteMeta {
  path: AppRoute
  label: string
  dimension?: HealthDimension
}

export type HealthDimension = 'sleep' | 'diet' | 'exercise' | 'stress' | 'risk'

export const DETAIL_ROUTES: RouteMeta[] = [
  { path: ROUTES.SLEEP, label: '作息', dimension: 'sleep' },
  { path: ROUTES.DIET, label: '饮食', dimension: 'diet' },
  { path: ROUTES.EXERCISE, label: '运动', dimension: 'exercise' },
  { path: ROUTES.STRESS, label: '压力', dimension: 'stress' },
  { path: ROUTES.RISK, label: '风险', dimension: 'risk' },
]
