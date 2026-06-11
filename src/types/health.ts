import type { ScoreLevel } from '@/types/ip'

export type RiskLevel = 'low' | 'medium' | 'high'
export type BehaviorTag = 'late_night' | 'short_sleep' | 'meal_skip' | 'sedentary' | 'high_stress' | 'abnormal_sign'
export type BehaviorDimension = 'sleep' | 'diet' | 'exercise' | 'stress' | 'risk'

export interface BehaviorInsight {
  id: BehaviorTag
  dimension: BehaviorDimension
  label: string
}

export interface BehaviorSummaryResponse {
  ok: boolean
  count: number
  highlights: BehaviorInsight[]
}

export interface RiskPrediction {
  risk_level: RiskLevel
  risk_probability: number
  risk_alert: boolean
}

export interface HealthMutationResponse<TRecord> {
  ok: boolean
  score: number
  record: TRecord
  behavior_tags: BehaviorInsight[]
  ai_advice: string
}

export interface HealthHistoryItem {
  id: string
  dimension: BehaviorDimension
  record_date: string
  title: string
  score: number
  summary: string
}

export interface HealthHistoryResponse {
  ok: boolean
  count: number
  items: HealthHistoryItem[]
}

export interface LatestHealthResponse {
  ok: boolean
  sleep: SleepRecord | null
  diet: DietRecord | null
  exercise: ExerciseRecord | null
  stress: StressRecord | null
  risk: RiskRecord | null
}

export interface RiskMutationResponse extends HealthMutationResponse<RiskRecord>, RiskPrediction {
  behavior_tags: BehaviorInsight[]
  ai_advice: string
}

export interface SleepRecord {
  id: string
  user_id: string
  record_date: string
  sleep_time: string
  wake_time: string
  sleep_quality: 1 | 2 | 3 | 4 | 5
  interruption_count: number
  score: number
  notes?: string
}

export interface DietRecord {
  id: string
  user_id: string
  record_date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  food_description: string
  calories: number
  score: number
}

export interface ExerciseRecord {
  id: string
  user_id: string
  record_date: string
  exercise_type: 'running' | 'walking' | 'cycling' | 'fitness' | 'ball' | 'other'
  duration_min: number
  intensity: 'low' | 'medium' | 'high'
  steps?: number
  heart_rate?: number
  score: number
}

export interface StressRecord {
  id: string
  user_id: string
  record_date: string
  stress_level: number
  anxiety_level: number
  emotion_tag: 'happy' | 'calm' | 'anxious' | 'tired' | 'irritable' | 'down' | 'nervous' | 'relaxed'
  score: number
}

export interface RiskRecord {
  id: string
  user_id: string
  record_date: string
  systolic_bp: number
  diastolic_bp: number
  heart_rate: number
  blood_glucose: number
  waist_cm: number
  cholesterol: number
  score: number
}

export interface DailyScore {
  id: string
  user_id: string
  score_date: string
  sleep_score: number | null
  diet_score: number | null
  exercise_score: number | null
  stress_score: number | null
  risk_score: number | null
  overall_score: number | null
  score_level: ScoreLevel | null
}
