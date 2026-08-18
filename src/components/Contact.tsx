import { type ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'
import { CHROME } from '../data/tf24'

const iconProps = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const ICONS: Record<string, ReactNode> = {
  address: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  phone: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M5.5 4h3l1.5 4-2 1.5a12 12 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 013.5 6.2 2 2 0 015.5 4z" />
    </svg>
  ),
  email: (
    <svg {...iconProps} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  ),
}

export default function Contact() {
  const ref = useReveal<HTMLDivElement>('in', 0.1)

  const items = [
    { key: 'address', label: 'Address', value: '[Full Turf Address]' },
    { key: 'phone', label: 'Phone', value: '[Phone Number]' },
    { key: 'email', label: 'Email', value: '[Email Address]' },
  ]

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 2, background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '120px 0' }}>
      <div className="pitch-lines" />
      <div style={{ position: 'absolute', top: -30, left: -24, fontFamily: 'Bebas Neue', fontSize: 260, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,247,42,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        TOUCH.
      </div>

      <div className="tf24-container">
        <div ref={ref} className="reveal">
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#18AAC0', textShadow: '0 0 14px rgba(24,170,192,0.5)', paddingLeft: '0.45em' }}>
                Contact
              </span>
              <span style={{ width: 64, height: 2, background: '#18AAC0' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(56px, 8vw, 128px)', textTransform: 'uppercase', lineHeight: 0.88, margin: 0, color: CHROME }}>
              Get in
              <br />
              <span className="tf24-grad-word" style={{ color: '#C7F42D' }}>touch.</span>
            </h2>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, lineHeight: 1.7, color: 'rgba(243,243,243,0.75)', maxWidth: 440, margin: '22px auto 0' }}>
              Have a question? Reach out to us.
            </p>
          </div>

          {/* Contact details */}
          <div className="tf24-contact-grid">
            {items.map(item => (
              <div key={item.key} className="tf24-contact-item">
                <span className="tf24-contact-icon">{ICONS[item.key]}</span>
                <div className="tf24-contact-label">{item.label}</div>
                <span className="tf24-contact-accent" />
                <div className="tf24-contact-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}