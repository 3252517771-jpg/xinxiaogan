import type { RiskMutationResponse, RiskRecord } from '@/types/health'

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
}
