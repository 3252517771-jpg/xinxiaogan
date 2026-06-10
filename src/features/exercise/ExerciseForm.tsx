import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function ExerciseForm() {
  return (
    <form className="space-y-4">
      <FieldInput hint="walking/running" label="运动类型" placeholder="walking" />
      <FieldInput hint="分钟" label="运动时长" min={1} placeholder="35" type="number" />
      <FieldInput hint="可选" label="步数" min={0} placeholder="8200" type="number" />
      <PillButton variant="color">记录今日</PillButton>
    </form>
  )
}

export default ExerciseForm
