import { assetUrl } from '@/config/assetUrls'

interface BackgroundLayerProps {
  image?: string
  video?: string
}

function BackgroundLayer({ image = '首页图.png', video }: BackgroundLayerProps) {
  return (
    <div className="fixed inset-0 -z-10 bg-forest-deep">
      {video ? (
        <video
          autoPlay
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          poster={assetUrl(image)}
          src={assetUrl(video)}
        />
      ) : (
        <img alt="" className="h-full w-full object-cover" src={assetUrl(image)} />
      )}
    </div>
  )
}

export default BackgroundLayer
