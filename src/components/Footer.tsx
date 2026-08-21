import { CYAN, LIME } from '../data/tf24'
import logoTagline from '../assets/Tagline.png'

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
    <footer style={{ position: 'relative', zIndex: 2, background: 'rgba(11,24,36,0.55)', borderTop: '1px solid rgba(243,243,243,0.08)', padding: '26px 0 16px' }}>
      {/* Blue atmospheric shade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 28%, rgba(0,201,255,0.14), transparent 62%)',
          pointerEvents: 'none',
        }}
      />

      {/* Blue-blue-black bottom fade - same as Hero */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 200,
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(3,12,20,0) 0%, rgba(3,15,25,0.35) 55%, rgba(3,15,25,0.75) 100%)',
        }}
      />
      <div className="tf24-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 32 }} className="tf24-footer-grid">
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
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 12 }}>Quick Links</div>
            {QUICK_LINKS.map(l => (
              <a key={l.label} href={l.href} style={{ display: 'block', fontFamily: 'Space Grotesk', fontSize: 13.5, color: CYAN, textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.color = LIME)} onMouseLeave={e => (e.currentTarget.style.color = CYAN)}>
                {l.label}
              </a>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 12 }}>Company</div>
            {COMPANY.map(l => (
              <span key={l} style={{ display: 'block', fontFamily: 'Space Grotesk', fontSize: 13.5, color: 'rgba(243,243,243,0.75)', marginBottom: 8, cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.color = LIME)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(243,243,243,0.75)')}>
                {l}
              </span>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 12 }}>Follow Us</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              {SOCIALS.map(s => (
                <span
                  key={s}
                  style={{
                    padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${CYAN}`, color: CYAN, fontSize: 11.5,
                    letterSpacing: '0.06em', cursor: 'pointer',
                    transition: 'border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = LIME; e.currentTarget.style.color = LIME; e.currentTarget.style.boxShadow = '0 0 25px rgba(57,255,122,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = CYAN; e.currentTarget.style.color = CYAN; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, borderTop: '1px solid rgba(243,243,243,0.08)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(243,243,243,0.45)' }}>
            © 2026 TURFON24. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
