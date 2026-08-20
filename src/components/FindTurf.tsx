import { GREEN, DEEP, GROUP_PLAYERS } from '../data/tf24'
import Reveal from './Reveal'

export default function FindTurf() {
  return (
    <section id="find" style={{ position: 'relative', zIndex: 2, background: 'radial-gradient(ellipse at 72% 50%, rgba(23,107,2,0.2), rgba(0,0,0,0) 60%)', backgroundColor: 'rgba(0,0,0,0.92)', padding: '120px 0' }}>
      {/* Vertical outlined PLAY, far right */}
      <div
        className="tf24-vertical tf24-outline"
        style={{
          position: 'absolute',
          right: 0,
          top: 40,
          bottom: 40,
          zIndex: 0,
          fontSize: 170,
          fontFamily: 'Bebas Neue',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(23,107,2,0.22)',
          pointerEvents: 'none',
        }}
      >
        PLAY
      </div>

      <div className="tf24-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="tf24-find-layout" style={{ display: 'grid', gridTemplateColumns: '45fr 55fr', gap: 96, alignItems: 'center' }}>
          <Reveal>
            <div style={{ maxWidth: 460 }}>
              <div className="tf24-kicker" style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.35em', color: GREEN, marginBottom: 24 }}>
                Discover
              </div>
              <h2 className="tf24-display" style={{ fontSize: 'clamp(48px, 6.5vw, 88px)', margin: '0 0 38px', lineHeight: 0.9, fontWeight: 800 }}>
                Find Your
                <br />
                Perfect
                <br />
                <span style={{ color: GREEN }}>Turf</span>
              </h2>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: 17, lineHeight: 1.7, color: 'rgba(243,243,243,0.7)', margin: '0 0 38px', maxWidth: 500 }}>
                From quick matches with friends to competitive games, discover a turf that fits
                your game.
              </p>
              <a href="/booking" className="tf24-btn-primary" style={{ width: 264, height: 60, padding: '18px 28px', justifyContent: 'center', fontSize: 15, letterSpacing: '0.13em' }}>
                Explore Turfs <span className="tf24-arrow">→</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div style={{ position: 'relative', minHeight: 440 }}>
              {/* green atmosphere */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 70% 60%, rgba(23,107,2,0.5), transparent 68%)',
                }}
              />
              <img
                src={GROUP_PLAYERS}
                alt="Players in action"
                style={{
                  position: 'relative',
                  width: '92%',
                  height: 380,
                  objectFit: 'cover',
                  filter: 'grayscale(1) contrast(1.2) brightness(0.6)',
                  mixBlendMode: 'multiply',
                  display: 'block',
                  marginLeft: 'auto',
                }}
              />
              {/* dust / splash near feet */}
              <div
                style={{
                  position: 'absolute',
                  left: '18%',
                  bottom: 34,
                  width: 190,
                  height: 70,
                  background: 'radial-gradient(ellipse at center, rgba(23,107,2,0.55), transparent 70%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '6%',
                  bottom: 20,
                  width: 230,
                  height: 90,
                  background: 'radial-gradient(ellipse at center, rgba(57,255,122,0.28), transparent 70%)',
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
