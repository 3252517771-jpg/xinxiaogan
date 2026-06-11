import type { BehaviorInsight, RiskMutationResponse, RiskRecord } from '@/types/health'

export const mockRiskRecord: RiskRecord = {
  id: 'mock-risk-1',
  user_id: 'mock-user',
  record_date: '2026-06-10',
  systolic_bp: 118,
  diastolic_bp: 76,
  heart_rate: 72,
  blood_glucose: 5.1,
  waist_cm: 78,
  cholesterol: 4.6,
  score: 88,
}

export const mockRiskPrediction: RiskMutationResponse = {
  ok: true,
  score: mockRiskRecord.score,
  record: mockRiskRecord,
  risk_level: 'low',
  risk_probability: 0.912,
  risk_alert: false,
  behavior_tags: [],
}

export const mockBehaviorHighlights: BehaviorInsight[] = [
  {
    id: 'late_night',
    dimension: 'sleep',
    label: '近期熬夜较多，注意调整作息哦',
  },
  {
    id: 'sedentary',
    dimension: 'exercise',
    label: '近期运动偏少，出门走走活动一下',
  },
  {
    id: 'high_stress',
    dimension: 'stress',
    label: '最近压力较大，记得适当放松',
  },
]
