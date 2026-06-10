import GlassCard from '@/components/ui/GlassCard'
import FieldInput from '@/components/ui/FieldInput'
import PillButton from '@/components/ui/PillButton'

function AuthModal() {
  return (
    <GlassCard title="登录">
      <div className="space-y-4">
        <FieldInput label="用户名" />
        <FieldInput label="密码" type="password" />
        <PillButton>登录</PillButton>
      </div>
    </GlassCard>
  )
}

export default AuthModal
