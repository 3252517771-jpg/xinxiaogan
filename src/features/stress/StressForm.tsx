import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function StressForm() {
  return (
    <form className="space-y-4">
      <FieldInput hint="1-10" label="压力评分" max={10} min={1} placeholder="4" type="number" />
      <FieldInput hint="1-10" label="焦虑评分" max={10} min={1} placeholder="3" type="number" />
      <FieldInput hint="calm/relaxed" label="情绪标签" placeholder="calm" />
      <PillButton variant="color">记录今日</PillButton>
    </form>
  )
}

export default StressForm
