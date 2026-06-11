import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import '@/styles/pill-nav.css'

export interface PillNavItem {
  label: string
  href: string
  ariaLabel?: string
  onClick?: () => void
}

interface PillNavProps {
  items: PillNavItem[]
  className?: string
  activeHref?: string
  baseColor?: string
  pillColor?: string
  pillTextColor?: string
  hoveredPillTextColor?: string
}

function PillNav({
  items,
  className = '',
  activeHref,
  baseColor = 'rgba(8, 15, 11, 0.92)',
  pillColor = 'rgba(255, 255, 255, 0.94)',
  pillTextColor = '#0f1c15',
  hoveredPillTextColor = '#ffffff',
}: PillNavProps) {
  const location = useLocation()
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const timelineRefs = useRef<Array<gsap.core.Timeline | null>>([])
  const navRef = useRef<HTMLDivElement | null>(null)
  const currentHref = activeHref ?? location.pathname

  useEffect(() => {
    circleRefs.current.forEach((circle, index) => {
      if (!circle?.parentElement) return

      const pill = circle.parentElement
      const rect = pill.getBoundingClientRect()
      const radius = ((rect.width * rect.width) / 4 + rect.height * rect.height) / (2 * rect.height)
      const diameter = Math.ceil(2 * radius) + 2
      const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (rect.width * rect.width) / 4))) + 1
      const originY = diameter - delta

      circle.style.width = `${diameter}px`
      circle.style.height = `${diameter}px`
      circle.style.bottom = `-${delta}px`
      gsap.set(circle, { scale: 0, xPercent: -50, transformOrigin: `50% ${originY}px` })

      const label = pill.querySelector<HTMLElement>('.pill-nav-label')
      const hoverLabel = pill.querySelector<HTMLElement>('.pill-nav-hover-label')
      gsap.set(label, { y: 0 })
      gsap.set(hoverLabel, { y: rect.height + 12, opacity: 0 })

      timelineRefs.current[index]?.kill()
      const timeline = gsap.timeline({ paused: true })
      timeline.to(circle, { duration: 1.2, ease: 'power3.out', scale: 1.2, xPercent: -50 }, 0)
      timeline.to(label, { duration: 1.2, ease: 'power3.out', y: -(rect.height + 8) }, 0)
      timeline.to(hoverLabel, { duration: 1.2, ease: 'power3.out', opacity: 1, y: 0 }, 0)
      timelineRefs.current[index] = timeline
    })

    if (navRef.current) {
      gsap.fromTo(navRef.current, { opacity: 0 }, { duration: 0.5, ease: 'power3.out', opacity: 1 })
    }
  }, [items])

  const cssVars = {
    '--pill-nav-base': baseColor,
    '--pill-nav-bg': pillColor,
    '--pill-nav-text': pillTextColor,
    '--pill-nav-hover-text': hoveredPillTextColor,
  } as CSSProperties

  return (
    <div className={`pill-nav-shell ${className}`} ref={navRef} style={cssVars}>
      <nav aria-label="Primary navigation" className="pill-nav-track">
        <ul className="pill-nav-list">
          <li>
            <Link
              aria-label="返回首页"
              className={`pill-nav-link${currentHref === '/' ? ' is-active' : ''}`}
              onMouseEnter={() => timelineRefs.current[0]?.tweenTo(timelineRefs.current[0]?.duration() ?? 0, { duration: 0.28, ease: 'power3.out' })}
              onMouseLeave={() => timelineRefs.current[0]?.tweenTo(0, { duration: 0.2, ease: 'power3.out' })}
              to="/"
            >
              <span
                aria-hidden="true"
                className="pill-nav-hover-circle"
                ref={(element) => {
                  circleRefs.current[0] = element
                }}
              />
              <span className="pill-nav-label-stack">
                <span className="pill-nav-label">小心肝</span>
                <span aria-hidden="true" className="pill-nav-hover-label">
                  小心肝
                </span>
              </span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href}>
              {item.onClick ? (
                <button
                  aria-label={item.ariaLabel ?? item.label}
                  className="pill-nav-link"
                  onClick={item.onClick}
                  onMouseEnter={() => timelineRefs.current[index + 1]?.tweenTo(timelineRefs.current[index + 1]?.duration() ?? 0, { duration: 0.28, ease: 'power3.out' })}
                  onMouseLeave={() => timelineRefs.current[index + 1]?.tweenTo(0, { duration: 0.2, ease: 'power3.out' })}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="pill-nav-hover-circle"
                    ref={(element) => {
                      circleRefs.current[index + 1] = element
                    }}
                  />
                  <span className="pill-nav-label-stack">
                    <span className="pill-nav-label">{item.label}</span>
                    <span aria-hidden="true" className="pill-nav-hover-label">
                      {item.label}
                    </span>
                  </span>
                </button>
              ) : (
                <Link
                  aria-label={item.ariaLabel ?? item.label}
                  className={`pill-nav-link${currentHref === item.href ? ' is-active' : ''}`}
                  onMouseEnter={() => timelineRefs.current[index + 1]?.tweenTo(timelineRefs.current[index + 1]?.duration() ?? 0, { duration: 0.28, ease: 'power3.out' })}
                  onMouseLeave={() => timelineRefs.current[index + 1]?.tweenTo(0, { duration: 0.2, ease: 'power3.out' })}
                  to={item.href}
                >
                  <span
                    aria-hidden="true"
                    className="pill-nav-hover-circle"
                    ref={(element) => {
                      circleRefs.current[index + 1] = element
                    }}
                  />
                  <span className="pill-nav-label-stack">
                    <span className="pill-nav-label">{item.label}</span>
                    <span aria-hidden="true" className="pill-nav-hover-label">
                      {item.label}
                    </span>
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default PillNav
