import { useEffect, useRef, useState } from 'react'

export default function AvailabilityBadge({ delay = 1200 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const t = setTimeout(() => setInView(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const max = 5
    setOffset({
      x: Math.max(-max, Math.min(max, (dx / (r.width / 2)) * max)),
      y: Math.max(-max, Math.min(max, (dy / (r.height / 2)) * max)),
    })
  }

  const onLeave = () => {
    setOffset({ x: 0, y: 0 })
    setHover(false)
  }

  return (
    <div
      ref={ref}
      className={inView ? 'badge-wrap in' : 'badge-wrap'}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
    >
      <div
        className="badge-parallax"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${hover ? 1.03 : 1})` }}
      >
        <div className="badge-float">
          <div className="badge-card">
            <div className="badge-clock">
              <span className="badge-clock-hand badge-clock-minute" />
              <span className="badge-clock-hand badge-clock-hour" />
              <span className="badge-clock-dot" />
              <span className="badge-247">
                <span className="badge-247-text">24/7</span>
                <span className="badge-eyebrow">Open Every Day</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
