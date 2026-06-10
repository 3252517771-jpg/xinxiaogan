import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function HealthForm() {
  return (
    <form className="space-y-4">
      <FieldInput label="收缩压" type="number" />
      <FieldInput label="舒张压" type="number" />
      <FieldInput label="心率" type="number" />
      <PillButton>记录今日</PillButton>
    </form>
  )
}

export default HealthForm
