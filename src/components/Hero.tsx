import { GREEN } from '../data/tf24'

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'transparent',
        borderBottom: '1px solid rgba(243,243,243,0.08)',
      }}
    >
      {/* Readability overlay only — never touches the locked background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.05) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Football — the only animated element */}
      <div
        className="tf24-hero-ball tf24-ball"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 48,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="22" stroke={GREEN} strokeWidth="2" fill="rgba(0,0,0,0.35)" />
          <path
            d="M24 4 L31.5 14.5 L27 25.5 H21 L16.5 14.5 Z"
            fill="rgba(57,247,42,0.30)"
            stroke={GREEN}
            strokeWidth="1.4"
          />
          <path
            d="M24 44 L16.5 33.5 L21 22.5 H27 L31.5 33.5 Z"
            fill="rgba(57,247,42,0.12)"
            stroke={GREEN}
            strokeWidth="1.4"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        className="tf24-container"
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100svh',
          paddingTop: 36,
          paddingBottom: 36,
        }}
      >
        <div className="tf24-hero-in" style={{ maxWidth: 820, width: '100%' }}>
          <h1
            className="tf24-hero-h1 tf24-display"
            style={{
              fontSize: 'clamp(64px, 6vw, 104px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              margin: 0,
              textAlign: 'left',
              fontWeight: 800,
            }}
          >
            Book Your Game
            <br />
            Own The <span className="tf24-grad-word" style={{ color: GREEN }}>Turf</span>
          </h1>

          <p
            className="tf24-hero-sub"
            style={{
              margin: '26px 0 0',
              maxWidth: 480,
              fontFamily: 'Space Grotesk',
              fontSize: 16.5,
              lineHeight: 1.6,
              color: 'rgba(243,243,243,0.8)',
            }}
          >
            Find premium football turfs near you.
            <br />
            Check availability, choose your slot and
            <br />
            book your game in seconds.
          </p>

          <div className="tf24-hero-actions" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
            <a
              href="/booking"
              className="tf24-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 50, padding: '0 28px', fontSize: 13, borderRadius: 4 }}
            >
              Book Your Spot <span className="tf24-arrow">→</span>
            </a>
            <a
              href="/booking"
              className="tf24-btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 50, padding: '0 28px', fontSize: 13, borderRadius: 4 }}
            >
              Explore Turfs
            </a>
            <div className="tf24-hero-clock-wrap" style={{ marginLeft: 'auto' }}>
              <div className="tf24-hero-clock">
                <span className="tf24-clock-hand tf24-clock-h" />
                <span className="tf24-clock-hand tf24-clock-m" />
                <div className="tf24-clock-face">
                  <span className="tf24-clock-center">24/7</span>
                  <span className="tf24-clock-sub">Opens</span>
                </div>
                <span className="tf24-clock-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
