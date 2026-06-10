import type { SleepRecord } from '@/types/health'

export const mockSleepRecord: SleepRecord = {
  id: 'mock-sleep-1',
  user_id: 'mock-user',
  record_date: '2026-06-10',
  sleep_time: '23:00',
  wake_time: '07:30',
  sleep_quality: 4,
  interruption_count: 1,
  score: 83,
}
