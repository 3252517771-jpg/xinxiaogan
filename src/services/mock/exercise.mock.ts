import type { ExerciseRecord } from '@/types/health'

export const mockExerciseRecord: ExerciseRecord = {
  id: 'mock-exercise-1',
  user_id: 'mock-user',
  record_date: '2026-06-10',
  exercise_type: 'walking',
  duration_min: 35,
  intensity: 'medium',
  steps: 8200,
  heart_rate: 92,
  score: 80,
}
