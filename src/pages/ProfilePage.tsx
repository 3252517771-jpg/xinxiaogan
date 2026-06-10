import BackgroundLayer from '@/components/background/BackgroundLayer'
import Navbar from '@/components/layout/Navbar'
import PageHeader from '@/components/layout/PageHeader'
import PageTransition from '@/components/transitions/PageTransition'
import GlassCard from '@/components/ui/GlassCard'
import ApiIntegration from '@/features/profile/ApiIntegration'
import DataExport from '@/features/profile/DataExport'
import HistoryList from '@/features/profile/HistoryList'
import ProfileForm from '@/features/profile/ProfileForm'

function ProfilePage() {
  return (
    <>
      <BackgroundLayer />
      <Navbar />
      <PageTransition>
        <PageHeader title="个人主页" />
        <div className="grid grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <GlassCard title="个人资料">
              <ProfileForm />
            </GlassCard>
            <HistoryList />
          </div>
          <div className="space-y-6">
            <GlassCard title="数据导出">
              <DataExport />
            </GlassCard>
            <ApiIntegration />
          </div>
        </div>
      </PageTransition>
    </>
  )
}

export default ProfilePage
