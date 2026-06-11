import { useState } from 'react'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import StarRating from '@/components/ui/StarRating'
import Toast from '@/components/ui/Toast'
import { useMockSubmit } from '@/hooks/useMockSubmit'
import type { SleepRecord } from '@/types/health'

interface SleepPayload {
  sleep_time: string
  wake_time: string
  sleep_quality: number
  interruption_count: number
}

interface SleepFormProps {
  onSubmitted?: (score: number) => void
}

function SleepForm({ onSubmitted }: SleepFormProps) {
  const [sleepTime, setSleepTime] = useState('23:00')
  const [wakeTime, setWakeTime] = useState('07:30')
  const [sleepQuality, setSleepQuality] = useState(4)
  const [interruptionCount, setInterruptionCount] = useState(1)
  const { isSubmitting, message, error, submit } = useMockSubmit<SleepPayload, SleepRecord>('/health/sleep')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const response = await submit({
      sleep_time: sleepTime,
      wake_time: wakeTime,
      sleep_quality: sleepQuality,
      interruption_count: interruptionCount,
    })

    if (response) {
      onSubmitted?.(response.score)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FieldInput hint="建议 23:00 前" label="入睡时间" onChange={(event) => setSleepTime(event.target.value)} type="time" value={sleepTime} />
      <FieldInput hint="保持固定节律" label="起床时间" onChange={(event) => setWakeTime(event.target.value)} type="time" value={wakeTime} />
      <FieldInput label="中断次数" min={0} onChange={(event) => setInterruptionCount(Number(event.target.value))} placeholder="0" type="number" value={interruptionCount} />
      <div className="flex items-center justify-between rounded-glass border border-white/12 bg-black/12 px-3 py-3">
        <span className="text-sm text-white/72">睡眠质量</span>
        <button className="rounded-pill px-2 py-1" onClick={() => setSleepQuality(sleepQuality === 5 ? 1 : sleepQuality + 1)} type="button">
          <StarRating value={sleepQuality} />
        </button>
      </div>
      <PillButton disabled={isSubmitting} type="submit" variant="color">
        {isSubmitting ? '记录中...' : '记录今日'}
      </PillButton>
      {message ? <Toast message={message} /> : null}
      {error ? <Toast message={error} tone="info" /> : null}
    </form>
  )
}

export default SleepForm
