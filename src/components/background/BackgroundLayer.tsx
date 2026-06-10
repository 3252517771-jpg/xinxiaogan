import { assetUrl } from '@/config/assetUrls'

interface BackgroundLayerProps {
  image?: string
}

function BackgroundLayer({ image = '首页图.png' }: BackgroundLayerProps) {
  return (
    <div className="fixed inset-0 -z-10 bg-forest-deep">
      <img alt="" className="h-full w-full object-cover opacity-60" src={assetUrl(image)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,28,21,0.72)_72%)]" />
    </div>
  )
}

export default BackgroundLayer
