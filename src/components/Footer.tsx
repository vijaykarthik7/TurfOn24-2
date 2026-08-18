import { GREEN, LIME } from '../data/tf24'
import logoTagline from '../assets/turfon24-logo-tagline.png?url'

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

const COMPANY = ['Privacy Policy', 'Terms & Conditions', 'Refund Policy']

const SOCIALS = ['Instagram', 'Facebook', 'YouTube', 'X']

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 2, background: 'rgba(0,0,0,0.95)', borderTop: '1px solid rgba(243,243,243,0.08)', padding: '64px 0 40px' }}>
      <div className="tf24-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40 }} className="tf24-footer-grid">
          <div>
            <img
              src={logoTagline}
              alt="TURFON24"
              style={{ height: 44, width: 'auto', display: 'block' }}
            />
            <p style={{ margin: '14px 0 0', fontFamily: 'Space Grotesk', fontSize: 13, lineHeight: 1.75, color: 'rgba(243,243,243,0.55)', maxWidth: 260 }}>
              Turf always is on.
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 18 }}>Quick Links</div>
            {QUICK_LINKS.map(l => (
              <a key={l.label} href={l.href} style={{ display: 'block', fontFamily: 'Space Grotesk', fontSize: 13.5, color: 'rgba(243,243,243,0.75)', textDecoration: 'none', marginBottom: 11, transition: 'color 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.color = LIME)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,243,243,0.75)')}>
                {l.label}
              </a>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 18 }}>Company</div>
            {COMPANY.map(l => (
              <span key={l} style={{ display: 'block', fontFamily: 'Space Grotesk', fontSize: 13.5, color: 'rgba(243,243,243,0.75)', marginBottom: 11, cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.color = LIME)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,243,243,0.75)')}>
                {l}
              </span>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 18 }}>Follow Us</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SOCIALS.map(s => (
                <span
                  key={s}
                  style={{
                    padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(243,243,243,0.2)', color: 'rgba(243,243,243,0.8)', fontSize: 11.5,
                    letterSpacing: '0.06em', cursor: 'pointer',
                    transition: 'border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = LIME; e.currentTarget.style.color = LIME; e.currentTarget.style.boxShadow = '0 0 14px rgba(199,244,45,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(243,243,243,0.2)'; e.currentTarget.style.color = 'rgba(243,243,243,0.8)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 44, borderTop: '1px solid rgba(243,243,243,0.08)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(243,243,243,0.45)' }}>
            © 2026 TURFON24. All rights reserved.
          </div>
          <a href="/admin" style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.3)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.color = LIME)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,243,243,0.3)')}>
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}
