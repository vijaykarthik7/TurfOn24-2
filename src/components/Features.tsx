import { type ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'
import { GREEN, CHROME } from '../data/tf24'

const BLUE = '#00C9FF'
const BLUE_LIGHT = '#39FF7A'

const iconProps = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const FEATURES: { num: string; title: string; desc: string; icon: ReactNode }[] = [
  {
    num: '01',
    title: 'Premium Turf',
    desc: 'Professional-quality playing surface designed for a better game.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Seating Area',
    desc: 'Comfortable sidelines designed for players, coaches and supporters.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M4 18v-6a2 2 0 012-2h12a2 2 0 012 2v6" />
        <path d="M6 18h12" />
        <path d="M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Instant Confirmation',
    desc: 'Lock your selected slot and receive immediate booking confirmation.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Flexible Playing Hours',
    desc: 'Choose the time that works best for your team.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
]

export default function Features() {
  const headRef = useReveal<HTMLDivElement>('in', 0.15)
  const listRef = useReveal<HTMLDivElement>('in', 0.08)

  return (
    <section id="features" style={{ position: 'relative', zIndex: 2, background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '120px 0' }}>
      <div className="pitch-lines" />

      {/* Watermark */}
      <div style={{ position: 'absolute', top: -30, right: -18, fontFamily: 'Bebas Neue', fontSize: 320, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,255,122,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        GAME.
      </div>

      <div className="tf24-features-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#39FF7A', textShadow: '0 0 14px rgba(57,255,122,0.5)', paddingLeft: '0.45em' }}>
              Why Turf on 24
            </span>
            <span style={{ width: 64, height: 2, background: '#39FF7A' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(56px, 8vw, 128px)', textTransform: 'uppercase', lineHeight: 0.88, margin: 0, color: CHROME }}>
            Built for the
            <br />
            <span className="tf24-grad-word" style={{ color: GREEN }}>Game.</span>
          </h2>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, lineHeight: 1.7, color: 'rgba(243,243,243,0.75)', maxWidth: 500, margin: '22px auto 0' }}>
            Everything you need for a premium turf experience, from booking to the final whistle.
          </p>
        </div>

        {/* Feature list */}
        <div ref={listRef} className="reveal" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {FEATURES.map((f, i) => (
            <div key={f.num} className={'tf24-feat-item' + (i % 2 === 1 ? ' alt' : '')}>
              <span className="tf24-feat-num">{f.num}</span>
              <span className="tf24-feat-icon">{f.icon}</span>
              <div className="tf24-feat-body">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
              <span className="tf24-feat-line" />
              <span className="tf24-feat-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
