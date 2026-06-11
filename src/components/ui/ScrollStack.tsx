import { useCallback, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import '@/styles/scroll-stack.css'

interface ScrollStackItemProps {
  itemClassName?: string
  children: ReactNode
}

export function ScrollStackItem({ children, itemClassName = '' }: ScrollStackItemProps) {
  return <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
}

interface ScrollStackProps {
  className?: string
  children: ReactNode
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  rotationAmount?: number
  blurAmount?: number
  useWindowScroll?: boolean
  onStackComplete?: () => void
}

interface CardTransform {
  translateY: number
  scale: number
  rotation: number
  blur: number
}

type ScrollContainer = HTMLElement | Document | Window

function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const lastTransformsRef = useRef(new Map<number, CardTransform>())
  const isUpdatingRef = useRef(false)

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePosition = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (Number.parseFloat(value) / 100) * containerHeight
    }

    return Number.parseFloat(String(value))
  }, [])

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement as ScrollContainer,
      }
    }

    const scroller = scrollerRef.current
    return {
      scrollTop: scroller?.scrollTop ?? 0,
      containerHeight: scroller?.clientHeight ?? window.innerHeight,
      scrollContainer: scroller as ScrollContainer,
    }
  }, [useWindowScroll])

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect()
        return rect.top + window.scrollY
      }

      return element.offsetTop
    },
    [useWindowScroll],
  )

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return

    isUpdatingRef.current = true

    const { scrollTop, containerHeight } = getScrollData()
    const stackPositionPx = parsePosition(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePosition(scaleEndPosition, containerHeight)
    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
      : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null)
    const endElementTop = endElement ? getElementOffset(endElement) : 0

    cardsRef.current.forEach((card, index) => {
      const cardTop = getElementOffset(card)
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * index
      const pinEnd = endElementTop - containerHeight / 2

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + index * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0
      let blur = 0

      if (blurAmount) {
        let topCardIndex = 0
        for (let nextIndex = 0; nextIndex < cardsRef.current.length; nextIndex += 1) {
          const nextCard = cardsRef.current[nextIndex]
          if (!nextCard) continue

          const nextCardTop = getElementOffset(nextCard)
          const nextTriggerStart = nextCardTop - stackPositionPx - itemStackDistance * nextIndex
          if (scrollTop >= nextTriggerStart) topCardIndex = nextIndex
        }

        if (index < topCardIndex) {
          blur = Math.max(0, (topCardIndex - index) * blurAmount)
        }
      }

      let translateY = 0
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index
      }

      const nextTransform: CardTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const lastTransform = lastTransformsRef.current.get(index)
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - nextTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - nextTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - nextTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - nextTransform.blur) > 0.1

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`
        card.style.filter = nextTransform.blur > 0 ? `blur(${nextTransform.blur}px)` : ''
        lastTransformsRef.current.set(index, nextTransform)
      }

      if (index === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    baseScale,
    blurAmount,
    calculateProgress,
    getElementOffset,
    getScrollData,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePosition,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
    useWindowScroll,
  ])

  const handleScroll = useCallback(() => {
    updateCardTransforms()
  }, [updateCardTransforms])

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (time: number) => Math.min(1, 1.001 - 2 ** (-10 * time)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      })

      lenis.on('scroll', handleScroll)
      lenisRef.current = lenis
    } else {
      const scroller = scrollerRef.current
      if (!scroller) return

      const content = scroller.querySelector('.scroll-stack-inner') as HTMLElement | null
      if (!content) return

      const lenis = new Lenis({
        wrapper: scroller,
        content,
        duration: 1.2,
        easing: (time: number) => Math.min(1, 1.001 - 2 ** (-10 * time)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      })

      lenis.on('scroll', handleScroll)
      lenisRef.current = lenis
    }

    const raf = (time: number) => {
      lenisRef.current?.raf(time)
      animationFrameRef.current = requestAnimationFrame(raf)
    }
    animationFrameRef.current = requestAnimationFrame(raf)
  }, [handleScroll, useWindowScroll])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const cards = Array.from(
      useWindowScroll ? document.querySelectorAll('.scroll-stack-card') : scroller.querySelectorAll('.scroll-stack-card'),
    ) as HTMLElement[]

    cardsRef.current = cards
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`
      }
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
      card.style.perspective = '1000px'
    })

    setupLenis()
    const scrollTarget = useWindowScroll ? window : scroller
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
    updateCardTransforms()

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      lenisRef.current?.destroy()
      stackCompletedRef.current = false
      cardsRef.current = []
      lastTransformsRef.current.clear()
      isUpdatingRef.current = false
    }
  }, [handleScroll, itemDistance, setupLenis, updateCardTransforms, useWindowScroll])

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}

export default ScrollStack
