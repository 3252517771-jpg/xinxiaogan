import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function StressForm() {
  return (
    <form className="space-y-4">
      <FieldInput label="压力评分" type="number" />
      <FieldInput label="焦虑评分" type="number" />
      <FieldInput label="情绪标签" />
      <PillButton>记录今日</PillButton>
    </form>
  )
}

export default StressForm
