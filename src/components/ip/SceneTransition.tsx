import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { assetUrl } from '@/config/assetUrls'
import { useTransitionStore } from '@/store/transitionStore'

function SceneTransition() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pendingTransition, clearTransition } = useTransitionStore()
  const [isVisible, setIsVisible] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const settleTimeoutRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const transitionSrc = useMemo(
    () => (pendingTransition ? assetUrl(pendingTransition.video) : null),
    [pendingTransition],
  )

  useEffect(() => {
    if (!pendingTransition) {
      setIsVisible(false)
      setIsNavigating(false)
      setIsVideoReady(false)
      return
    }

    setIsVisible(true)
    setIsVideoReady(false)
  }, [pendingTransition])

  useEffect(() => {
    if (!isNavigating || !pendingTransition) {
      return
    }

    if (location.pathname === pendingTransition.targetPath) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          settleTimeoutRef.current = window.setTimeout(() => {
            setIsVisible(false)
            setIsNavigating(false)
            clearTransition()
            settleTimeoutRef.current = null
          }, 80)
        })
      })
    }
  }, [clearTransition, isNavigating, location.pathname, pendingTransition])

  useEffect(() => {
    return () => {
      if (settleTimeoutRef.current) {
        window.clearTimeout(settleTimeoutRef.current)
      }
    }
  }, [])

  if (!pendingTransition || !isVisible || !transitionSrc) {
    return null
  }

  return (
    <div className="scene-transition-layer fixed inset-0 z-40 overflow-hidden bg-transparent">
      <video
        autoPlay
        className={`h-full w-full object-cover transition-opacity duration-150 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`.trim()}
        muted
        onLoadedData={() => {
          setIsVideoReady(true)
        }}
        onEnded={() => {
          if (isNavigating) {
            return
          }

          setIsNavigating(true)
          navigate(pendingTransition.targetPath)
        }}
        preload="auto"
        playsInline
        ref={videoRef}
        src={transitionSrc}
      />
    </div>
  )
}

export default SceneTransition
