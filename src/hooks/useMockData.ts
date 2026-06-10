import { mockSleepRecord } from '@/services/mock/sleep.mock'

export function useMockData() {
  return { sleep: mockSleepRecord, isLoading: false, error: null as string | null }
}
