import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function DietForm() {
  return (
    <form className="space-y-4">
      <FieldInput hint="breakfast/lunch" label="餐次" placeholder="lunch" />
      <FieldInput label="食物描述" placeholder="米饭、鸡胸肉、青菜" />
      <FieldInput hint="kcal" label="热量" min={0} placeholder="680" type="number" />
      <PillButton variant="color">记录今日</PillButton>
    </form>
  )
}

export default DietForm
