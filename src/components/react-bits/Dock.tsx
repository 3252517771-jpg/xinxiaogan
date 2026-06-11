import {
  AnimatePresence,
  motion,
  type MotionValue,
  type SpringOptions,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import './Dock.css'

export type DockItemData = {
  icon: ReactNode
  label: ReactNode
  onClick: () => void
  className?: string
}

export type DockProps = {
  items: DockItemData[]
  className?: string
  distance?: number
  panelHeight?: number
  baseItemSize?: number
  dockHeight?: number
  magnification?: number
  spring?: SpringOptions
}

type DockItemProps = {
  className?: string
  children: ReactNode
  onClick?: () => void
  mouseX: MotionValue<number>
  spring: SpringOptions
  distance: number
  baseItemSize: number
  magnification: number
}

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseX, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    }
    return value - rect.x - baseItemSize / 2
  })

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
  const size = useSpring(targetSize, spring)

  return (
    <motion.div
      aria-haspopup="true"
      className={`dock-item ${className}`}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onFocus={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onHoverStart={() => isHovered.set(1)}
      ref={ref}
      role="button"
      style={{ width: size, height: size }}
      tabIndex={0}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child as ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered }) : child,
      )}
    </motion.div>
  )
}

type DockLabelProps = {
  className?: string
  children: ReactNode
  isHovered?: MotionValue<number>
}

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isHovered) return undefined
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1)
    })
    return () => unsubscribe()
  }, [isHovered])

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          animate={{ opacity: 1, y: -10 }}
          className={`dock-label ${className}`}
          exit={{ opacity: 0, y: 0 }}
          initial={{ opacity: 0, y: 0 }}
          role="tooltip"
          style={{ x: '-50%' }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

type DockIconProps = {
  className?: string
  children: ReactNode
}

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>
}

function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [dockHeight, magnification],
  )
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight])
  const height = useSpring(heightRow, spring)

  return (
    <motion.div className="dock-outer" data-react-bits="Dock" style={{ height, scrollbarWidth: 'none' }}>
      <motion.div
        aria-label="Detail page dock"
        className={`dock-panel ${className}`}
        onMouseLeave={() => {
          isHovered.set(0)
          mouseX.set(Infinity)
        }}
        onMouseMove={({ pageX }) => {
          isHovered.set(1)
          mouseX.set(pageX)
        }}
        role="toolbar"
        style={{ height: panelHeight }}
      >
        {items.map((item) => (
          <DockItem
            baseItemSize={baseItemSize}
            className={item.className}
            distance={distance}
            key={String(item.label)}
            magnification={magnification}
            mouseX={mouseX}
            onClick={item.onClick}
            spring={spring}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Dock
