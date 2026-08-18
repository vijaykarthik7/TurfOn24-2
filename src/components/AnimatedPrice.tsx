import { useEffect, useRef, useState } from 'react'
import { GREEN } from '../data/tf24'

type Phase = 'idle' | 'loading' | 'counting' | 'done'

export default function AnimatedPrice() {
  const ref = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true
            setPhase('loading')
          }
        })
      },
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('counting'), 1900)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'counting') return
    const start = performance.now()
    const dur = 1400
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * 700))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setPhase('done')
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  const done = phase === 'done'

  return (
    <div
      ref={ref}
      className={'tf24-price-anim' + (done ? ' done' : '')}
      style={{ opacity: phase === 'idle' ? 0 : 1, transition: 'opacity 0.6s ease' }}
    >
      <div className="tf24-price-row">
        <span className="tf24-price-trail left" />
        <div className="tf24-price-stage">
          {!done && (
            <div className="tf24-price-spinner-wrap">
              <svg className="tf24-price-spinner" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(57,247,42,0.14)" strokeWidth="2.5" />
                <circle cx="60" cy="60" r="54" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="95 250" />
              </svg>
            </div>
          )}
          <div className="tf24-price-value">₹{value}</div>
          <div className="tf24-price-sub">{done ? 'Per Hour' : 'Loading'}</div>
        </div>
        <span className="tf24-price-trail right" />
      </div>
    </div>
  )
}
