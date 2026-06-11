import type { SpringOptions } from 'motion/react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import type { CSSProperties, ComponentProps, ReactNode } from 'react'
import './TiltedCard.css'

interface TiltedCardProps {
  imageSrc?: ComponentProps<'img'>['src']
  altText?: string
  captionText?: string
  containerHeight?: CSSProperties['height']
  containerWidth?: CSSProperties['width']
  imageHeight?: CSSProperties['height']
  imageWidth?: CSSProperties['width']
  scaleOnHover?: number
  rotateAmplitude?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  overlayContent?: ReactNode
  displayOverlayContent?: boolean
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
}

function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.04,
  rotateAmplitude = 8,
  showMobileWarning = false,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)
  const opacity = useSpring(0)
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  })

  const [lastY, setLastY] = useState(0)

  function handleMouse(event: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

    rotateX.set(rotationX)
    rotateY.set(rotationY)
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)

    const velocityY = offsetY - lastY
    rotateFigcaption.set(-velocityY * 0.6)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
    opacity.set(1)
  }

  function handleMouseLeave() {
    opacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
  }

  return (
    <figure
      className="tilted-card-figure"
      data-react-bits="TiltedCard"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouse}
      ref={ref}
      style={{ height: containerHeight, width: containerWidth }}
    >
      {showMobileWarning ? <div className="tilted-card-mobile-alert">This effect is not optimized for mobile. Check on desktop.</div> : null}

      <motion.div
        className={`tilted-card-inner ${imageSrc ? '' : 'tilted-card-inner--content'}`}
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {imageSrc ? (
          <motion.img
            alt={altText}
            className="tilted-card-img"
            src={imageSrc}
            style={{ width: imageWidth, height: imageHeight }}
          />
        ) : null}

        {displayOverlayContent && overlayContent ? <motion.div className="tilted-card-overlay">{overlayContent}</motion.div> : null}
      </motion.div>

      {showTooltip ? (
        <motion.figcaption className="tilted-card-caption" style={{ x, y, opacity, rotate: rotateFigcaption }}>
          {captionText}
        </motion.figcaption>
      ) : null}
    </figure>
  )
}

export default TiltedCard
