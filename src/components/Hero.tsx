import { GREEN } from '../data/tf24'

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 'auto',
        overflow: 'hidden',
        background: 'transparent',
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

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 28%, rgba(0,201,255,0.14), transparent 62%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Single fixed global background (App-level .bg-3d) shows through — no local image copy */}

      {/* Hero bottom subtle transition fade */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          pointerEvents: 'none',
          zIndex: 2,
          background:
            'linear-gradient(to bottom, rgba(3,12,20,0) 0%, rgba(3,15,25,0.12) 60%, rgba(3,15,25,0.28) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="tf24-container"
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '200px',
          paddingBottom: '32px',
        }}
      >
        <div className="tf24-hero-in" style={{ maxWidth: 620, width: '100%' }}>
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
              margin: '18px 0 0',
              maxWidth: 560,
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

          <div className="tf24-hero-actions" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
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
            <div className="tf24-hero-clock-wrap" style={{ marginLeft: 'auto', transform: 'translate(-10px, 8px)' }}>
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
