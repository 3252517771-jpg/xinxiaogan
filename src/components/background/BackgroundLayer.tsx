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
  const [isVideoReady, setIsVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const replayTimeoutRef = useRef<number | null>(null)
  const readyTimeoutRef = useRef<number | null>(null)
  const playStartedRef = useRef(false)

  useEffect(() => {
    if (scene?.source) {
      setActiveVideoSrc(scene.source)
      return
    }

    setActiveVideoSrc(video ? assetUrl(video) : null)
  }, [scene?.source, video])

  const startVideoWhenBuffered = () => {
    const node = videoRef.current
    if (!node || playStartedRef.current) {
      return
    }

    const bufferedEnd = node.buffered.length > 0 ? node.buffered.end(node.buffered.length - 1) : 0
    const hasEnoughBuffer = node.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA || bufferedEnd >= Math.min(2, node.duration || 2)

    if (!hasEnoughBuffer) {
      return
    }

    if (readyTimeoutRef.current) {
      window.clearTimeout(readyTimeoutRef.current)
      readyTimeoutRef.current = null
    }

    playStartedRef.current = true
    setIsVideoReady(true)
    void node.play().catch(() => {})
  }

  useEffect(() => {
    const node = videoRef.current
    if (!node) {
      return
    }

    setIsVideoReady(false)
    playStartedRef.current = false

    if (replayTimeoutRef.current) {
      window.clearTimeout(replayTimeoutRef.current)
      replayTimeoutRef.current = null
    }

    if (readyTimeoutRef.current) {
      window.clearTimeout(readyTimeoutRef.current)
      readyTimeoutRef.current = null
    }

    node.loop = scene?.loop ?? true
    node.currentTime = 0
    node.pause()
    node.load()

    readyTimeoutRef.current = window.setTimeout(() => {
      playStartedRef.current = true
      setIsVideoReady(true)
      void node.play().catch(() => {})
      readyTimeoutRef.current = null
    }, 3200)
  }, [activeVideoSrc, scene?.loop])

  useEffect(() => {
    return () => {
      if (replayTimeoutRef.current) {
        window.clearTimeout(replayTimeoutRef.current)
      }
      if (readyTimeoutRef.current) {
        window.clearTimeout(readyTimeoutRef.current)
      }
    }
  }, [])

  const poster = scene?.poster ?? assetUrl(image)
  const videoClassName = scene?.filterClassName
    ? `h-full w-full object-cover transition-all duration-300 ${scene.filterClassName}`
    : 'h-full w-full object-cover transition-all duration-300'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-forest-deep">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={poster} />
      {activeVideoSrc ? (
        <video
          className={`${videoClassName} relative opacity-0 ${isVideoReady ? 'opacity-100' : ''}`.trim()}
          muted
          onCanPlayThrough={() => {
            startVideoWhenBuffered()
          }}
          onProgress={() => {
            startVideoWhenBuffered()
          }}
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

            if (scene?.cycleDurationMs && !scene.freezeOnEnd) {
              const node = videoRef.current
              if (node) {
                const durationMs = Number.isFinite(node.duration) ? node.duration * 1000 : 0
                const waitMs = Math.max(0, scene.cycleDurationMs - durationMs)

                replayTimeoutRef.current = window.setTimeout(() => {
                  const replayNode = videoRef.current
                  if (!replayNode) {
                    return
                  }

                  replayNode.currentTime = 0
                  void replayNode.play().catch(() => {})
                  replayTimeoutRef.current = null
                }, waitMs)
              }
            }

            if (scene && !scene.freezeOnEnd && !scene.cycleDurationMs) {
              onSceneEnded?.(scene.state)
            }
          }}
          playsInline
          poster={poster}
          preload="metadata"
          ref={videoRef}
          src={activeVideoSrc}
        />
      ) : (
        null
      )}
    </div>
  )
}

export default BackgroundLayer
