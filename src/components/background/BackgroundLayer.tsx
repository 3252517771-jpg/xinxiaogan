import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '@/config/assetUrls'
import type { VideoScene } from '@/types/ip'

interface BackgroundLayerProps {
  image?: string
  video?: string
  scene?: VideoScene
  onSceneEnded?: (state: VideoScene['state']) => void
}

function BackgroundLayer({ image = '首页图.png', video, scene, onSceneEnded }: BackgroundLayerProps) {
  const [activeVideoSrc, setActiveVideoSrc] = useState<string | null>(scene?.source ?? (video ? assetUrl(video) : null))
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (scene?.source) {
      setActiveVideoSrc(scene.source)
      return
    }

    setActiveVideoSrc(video ? assetUrl(video) : null)
  }, [scene?.source, video])

  useEffect(() => {
    const node = videoRef.current
    if (!node) {
      return
    }

    node.loop = scene?.loop ?? true
    node.currentTime = 0

    void node.play().catch(() => {})
  }, [activeVideoSrc, scene?.loop])

  const poster = scene?.poster ?? assetUrl(image)
  const videoClassName = scene?.filterClassName
    ? `h-full w-full object-cover transition-all duration-300 ${scene.filterClassName}`
    : 'h-full w-full object-cover transition-all duration-300'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-forest-deep">
      {activeVideoSrc ? (
        <video
          autoPlay
          className={videoClassName}
          muted
          onEnded={() => {
            if (scene?.freezeOnEnd) {
              const node = videoRef.current
              if (node) {
                const safeTime = Math.max(0, node.duration - 0.05)
                if (Number.isFinite(safeTime)) {
                  node.currentTime = safeTime
                }
                node.pause()
              }
            }

            if (scene && !scene.freezeOnEnd) {
              onSceneEnded?.(scene.state)
            }
          }}
          playsInline
          poster={poster}
          ref={videoRef}
          src={activeVideoSrc}
        />
      ) : (
        <img alt="" className="h-full w-full object-cover" src={poster} />
      )}
    </div>
  )
}

export default BackgroundLayer
