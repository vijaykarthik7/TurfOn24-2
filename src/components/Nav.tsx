import { useEffect, useState } from 'react'
import { GREEN } from '../data/tf24'

const logoTagline = new URL('../assets/turfon24-logo-tagline.png', import.meta.url).href

const LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Features', id: 'features' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Contact', id: 'contact' },
]

export default function Nav() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const known = [...LINKS.map(l => l.id), 'booking']

    let lockUntilHash: string | null = null
    let lockTimer: number | undefined

    const syncFromHash = () => {
      const h = window.location.hash.replace('#', '')
      if (known.includes(h)) {
        setActive(h)
        lockUntilHash = h
        if (lockTimer) window.clearTimeout(lockTimer)
        lockTimer = window.setTimeout(() => { lockUntilHash = null }, 1200)
      }
    }

    const pickActive = () => {
      const mid = window.innerHeight / 2

      if (lockUntilHash) {
        const target = document.getElementById(lockUntilHash)
        if (target) {
          const r = target.getBoundingClientRect()
          if (r.top <= mid && r.bottom >= mid) {
            lockUntilHash = null
          } else {
            setActive(lockUntilHash)
            return
          }
        } else {
          lockUntilHash = null
        }
      }

      let best: string | null = null
      let bestDist = Infinity
      for (const id of known) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > window.innerHeight) continue
        const dist = Math.abs(r.top + r.height / 2 - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = id
        }
      }
      if (best) setActive(best)
    }

    syncFromHash()
    pickActive()
    window.addEventListener('hashchange', syncFromHash)
    window.addEventListener('scroll', pickActive, { passive: true })
    window.addEventListener('resize', pickActive, { passive: true })

    return () => {
      if (lockTimer) window.clearTimeout(lockTimer)
      window.removeEventListener('hashchange', syncFromHash)
      window.removeEventListener('scroll', pickActive)
      window.removeEventListener('resize', pickActive)
    }
  }, [])

  const linkStyle = (id: string): React.CSSProperties => ({
    fontFamily: 'Space Grotesk',
    fontSize: 14.5,
    fontWeight: 500,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: active === id ? GREEN : '#F3F3F3',
    padding: '6px 0',
    borderBottom: `1px solid ${active === id ? GREEN : 'transparent'}`,
    transition: 'color 0.2s ease, border-color 0.2s ease',
  })

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.78), rgba(0,0,0,0.35))',
        borderBottom: '1px solid rgba(243,243,243,0.08)',
      }}
    >
      <div
        className="tf24-container"
        style={{
          height: 88,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        {/* Left: logo + tagline */}
        <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center' }}>
          <a href="#home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
            <img
              src={logoTagline}
              alt="TURFON24 — Premium Turfs 24/7"
              style={{ height: 52, width: 'auto', maxWidth: 'none', display: 'block' }}
            />
          </a>
        </div>

        {/* Center: nav */}
        <nav className="tf24-nav-desktop" style={{ justifySelf: 'center', display: 'flex', gap: 32, alignItems: 'center' }}>
          {LINKS.map(l => (
            <a key={l.id} href={`#${l.id}`} style={linkStyle(l.id)}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right: Book Now */}
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="#booking"
            className="tf24-book-desktop tf24-btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              height: 46,
              padding: '0 24px',
              fontSize: 13,
              borderRadius: 4,
              whiteSpace: 'nowrap',
              background: active === 'booking' ? '#C7F42D' : undefined,
              boxShadow: active === 'booking' ? '0 0 26px rgba(57,247,42,0.5)' : undefined,
            }}
          >
            Book Now <span className="tf24-arrow">→</span>
          </a>

          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            className="tf24-nav-toggle"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: '1px solid rgba(243,243,243,0.2)',
              color: '#F3F3F3',
              cursor: 'pointer',
              width: 40,
              height: 40,
              borderRadius: 4,
            }}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
              <line x1="1" y1="2" x2="21" y2="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="1" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="1" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div style={{ background: '#000000', borderTop: '1px solid rgba(243,243,243,0.08)', padding: '12px 0 24px' }}>
          <div className="tf24-container" style={{ display: 'flex', flexDirection: 'column' }}>
            {LINKS.map(l => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: active === l.id ? GREEN : '#F3F3F3',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(243,243,243,0.08)',
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              style={{
                marginTop: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                background: active === 'booking' ? '#C7F42D' : GREEN,
                color: '#000000',
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                height: 50,
                textDecoration: 'none',
                borderRadius: 4,
                boxShadow: active === 'booking' ? '0 0 26px rgba(57,247,42,0.5)' : 'none',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              Book Now <span>→</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
