import GlassCard from '@/components/ui/GlassCard'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

interface AuthModalProps {
  onLogin: () => void
}

function AuthModal({ onLogin }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-forest-deep/58 px-6 backdrop-blur-sm">
      <div className="w-[420px] fade-scale-in">
        <GlassCard eyebrow="XiaoXinGan" title="登录">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              onLogin()
            }}
          >
            <FieldInput autoComplete="username" label="用户名" placeholder="xiaoyangqun" />
            <FieldInput autoComplete="current-password" label="密码" placeholder="输入任意密码体验 M4 首页" type="password" />
            <PillButton className="w-full" type="submit">登录</PillButton>
            <p className="text-center text-xs text-white/45">M4 使用 Mock 登录解锁首页，真实 JWT 流程留到 M7。</p>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}

export default AuthModal
