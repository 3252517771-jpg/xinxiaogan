import { ROUTES } from '@/config/routes'
import SlimTag from '@/components/ui/SlimTag'
import ScoreBadge from '@/components/ui/ScoreBadge'
import PillNav from '@/components/layout/PillNav'

interface NavbarProps {
  locked?: boolean
  onLoginClick?: () => void
}

function Navbar({ locked = false, onLoginClick }: NavbarProps) {
  const items = locked
    ? [
        { label: '首页', href: ROUTES.HOME },
        { label: '登录', href: ROUTES.HOME, ariaLabel: '打开登录', onClick: onLoginClick },
      ]
    : [
        { label: '首页', href: ROUTES.HOME },
        { label: '个人主页', href: ROUTES.PROFILE },
      ]

  return (
    <header className="fixed left-0 right-0 top-0 z-20 pointer-events-none">
      <PillNav className="pointer-events-auto" items={items} />
      <div className="pointer-events-auto absolute left-1/2 top-24 flex -translate-x-1/2 items-center gap-2">
        {locked ? (
          <SlimTag active label="早上好，先登录" />
        ) : (
          <>
            <SlimTag active label="早上好" />
            <ScoreBadge label="综合" score={82} />
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
