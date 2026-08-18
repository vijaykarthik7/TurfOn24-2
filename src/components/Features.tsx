import { type ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'
import { GREEN, CHROME } from '../data/tf24'

const iconProps = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const FEATURES: { num: string; title: string; desc: string; icon: ReactNode }[] = [
  {
    num: '01',
    title: 'Premium Turf',
    desc: 'Professional-quality playing surface designed for a better game.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="3" y="9" width="18" height="12" rx="1.5" />
        <circle cx="12" cy="15" r="3.2" />
        <path d="M12 2v3M9 2.6l6 1.2" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Seating Area',
    desc: 'Comfortable sidelines designed for players, coaches and supporters.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M5 12h14v3H5z" />
        <path d="M3 15h18v3H3z" />
        <path d="M6 18v3M18 18v3" />
        <path d="M7 9h10v3H7z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Instant Confirmation',
    desc: 'Lock your selected slot and receive immediate booking confirmation.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Flexible Playing Hours',
    desc: 'Choose the time that works best for your team.',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="3" y="4.5" width="18" height="17" rx="2" />
        <path d="M8 2v4.5M16 2v4.5M3 9.5h18" />
        <circle cx="12" cy="15.5" r="3.4" />
        <path d="M12 13.5v2l1.4 1.3" />
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
      <div style={{ position: 'absolute', top: -30, right: -18, fontFamily: 'Bebas Neue', fontSize: 320, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,247,42,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        GAME.
      </div>

      <div className="tf24-features-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#18AAC0', textShadow: '0 0 14px rgba(24,170,192,0.5)', paddingLeft: '0.45em' }}>
              Why Turf on 24
            </span>
            <span style={{ width: 64, height: 2, background: '#18AAC0' }} />
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
              <span className="tf24-feat-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
