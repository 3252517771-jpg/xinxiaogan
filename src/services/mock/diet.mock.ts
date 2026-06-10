import type { DietRecord } from '@/types/health'

export const mockDietRecord: DietRecord = {
  id: 'mock-diet-1',
  user_id: 'mock-user',
  record_date: '2026-06-10',
  meal_type: 'lunch',
  food_description: '米饭、鸡胸肉、青菜',
  calories: 680,
  score: 75,
}
