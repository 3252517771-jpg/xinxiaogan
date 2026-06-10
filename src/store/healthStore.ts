export interface HealthState {
  selectedDate: string
  overallScore: number | null
}

export const initialHealthState: HealthState = {
  selectedDate: '2026-06-10',
  overallScore: null,
}
