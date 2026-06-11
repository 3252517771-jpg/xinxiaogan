import type { ReactNode } from 'react'
import TiltedCard from '@/components/react-bits/TiltedCard'

interface TiltedPanelProps {
  children: ReactNode
  caption?: string
  minHeight?: string
}

function TiltedPanel({ children, caption = '健康卡片', minHeight = '180px' }: TiltedPanelProps) {
  return (
    <TiltedCard
      captionText={caption}
      containerHeight={minHeight}
      containerWidth="100%"
      displayOverlayContent
      imageHeight="100%"
      imageWidth="100%"
      overlayContent={<div className="h-full w-full">{children}</div>}
      rotateAmplitude={5}
      scaleOnHover={1.015}
      showMobileWarning={false}
      showTooltip={false}
    />
  )
}

export default TiltedPanel
