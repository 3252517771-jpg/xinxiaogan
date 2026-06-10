import { SCORE_THRESHOLDS } from '@/config/constants'
import type { ScoreLevel } from '@/types/ip'

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= SCORE_THRESHOLDS.excellent) return 'excellent'
  if (score >= SCORE_THRESHOLDS.good) return 'good'
  if (score >= SCORE_THRESHOLDS.average) return 'average'
  return 'poor'
}
