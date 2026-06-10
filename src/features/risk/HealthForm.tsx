import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function HealthForm() {
  return (
    <form className="space-y-4">
      <FieldInput hint="mmHg" label="收缩压" max={250} min={60} placeholder="118" type="number" />
      <FieldInput hint="mmHg" label="舒张压" max={150} min={30} placeholder="76" type="number" />
      <FieldInput hint="bpm" label="心率" max={250} min={30} placeholder="72" type="number" />
      <PillButton variant="color">记录今日</PillButton>
    </form>
  )
}

export default HealthForm
