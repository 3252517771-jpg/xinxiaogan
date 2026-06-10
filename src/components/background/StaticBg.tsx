import { assetUrl } from '@/config/assetUrls'

interface StaticBgProps {
  src: string
}

function StaticBg({ src }: StaticBgProps) {
  return <img alt="" className="h-full w-full object-cover" src={assetUrl(src)} />
}

export default StaticBg
