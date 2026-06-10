import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function SleepForm() {
  return (
    <form className="space-y-4">
      <FieldInput label="入睡时间" type="time" />
      <FieldInput label="起床时间" type="time" />
      <FieldInput label="中断次数" type="number" />
      <PillButton>记录今日</PillButton>
    </form>
  )
}

export default SleepForm
