import BackgroundLayer from '@/components/background/BackgroundLayer'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import PillButton from '@/components/ui/PillButton'
import ScoreBadge from '@/components/ui/ScoreBadge'
import ApiIntegration from '@/features/profile/ApiIntegration'
import DataExport from '@/features/profile/DataExport'
import HistoryList from '@/features/profile/HistoryList'
import ProfileForm from '@/features/profile/ProfileForm'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

function ProfilePage() {
  return (
    <>
      <BackgroundLayer image="图一.png" />
      <div className="fixed inset-0 -z-0 bg-[rgba(223,228,223,0.62)] backdrop-blur-[2px]" />
      <PageTransition>
        <div className="mx-auto max-w-[1380px] space-y-8 pt-12">
          <header className="flex items-start justify-between gap-6 rounded-[28px] border border-black/6 bg-[rgba(240,243,240,0.92)] px-8 py-7 text-forest-deep shadow-[0_24px_80px_rgba(6,14,10,0.12)] backdrop-blur-md">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-forest-deep/45">Personal Hub</p>
              <h1 className="text-5xl font-semibold leading-none">个人中心</h1>
              <p className="max-w-[680px] text-sm leading-7 text-forest-deep/62">
                在这里维护你的个人资料、回看健康历史，并导出当前阶段的记录快照。
              </p>
            </div>
            <div className="flex items-center gap-3 self-start">
              <ScoreBadge label="综合" score={82} />
              <Link to={ROUTES.HOME}>
                <PillButton className="border-black/10 text-forest-deep hover:border-black/18 hover:bg-black/5" variant="outline">
                  返回首页
                </PillButton>
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div className="space-y-6">
              <GlassCard className="bg-[rgba(20,28,22,0.68)]" title="个人资料编辑">
                <ProfileForm formId="profile-main-form" />
              </GlassCard>
              <HistoryList />
            </div>

            <aside className="space-y-6">
              <GlassCard className="bg-[rgba(20,28,22,0.68)]" title="数据导出">
                <DataExport />
              </GlassCard>
              <ApiIntegration />
              <GlassCard title="当前档案摘要">
                <div className="space-y-3 text-sm text-white/68">
                  <div className="flex items-center justify-between">
                    <span>最近更新</span>
                    <span>2026-06-11</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>已记录维度</span>
                    <span>5 / 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>导出状态</span>
                    <span>Mock 可用</span>
                  </div>
                </div>
              </GlassCard>
            </aside>
          </div>
        </div>
      </PageTransition>
    </>
  )
}

export default ProfilePage
