import { useState } from 'react'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { useMockSubmit } from '@/hooks/useMockSubmit'
import type { ExerciseRecord } from '@/types/health'

type ExerciseType = 'running' | 'walking' | 'cycling' | 'fitness' | 'ball' | 'other'
type Intensity = 'low' | 'medium' | 'high'

interface ExercisePayload {
  exercise_type: ExerciseType
  duration_min: number
  intensity: Intensity
  steps: number
  heart_rate: number
}

function ExerciseForm() {
  const [exerciseType, setExerciseType] = useState<ExerciseType>('walking')
  const [durationMin, setDurationMin] = useState(35)
  const [intensity, setIntensity] = useState<Intensity>('medium')
  const [steps, setSteps] = useState(8200)
  const [heartRate, setHeartRate] = useState(92)
  const { isSubmitting, message, error, submit } = useMockSubmit<ExercisePayload, ExerciseRecord>('/health/exercise')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit({
      exercise_type: exerciseType,
      duration_min: durationMin,
      intensity,
      steps,
      heart_rate: heartRate,
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm text-white/78" htmlFor="exercise-type">
        <span className="mb-2 flex items-center justify-between gap-3">
          <span>运动类型</span>
          <span className="text-xs text-white/42">跑步/步行/骑行</span>
        </span>
        <select
          className="h-11 w-full rounded-glass border border-white/15 bg-black/18 px-3 text-white outline-none transition focus:border-dimension-exercise/70 focus:bg-black/24 focus:ring-2 focus:ring-dimension-exercise/20"
          id="exercise-type"
          onChange={(event) => setExerciseType(event.target.value as ExerciseType)}
          value={exerciseType}
        >
          <option value="running">跑步</option>
          <option value="walking">步行</option>
          <option value="cycling">骑行</option>
          <option value="fitness">健身</option>
          <option value="ball">球类</option>
          <option value="other">其他</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <FieldInput hint="分钟" label="时长" min={1} onChange={(event) => setDurationMin(Number(event.target.value))} placeholder="35" type="number" value={durationMin} />
        <label className="block text-sm text-white/78" htmlFor="exercise-intensity">
          <span className="mb-2 block">强度</span>
          <select
            className="h-11 w-full rounded-glass border border-white/15 bg-black/18 px-3 text-white outline-none transition focus:border-dimension-exercise/70 focus:bg-black/24 focus:ring-2 focus:ring-dimension-exercise/20"
            id="exercise-intensity"
            onChange={(event) => setIntensity(event.target.value as Intensity)}
            value={intensity}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldInput hint="可选" label="步数" min={0} onChange={(event) => setSteps(Number(event.target.value))} placeholder="8200" type="number" value={steps} />
        <FieldInput hint="bpm" label="心率" max={250} min={30} onChange={(event) => setHeartRate(Number(event.target.value))} placeholder="92" type="number" value={heartRate} />
      </div>
      <PillButton disabled={isSubmitting} type="submit" variant="color">
        {isSubmitting ? '记录中...' : '记录今日'}
      </PillButton>
      {message ? <Toast message={message} /> : null}
      {error ? <Toast message={error} tone="info" /> : null}
    </form>
  )
}

export default ExerciseForm
