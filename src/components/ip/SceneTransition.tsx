import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assetUrl } from '@/config/assetUrls'
import { useTransitionStore } from '@/store/transitionStore'

function SceneTransition() {
  const navigate = useNavigate()
  const { pendingTransition, clearTransition } = useTransitionStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!pendingTransition) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)
  }, [pendingTransition])

  if (!pendingTransition || !isVisible) {
    return null
  }

  return (
    <div className="scene-transition-layer fixed inset-0 z-40 overflow-hidden bg-forest-deep/18">
      <video
        autoPlay
        className="h-full w-full object-cover"
        muted
        onEnded={() => {
          setIsVisible(false)
          navigate(pendingTransition.targetPath)
          clearTransition()
        }}
        playsInline
        src={assetUrl(pendingTransition.video)}
      />
    </div>
  )
}

export default SceneTransition
