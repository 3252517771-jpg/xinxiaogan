import FieldInput from '@/components/ui/FieldInput'

function ProfileForm() {
  return (
    <form className="grid grid-cols-2 gap-4">
      <FieldInput label="昵称" />
      <FieldInput label="年龄" type="number" />
      <FieldInput label="身高" type="number" />
      <FieldInput label="体重" type="number" />
    </form>
  )
}

export default ProfileForm
