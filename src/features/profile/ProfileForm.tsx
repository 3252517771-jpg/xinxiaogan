import { useEffect, useState } from 'react'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import Toast from '@/components/ui/Toast'
import { pushTest, request } from '@/services/api'
import type { UserProfile } from '@/types/user'

type ProfileDraft = Omit<UserProfile, 'id' | 'user_id'>

const EMPTY_PROFILE: ProfileDraft = {
  nickname: null,
  age: null,
  gender: null,
  height_cm: null,
  weight_kg: null,
  timezone: 'Asia/Shanghai',
  wechat_sendkey: null,
  enable_ai_advice: true,
  enable_push: false,
}

interface ProfileFormProps {
  formId?: string
  onSaved?: () => void
}

function ProfileForm({ formId = 'profile-form', onSaved }: ProfileFormProps) {
  const [profile, setProfile] = useState<ProfileDraft>(EMPTY_PROFILE)
  const [message, setMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isTestingPush, setIsTestingPush] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSavedSendKey, setHasSavedSendKey] = useState(false)

  function updateProfile<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) {
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
      setProfile({
        nickname: response.nickname,
        age: response.age,
        gender: response.gender,
        height_cm: response.height_cm,
        weight_kg: response.weight_kg,
        timezone: response.timezone,
        wechat_sendkey: null,
        enable_ai_advice: response.enable_ai_advice,
        enable_push: response.enable_push,
      })
      setHasSavedSendKey(Boolean(response.has_wechat_sendkey))
      setMessage('资料已保存，当前档案和 AI 设置已同步。')
      onSaved?.()
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : '资料保存失败'
      setMessage(nextMessage)
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePushTest() {
    setIsTestingPush(true)

    try {
      const result = await pushTest()
      setMessage(result.message)
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : '推送测试失败'
      setMessage(nextMessage)
    } finally {
      setIsTestingPush(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      setIsLoading(true)
      try {
        const response = await request<UserProfile>('/user/profile')
        if (!isMounted) {
          return
        }
        setProfile({
          nickname: response.nickname,
          age: response.age,
          gender: response.gender,
          height_cm: response.height_cm,
          weight_kg: response.weight_kg,
          timezone: response.timezone,
          wechat_sendkey: null,
          enable_ai_advice: response.enable_ai_advice,
          enable_push: response.enable_push,
        })
        setHasSavedSendKey(Boolean(response.has_wechat_sendkey))
      } catch (error) {
        if (isMounted) {
          setMessage(error instanceof Error ? error.message : '资料加载失败')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

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
      {isLoading ? <Toast message="正在读取当前用户资料..." tone="info" /> : null}
      <div className="grid grid-cols-2 gap-4">
        <FieldInput label="昵称" onChange={(event) => updateProfile('nickname', event.target.value)} value={profile.nickname ?? ''} />
        <FieldInput label="年龄" min={1} onChange={(event) => updateProfile('age', Number(event.target.value) || null)} type="number" value={profile.age ?? ''} />
        <label className="block text-sm text-white/78" htmlFor="profile-gender">
          <span className="mb-2 flex items-center justify-between gap-3">
        <span>性别</span>
            <span className="text-xs text-white/42">可选补充</span>
          </span>
          <select
            className="h-11 w-full rounded-glass border border-white/15 bg-black/18 px-3 text-white outline-none transition focus:border-dimension-exercise/70 focus:bg-black/24 focus:ring-2 focus:ring-dimension-exercise/20"
            id="profile-gender"
            onChange={(event) => updateProfile('gender', event.target.value as UserProfile['gender'])}
            value={profile.gender ?? ''}
          >
            <option value="">暂不填写</option>
            <option value="female">女</option>
            <option value="male">男</option>
            <option value="other">其他</option>
          </select>
        </label>
        <FieldInput hint="cm" label="身高" min={50} onChange={(event) => updateProfile('height_cm', Number(event.target.value) || null)} type="number" value={profile.height_cm ?? ''} />
        <FieldInput hint="kg" label="体重" min={20} onChange={(event) => updateProfile('weight_kg', Number(event.target.value) || null)} step="0.1" type="number" value={profile.weight_kg ?? ''} />
        <FieldInput hint="IANA" label="时区" onChange={(event) => updateProfile('timezone', event.target.value)} value={profile.timezone} />
      </div>
      <FieldInput
        hint={hasSavedSendKey ? '已绑定，填写新 SendKey 可覆盖' : 'SCT...'}
        label="SendKey"
        onChange={(event) => updateProfile('wechat_sendkey', event.target.value || null)}
        value={profile.wechat_sendkey ?? ''}
      />
      <div className="flex items-center justify-between gap-4 rounded-glass border border-white/12 bg-white/6 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">微信推送测试</p>
          <p className="text-xs text-white/52">先保存 SendKey，再发送一条 Server 酱测试消息。</p>
        </div>
        <PillButton disabled={isLoading || isTestingPush || (!hasSavedSendKey && !profile.wechat_sendkey)} onClick={handlePushTest} type="button" variant="outline">
          {isTestingPush ? '测试中...' : '测试推送'}
        </PillButton>
      </div>
      <div className="grid grid-cols-2 gap-4 rounded-glass border border-white/12 bg-white/6 px-4 py-4">
        <label className="flex items-center justify-between gap-4 text-sm text-white/78">
          <span>
            <span className="block font-semibold text-white">AI 个性化建议</span>
            <span className="block text-xs text-white/48">控制 S3 详情页是否优先调用 DeepSeek。</span>
          </span>
          <input
            checked={profile.enable_ai_advice ?? true}
            className="h-4 w-4 accent-dimension-exercise"
            onChange={(event) => updateProfile('enable_ai_advice', event.target.checked)}
            type="checkbox"
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm text-white/78">
          <span>
            <span className="block font-semibold text-white">微信推送预留</span>
            <span className="block text-xs text-white/48">S4 会接入定时提醒，这里先保留开关。</span>
          </span>
          <input
            checked={profile.enable_push ?? false}
            className="h-4 w-4 accent-dimension-exercise"
            onChange={(event) => updateProfile('enable_push', event.target.checked)}
            type="checkbox"
          />
        </label>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-glass border border-white/12 bg-white/6 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">资料概览</p>
          <p className="text-xs text-white/52">未填写的资料会保持为空，不会使用模板值补齐。</p>
        </div>
        <PillButton disabled={isLoading || isSaving} type="submit" variant="color">
          {isSaving ? '保存中...' : '保存资料'}
        </PillButton>
      </div>
      {message ? <Toast message={message} /> : null}
    </form>
  )
}

export default ProfileForm
