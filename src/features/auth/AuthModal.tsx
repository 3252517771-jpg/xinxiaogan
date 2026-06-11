import { useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import { login } from '@/services/auth'

interface AuthModalProps {
  onLogin: () => void
}

function AuthModal({ onLogin }: AuthModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const username = String(formData.get('username') ?? 'xiaoyangqun')
      const password = String(formData.get('password') ?? '')
      const token = await login({ username, password })
      localStorage.setItem('token', token.access_token)
      onLogin()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '登录失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-forest-deep/58 px-6 backdrop-blur-sm">
      <div className="w-[420px] fade-scale-in">
        <GlassCard eyebrow="XiaoXinGan" title="登录">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FieldInput autoComplete="username" label="用户名" name="username" placeholder="xiaoyangqun" />
            <FieldInput
              autoComplete="current-password"
              label="密码"
              name="password"
              placeholder="输入任意密码体验 Mock API"
              type="password"
            />
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            <PillButton className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? '登录中...' : '登录'}
            </PillButton>
            <p className="text-center text-xs text-white/45">M5 使用 Mock API 返回 token，完整 JWT 鉴权流程留到 M7。</p>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}

export default AuthModal
