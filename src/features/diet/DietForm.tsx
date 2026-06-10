import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function DietForm() {
  return (
    <form className="space-y-4">
      <FieldInput label="餐次" />
      <FieldInput label="食物描述" />
      <FieldInput label="热量" type="number" />
      <PillButton>记录今日</PillButton>
    </form>
  )
}

export default DietForm
