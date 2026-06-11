import { useState } from 'react'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { useMockSubmit } from '@/hooks/useMockSubmit'
import type { HealthMutationResponse, StressRecord } from '@/types/health'

type EmotionTag = 'happy' | 'calm' | 'anxious' | 'tired' | 'irritable' | 'down' | 'nervous' | 'relaxed'

interface StressPayload {
  stress_level: number
  anxiety_level: number
  emotion_tag: EmotionTag
}

interface StressFormProps {
  onSubmitted?: (response: HealthMutationResponse<StressRecord>) => void
}

function StressForm({ onSubmitted }: StressFormProps) {
  const [stressLevel, setStressLevel] = useState(4)
  const [anxietyLevel, setAnxietyLevel] = useState(3)
  const [emotionTag, setEmotionTag] = useState<EmotionTag>('calm')
  const { isSubmitting, message, error, submit } = useMockSubmit<StressPayload, StressRecord>('/health/stress')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const response = await submit({
      stress_level: stressLevel,
      anxiety_level: anxietyLevel,
      emotion_tag: emotionTag,
    })

    if (response) {
      onSubmitted?.(response)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FieldInput hint="1-10" label="压力自评" max={10} min={1} onChange={(event) => setStressLevel(Number(event.target.value))} placeholder="4" type="number" value={stressLevel} />
      <FieldInput hint="1-10" label="焦虑自评" max={10} min={1} onChange={(event) => setAnxietyLevel(Number(event.target.value))} placeholder="3" type="number" value={anxietyLevel} />
      <label className="block text-sm text-white/78" htmlFor="emotion-tag">
        <span className="mb-2 flex items-center justify-between gap-3">
          <span>情绪标签</span>
          <span className="text-xs text-white/42">8 种可选</span>
        </span>
        <select
          className="h-11 w-full rounded-glass border border-white/15 bg-black/18 px-3 text-white outline-none transition focus:border-dimension-exercise/70 focus:bg-black/24 focus:ring-2 focus:ring-dimension-exercise/20"
          id="emotion-tag"
          onChange={(event) => setEmotionTag(event.target.value as EmotionTag)}
          value={emotionTag}
        >
          <option value="happy">开心</option>
          <option value="calm">平静</option>
          <option value="anxious">焦虑</option>
          <option value="tired">疲惫</option>
          <option value="irritable">烦躁</option>
          <option value="down">低落</option>
          <option value="nervous">紧张</option>
          <option value="relaxed">放松</option>
        </select>
      </label>
      <PillButton disabled={isSubmitting} type="submit" variant="color">
        {isSubmitting ? '记录中...' : '记录今日'}
      </PillButton>
      {message ? <Toast message={message} /> : null}
      {error ? <Toast message={error} tone="info" /> : null}
    </form>
  )
}

export default StressForm
