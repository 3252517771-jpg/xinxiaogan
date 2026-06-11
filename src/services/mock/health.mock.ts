import type {
  BehaviorSummaryResponse,
  DailyScore,
  DietRecord,
  ExerciseRecord,
  RiskMutationResponse,
  RiskRecord,
  SleepRecord,
  StressRecord,
} from '@/types/health'
import { getScoreLevel } from '@/utils/score'
import { mockDietRecord } from './diet.mock'
import { mockExerciseRecord } from './exercise.mock'
import { mockBehaviorHighlights, mockRiskPrediction, mockRiskRecord } from './risk.mock'
import { mockSleepRecord } from './sleep.mock'
import { mockStressRecord } from './stress.mock'

export type HealthDimension = 'sleep' | 'diet' | 'exercise' | 'stress' | 'risk'

export type HealthRecord =
  | SleepRecord
  | DietRecord
  | ExerciseRecord
  | StressRecord
  | RiskRecord

export interface TrendPoint {
  date: string
  sleep: number
  diet: number
  exercise: number
  stress: number
  risk: number
  overall: number
}

export interface HistoryItem {
  id: string
  dimension: HealthDimension
  record_date: string
  score: number
  title: string
  summary: string
}

export interface HistoryPage {
  page: number
  page_size: number
  total: number
  items: HistoryItem[]
}

const MOCK_USER_ID = 'mock-user'

export const mockDailyScore: DailyScore = {
  id: 'mock-daily-score-1',
  user_id: MOCK_USER_ID,
  score_date: '2026-06-10',
  sleep_score: mockSleepRecord.score,
  diet_score: mockDietRecord.score,
  exercise_score: mockExerciseRecord.score,
  stress_score: mockStressRecord.score,
  risk_score: mockRiskRecord.score,
  overall_score: 82,
  score_level: getScoreLevel(82),
}

export const mockTrendPoints: TrendPoint[] = [
  { date: '2026-06-04', sleep: 78, diet: 70, exercise: 74, stress: 82, risk: 84, overall: 78 },
  { date: '2026-06-05', sleep: 80, diet: 72, exercise: 76, stress: 80, risk: 85, overall: 79 },
  { date: '2026-06-06', sleep: 76, diet: 74, exercise: 78, stress: 83, risk: 86, overall: 79 },
  { date: '2026-06-07', sleep: 82, diet: 76, exercise: 79, stress: 84, risk: 87, overall: 82 },
  { date: '2026-06-08', sleep: 84, diet: 75, exercise: 81, stress: 85, risk: 87, overall: 82 },
  { date: '2026-06-09', sleep: 81, diet: 77, exercise: 82, stress: 86, risk: 88, overall: 83 },
  { date: '2026-06-10', sleep: 83, diet: 75, exercise: 80, stress: 86, risk: 88, overall: 82 },
]

export const mockHistoryItems: HistoryItem[] = [
  {
    id: mockSleepRecord.id,
    dimension: 'sleep',
    record_date: mockSleepRecord.record_date,
    score: mockSleepRecord.score,
    title: '作息记录',
    summary: '23:00 入睡，07:30 起床，夜间中断 1 次',
  },
  {
    id: mockDietRecord.id,
    dimension: 'diet',
    record_date: mockDietRecord.record_date,
    score: mockDietRecord.score,
    title: '饮食记录',
    summary: '午餐 680 kcal，包含主食、蛋白质和蔬菜',
  },
  {
    id: mockExerciseRecord.id,
    dimension: 'exercise',
    record_date: mockExerciseRecord.record_date,
    score: mockExerciseRecord.score,
    title: '运动记录',
    summary: '步行 35 分钟，8200 步，中等强度',
  },
  {
    id: mockStressRecord.id,
    dimension: 'stress',
    record_date: mockStressRecord.record_date,
    score: mockStressRecord.score,
    title: '压力记录',
    summary: '压力 4/10，焦虑 3/10，情绪平静',
  },
  {
    id: mockRiskRecord.id,
    dimension: 'risk',
    record_date: mockRiskRecord.record_date,
    score: mockRiskRecord.score,
    title: '体征记录',
    summary: '血压、心率、血糖处于稳定区间',
  },
]

export const mockHealthRecords: Record<HealthDimension, HealthRecord> = {
  sleep: mockSleepRecord,
  diet: mockDietRecord,
  exercise: mockExerciseRecord,
  stress: mockStressRecord,
  risk: mockRiskRecord,
}

export const mockRiskMutationResponse: RiskMutationResponse = mockRiskPrediction
export const mockBehaviorSummary: BehaviorSummaryResponse = {
  ok: true,
  count: mockBehaviorHighlights.length,
  highlights: mockBehaviorHighlights,
}

export function getMockHistory(dimension: HealthDimension | 'all', page: number): HistoryPage {
  const pageSize = 10
  const filteredItems =
    dimension === 'all'
      ? mockHistoryItems
      : mockHistoryItems.filter((item) => item.dimension === dimension)

  return {
    page,
    page_size: pageSize,
    total: filteredItems.length,
    items: filteredItems.slice((page - 1) * pageSize, page * pageSize),
  }
}
