import { useState } from 'react'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { useMockSubmit } from '@/hooks/useMockSubmit'
import type { DietRecord, HealthMutationResponse } from '@/types/health'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface DietPayload {
  meal_type: MealType
  food_description: string
  calories: number
}

interface DietFormProps {
  onSubmitted?: (response: HealthMutationResponse<DietRecord>) => void
}

function DietForm({ onSubmitted }: DietFormProps) {
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [foodDescription, setFoodDescription] = useState('米饭、鸡胸肉、青菜')
  const [calories, setCalories] = useState(680)
  const { isSubmitting, message, error, submit } = useMockSubmit<DietPayload, DietRecord>('/health/diet')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const response = await submit({
      meal_type: mealType,
      food_description: foodDescription,
      calories,
    })

    if (response) {
      onSubmitted?.(response)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm text-white/78" htmlFor="meal-type">
        <span className="mb-2 flex items-center justify-between gap-3">
          <span>餐次</span>
          <span className="text-xs text-white/42">早/中/晚/加餐</span>
        </span>
        <select
          className="h-11 w-full rounded-glass border border-white/15 bg-black/18 px-3 text-white outline-none transition focus:border-dimension-exercise/70 focus:bg-black/24 focus:ring-2 focus:ring-dimension-exercise/20"
          id="meal-type"
          onChange={(event) => setMealType(event.target.value as MealType)}
          value={mealType}
        >
          <option value="breakfast">早餐</option>
          <option value="lunch">午餐</option>
          <option value="dinner">晚餐</option>
          <option value="snack">加餐</option>
        </select>
      </label>
      <FieldInput label="食物描述" onChange={(event) => setFoodDescription(event.target.value)} placeholder="米饭、鸡胸肉、青菜" value={foodDescription} />
      <FieldInput hint="kcal" label="热量" min={0} onChange={(event) => setCalories(Number(event.target.value))} placeholder="680" type="number" value={calories} />
      <PillButton disabled={isSubmitting} type="submit" variant="color">
        {isSubmitting ? '记录中...' : '记录今日'}
      </PillButton>
      {message ? <Toast message={message} /> : null}
      {error ? <Toast message={error} tone="info" /> : null}
    </form>
  )
}

export default DietForm
