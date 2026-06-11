import { useEffect, useState } from 'react'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { request } from '@/services/api'
import type { UserProfile } from '@/types/user'

const DEFAULT_PROFILE: UserProfile = {
  id: 'mock-profile',
  user_id: 'mock-user',
  nickname: '小洋裙',
  age: 26,
  gender: 'female',
  height_cm: 167,
  weight_kg: 52,
  timezone: 'Asia/Shanghai',
}

interface ProfileFormProps {
  formId?: string
  onSaved?: () => void
}

function ProfileForm({ formId = 'profile-form', onSaved }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [message, setMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function updateProfile<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)

    try {
      const response = await request<UserProfile>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      })
      setProfile(response)
      setMessage('资料已保存，已同步到当前本地档案。')
      onSaved?.()
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : '资料保存失败'
      setMessage(nextMessage)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (!message) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setMessage(null)
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [message])

  return (
    <form className="space-y-5" id={formId} onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <FieldInput label="昵称" onChange={(event) => updateProfile('nickname', event.target.value)} value={profile.nickname ?? ''} />
        <FieldInput label="年龄" min={1} onChange={(event) => updateProfile('age', Number(event.target.value) || null)} type="number" value={profile.age ?? ''} />
        <label className="block text-sm text-white/78" htmlFor="profile-gender">
          <span className="mb-2 flex items-center justify-between gap-3">
            <span>性别</span>
            <span className="text-xs text-white/42">用于个性化提示</span>
          </span>
          <select
            className="h-11 w-full rounded-glass border border-white/15 bg-black/18 px-3 text-white outline-none transition focus:border-dimension-exercise/70 focus:bg-black/24 focus:ring-2 focus:ring-dimension-exercise/20"
            id="profile-gender"
            onChange={(event) => updateProfile('gender', event.target.value as UserProfile['gender'])}
            value={profile.gender ?? 'other'}
          >
            <option value="female">女</option>
            <option value="male">男</option>
            <option value="other">其他</option>
          </select>
        </label>
        <FieldInput
          hint="cm"
          label="身高"
          min={50}
          onChange={(event) => updateProfile('height_cm', Number(event.target.value) || null)}
          type="number"
          value={profile.height_cm ?? ''}
        />
        <FieldInput
          hint="kg"
          label="体重"
          min={20}
          onChange={(event) => updateProfile('weight_kg', Number(event.target.value) || null)}
          step="0.1"
          type="number"
          value={profile.weight_kg ?? ''}
        />
        <FieldInput
          hint="IANA"
          label="时区"
          onChange={(event) => updateProfile('timezone', event.target.value)}
          value={profile.timezone}
        />
      </div>
      <div className="flex items-center justify-between gap-4 rounded-glass border border-white/12 bg-white/6 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">资料概览</p>
          <p className="text-xs text-white/52">昵称、体征与时区会影响个人提示与历史展示。</p>
        </div>
        <PillButton type="submit" variant="color">
          {isSaving ? '保存中...' : '保存资料'}
        </PillButton>
      </div>
      {message ? <Toast message={message} /> : null}
    </form>
  )
}

export default ProfileForm
