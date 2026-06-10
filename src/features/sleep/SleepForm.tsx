import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import StarRating from '@/components/ui/StarRating'

function SleepForm() {
  return (
    <form className="space-y-4">
      <FieldInput hint="建议 23:00 前" label="入睡时间" type="time" />
      <FieldInput hint="保持固定节律" label="起床时间" type="time" />
      <FieldInput label="中断次数" min={0} placeholder="0" type="number" />
      <div className="flex items-center justify-between rounded-glass border border-white/12 bg-black/12 px-3 py-3">
        <span className="text-sm text-white/72">睡眠质量</span>
        <StarRating value={4} />
      </div>
      <PillButton variant="color">记录今日</PillButton>
    </form>
  )
}

export default SleepForm
