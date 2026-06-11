import { useState } from 'react'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { request } from '@/services/api'
import type { RiskMutationResponse } from '@/types/health'

interface HealthFormProps {
  onSubmitted?: (result: RiskMutationResponse) => void
}

function HealthForm({ onSubmitted }: HealthFormProps) {
  const [systolicBp, setSystolicBp] = useState(118)
  const [diastolicBp, setDiastolicBp] = useState(76)
  const [heartRate, setHeartRate] = useState(72)
  const [bloodGlucose, setBloodGlucose] = useState(5.2)
  const [waistCm, setWaistCm] = useState(78)
  const [cholesterol, setCholesterol] = useState(4.6)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      const response = await request<RiskMutationResponse>('/health/risk', {
        method: 'POST',
        body: JSON.stringify({
          systolic_bp: systolicBp,
          diastolic_bp: diastolicBp,
          heart_rate: heartRate,
          blood_glucose: bloodGlucose,
          waist_cm: waistCm,
          cholesterol,
        }),
      })
      setMessage(`已记录，当前评分 ${response.score}`)
      onSubmitted?.(response)
    } catch (submitError) {
      const nextError = submitError instanceof Error ? submitError.message : '提交失败'
      setError(nextError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <FieldInput hint="mmHg" label="收缩压" max={250} min={60} onChange={(event) => setSystolicBp(Number(event.target.value))} placeholder="118" type="number" value={systolicBp} />
        <FieldInput hint="mmHg" label="舒张压" max={150} min={30} onChange={(event) => setDiastolicBp(Number(event.target.value))} placeholder="76" type="number" value={diastolicBp} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldInput hint="bpm" label="静息心率" max={250} min={30} onChange={(event) => setHeartRate(Number(event.target.value))} placeholder="72" type="number" value={heartRate} />
        <FieldInput hint="mmol/L" label="血糖值" max={30} min={1} onChange={(event) => setBloodGlucose(Number(event.target.value))} placeholder="5.2" step="0.1" type="number" value={bloodGlucose} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldInput hint="cm" label="腰围" max={200} min={0} onChange={(event) => setWaistCm(Number(event.target.value))} placeholder="78" step="0.1" type="number" value={waistCm} />
        <FieldInput hint="mmol/L" label="胆固醇" max={20} min={0} onChange={(event) => setCholesterol(Number(event.target.value))} placeholder="4.6" step="0.1" type="number" value={cholesterol} />
      </div>
      <PillButton disabled={isSubmitting} type="submit" variant="color">
        {isSubmitting ? '记录中...' : '记录今日'}
      </PillButton>
      {message ? <Toast message={message} /> : null}
      {error ? <Toast message={error} tone="info" /> : null}
    </form>
  )
}

export default HealthForm
