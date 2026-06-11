import { useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'
import { useAuth } from '@/hooks/useAuth'

interface AuthModalProps {
  onAuthenticated: (mode: AuthMode) => void
}

type AuthMode = 'login' | 'register'

function AuthModal({ onAuthenticated }: AuthModalProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const username = String(formData.get('username') ?? '').trim()
      const password = String(formData.get('password') ?? '')

      if (mode === 'register') {
        const confirmPassword = String(formData.get('confirm_password') ?? '')
        await register({ username, password, confirm_password: confirmPassword })
      } else {
        await login({ username, password })
      }

      onAuthenticated(mode)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '认证失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-forest-deep/58 px-6 backdrop-blur-sm">
      <div className="w-[420px] fade-scale-in">
        <GlassCard eyebrow="XiaoXinGan" title={mode === 'login' ? '登录' : '注册'}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FieldInput autoComplete="username" label="用户名" name="username" placeholder="至少 3 位用户名" />
            <FieldInput
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              label="密码"
              name="password"
              placeholder="至少 6 位密码"
              type="password"
            />
            {mode === 'register' ? (
              <FieldInput
                autoComplete="new-password"
                label="确认密码"
                name="confirm_password"
                placeholder="再次输入密码"
                type="password"
              />
            ) : null}
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            <PillButton className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? '处理中...' : mode === 'login' ? '登录' : '注册并登录'}
            </PillButton>
            <button
              className="w-full text-center text-xs text-white/55 transition hover:text-white"
              type="button"
              onClick={() => {
                setError(null)
                setMode((currentMode) => (currentMode === 'login' ? 'register' : 'login'))
              }}
            >
              {mode === 'login' ? '还没有账号？注册' : '已有账号？返回登录'}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}

export default AuthModal
