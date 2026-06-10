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
          className="h-full w-full object-cover opacity-64"
          loop
          muted
          playsInline
          poster={assetUrl(image)}
          src={assetUrl(video)}
        />
      ) : (
        <img alt="" className="h-full w-full object-cover opacity-64" src={assetUrl(image)} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,28,21,0.82)_0%,rgba(15,28,21,0.36)_48%,rgba(15,28,21,0.78)_100%)]" />
      <div className="surface-grid absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,28,21,0.72)_76%)]" />
    </div>
  )
}

export default BackgroundLayer
