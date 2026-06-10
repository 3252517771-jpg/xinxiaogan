import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function ExerciseForm() {
  return (
    <form className="space-y-4">
      <FieldInput label="运动类型" />
      <FieldInput label="运动时长" type="number" />
      <FieldInput label="步数" type="number" />
      <PillButton>记录今日</PillButton>
    </form>
  )
}

export default ExerciseForm
